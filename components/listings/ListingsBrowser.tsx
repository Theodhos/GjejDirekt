"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ListingResults from "@/components/listings/ListingResults";
import { useLanguage } from "@/context/LanguageContext";
import { categories, getCategoryByValue, getSubcategorySearchValues } from "@/lib/constants";

/** The pictures the "all businesses" banner is made of — one from each of a few big categories. */
const MIXED_BANNER_CATEGORIES = ["ushqim-pije", "hotele", "shopping", "turizem"];

/**
 * The "Kërko" destination. One results screen for every category — the photo banner,
 * search field, Filtra · city · sort row and the list of rows — scoped by the URL:
 * `?category=` (and `?subcategory=`) narrows it to one category and swaps the banner
 * for that category's picture, `?q=` and `?city=` prefill the search and city.
 * Filtering runs on the already-rendered list so a tap is instant — the server still
 * ships the full set for crawlers.
 */
export default function ListingsBrowser({ listings }: { listings: any[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const { language, t } = useLanguage();
  const en = language === "en";

  const query = params.get("q") || "";
  const activeSubcategory = params.get("subcategory") || "";
  const activeCity = params.get("city") || "";

  // An unknown ?category= is ignored, like a missing one.
  const category = getCategoryByValue(params.get("category") || "");
  const subcategory = category?.subcategories.find(
    (sub) => sub.value === activeSubcategory || sub.aliases?.includes(activeSubcategory)
  );

  /** Rewrites search params while preserving the rest; an empty value removes the param. */
  function pushParams(changes: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.push(next.toString() ? `/listings?${next}` : "/listings", { scroll: false });
  }

  const scoped = useMemo(() => {
    if (!category) return listings;
    const subValues = activeSubcategory
      ? getSubcategorySearchValues(category.value, activeSubcategory).map((value) => value.toLowerCase())
      : [];
    return listings.filter((listing) => {
      const value = String(listing.category || "").toLowerCase();
      if (value !== category.value && !category.aliases.includes(value)) return false;
      return !subValues.length || subValues.includes(String(listing.subcategory || "").toLowerCase());
    });
  }, [listings, category, activeSubcategory]);

  const subLabels = (category && (t.categories.subnames as Record<string, Record<string, string>>)[category.value]) || {};
  const banner = category
    ? {
        image: category.image,
        title: (t.categories.names as Record<string, string>)[category.value] || category.label,
        subtitle: subcategory
          ? subLabels[subcategory.value] || subcategory.label
          : en
          ? "Find the best businesses and services near you"
          : "Gjej bizneset dhe shërbimet më të mira pranë teje",
        category: category.value
      }
    : {
        images: categories.filter((item) => MIXED_BANNER_CATEGORIES.includes(item.value)).map((item) => item.image),
        title: en ? "Search businesses" : "Kërko biznese",
        subtitle: en
          ? "Find the business you need and order or book directly"
          : "Gjej biznesin që të duhet dhe porosit ose rezervo direkt"
      };

  return (
    <ListingResults
      listings={scoped}
      categoryFilters
      category={category?.value ?? ""}
      banner={banner}
      initialQuery={query}
      initialCity={activeCity}
      activeSubcategory={subcategory?.value ?? ""}
      onSubmitQuery={(value) => pushParams({ q: value })}
      onCategorySelect={(value) => pushParams({ category: value, subcategory: "" })}
      onSubcategorySelect={(value) => pushParams({ subcategory: value })}
    />
  );
}
