"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, Search, SlidersHorizontal, X } from "lucide-react";
import BusinessCard from "@/components/home/BusinessCard";
import { categories, getCategoryByValue, getSubcategorySearchValues } from "@/lib/constants";
import { getCategoryIcon } from "@/lib/category-icons";
import { useLanguage } from "@/context/LanguageContext";

type ListingsBrowserProps = {
  listings: any[];
  /** City slugs that actually have listings, used for the city filter row. */
  cities: { value: string; label: string }[];
};

/**
 * The "Kërko" destination: one search field, a category strip that mirrors the
 * home grid, and a city row. Filtering runs on the already-rendered list so a tap
 * is instant — the server still ships the full set for crawlers.
 */
export default function ListingsBrowser({ listings, cities }: ListingsBrowserProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { language } = useLanguage();

  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("recommended");

  const activeCategory = params.get("category") || "";
  const activeSubcategory = params.get("subcategory") || "";
  const activeCity = params.get("city") || "";

  /** Rewrites one search param while preserving the rest. */
  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(next.toString() ? `/listings?${next}` : "/listings", { scroll: false });
  }

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const category = getCategoryByValue(activeCategory);

    const filtered = listings.filter((listing) => {
      if (category) {
        const value = String(listing.category || "").toLowerCase();
        if (value !== category.value && !category.aliases.includes(value)) return false;
      }

      if (activeSubcategory) {
        const values = getSubcategorySearchValues(activeCategory, activeSubcategory);
        const value = String(listing.subcategory || "").toLowerCase();
        if (!values.map((item) => item.toLowerCase()).includes(value)) return false;
      }

      if (activeCity) {
        if (String(listing.location || "").toLowerCase() !== activeCity.toLowerCase()) return false;
      }

      if (normalizedQuery) {
        const haystack = [
          listing.title,
          listing.description,
          listing.location,
          listing.category,
          listing.subcategory,
          ...(listing.tags || [])
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "name") return String(a.title || "").localeCompare(String(b.title || ""));
      if (sort === "rating") return Number(b.ratingAverage || 0) - Number(a.ratingAverage || 0);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [listings, query, activeCategory, activeSubcategory, activeCity, sort]);

  const hasFilters = Boolean(activeCategory || activeSubcategory || activeCity || query);
  const directoryCategory = getCategoryByValue(activeCategory);
  const directorySubcategories = directoryCategory?.subcategories || [];

  return (
    <div className="page-shell space-y-4 py-4 sm:py-6">
      {/* Search */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setParam("q", query.trim());
        }}
        className="flex items-center gap-2"
      >
        <div
          className="flex flex-1 items-center gap-2.5 rounded-xl border px-3.5 py-2"
          style={{ borderColor: "var(--border-medium)", background: "var(--surface-white)" }}
        >
          <Search className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-tertiary)" }} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={language === "en" ? "Search business, product, service..." : "Kërko biznes, produkt, shërbim..."}
            className="w-full bg-transparent py-1.5 text-[15px] font-medium outline-none"
            style={{ color: "var(--text-primary)" }}
            aria-label={language === "en" ? "Search" : "Kërko"}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setParam("q", "");
              }}
              aria-label={language === "en" ? "Clear" : "Pastro"}
            >
              <X className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border sm:hidden"
          style={{
            borderColor: showFilters ? "var(--brand-accent)" : "var(--border-medium)",
            color: showFilters ? "var(--brand-accent)" : "var(--text-secondary)",
            background: "var(--surface-white)"
          }}
          aria-label={language === "en" ? "Filters" : "Filtra"}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="h-[18px] w-[18px]" />
        </button>
      </form>

      {directoryCategory && (
        <section className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border-soft)", background: "var(--surface-white)" }}>
          <div className="relative h-40 overflow-hidden sm:h-52">
            <Image src={directoryCategory.image} alt={directoryCategory.label} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-7">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">GjejDirekt</span>
              <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{directoryCategory.label}</h2>
              <p className="mt-0.5 text-xs text-white/80 sm:text-sm">Gjej bizneset dhe shërbimet më të mira pranë teje</p>
            </div>
          </div>
          <div className="gd-rail px-4 py-3 sm:px-5">
            <button type="button" onClick={() => setParam("subcategory", "")} className="gd-quick-pill" style={!activeSubcategory ? { background: "var(--brand-accent)", color: "#fff", borderColor: "var(--brand-accent)" } : undefined}>Të gjitha</button>
            {directorySubcategories.map((item) => (
              <button key={item.value} type="button" onClick={() => setParam("subcategory", activeSubcategory === item.value ? "" : item.value)} className="gd-quick-pill" style={activeSubcategory === item.value ? { background: "var(--brand-accent)", color: "#fff", borderColor: "var(--brand-accent)" } : undefined}>{item.label}</button>
            ))}
          </div>
        </section>
      )}

      {/* Category strip — always visible on tablet up, behind the filter button on phones */}
      <div className={activeCategory ? "hidden" : showFilters ? "space-y-3" : "hidden space-y-3 sm:block"}>
        <div className="gd-rail -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <button
            type="button"
            onClick={() => setParam("category", "")}
            className="gd-quick-pill"
            style={
              !activeCategory
                ? { background: "var(--brand-accent)", color: "#fff", borderColor: "var(--brand-accent)" }
                : undefined
            }
          >
            <LayoutGrid className="h-4 w-4" />
            {language === "en" ? "All" : "Të gjitha"}
          </button>
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.value);
            const active = activeCategory === category.value;
            return (
              <button
                key={category.value}
                type="button"
                onClick={() => setParam("category", active ? "" : category.value)}
                className="gd-quick-pill"
                style={active ? { background: "var(--brand-accent)", color: "#fff", borderColor: "var(--brand-accent)" } : undefined}
              >
                <Icon className="h-4 w-4" style={{ color: active ? "#fff" : category.color }} />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {cities.length > 0 && (
        <div className="gd-rail -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <button
            type="button"
            onClick={() => setParam("city", "")}
            className="gd-quick-pill"
            style={
              !activeCity
                ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" }
                : undefined
            }
          >
            {language === "en" ? "All cities" : "Të gjitha qytetet"}
          </button>
          {cities.map((city) => {
            const active = activeCity.toLowerCase() === city.value.toLowerCase();
            return (
              <button
                key={city.value}
                type="button"
                onClick={() => setParam("city", active ? "" : city.value)}
                className="gd-quick-pill"
                style={active ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" } : undefined}
              >
                {city.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Result count + sort */}
      <div className="flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 sm:px-4" style={{ borderColor: "var(--border-soft)", background: "var(--surface-white)" }}>
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>{results.length}</strong>{" "}
          {language === "en" ? (results.length === 1 ? "business" : "businesses") : results.length === 1 ? "biznes" : "biznese"}
        </p>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                router.push("/listings", { scroll: false });
              }}
              className="text-xs font-semibold"
              style={{ color: "var(--brand-accent)" }}
            >
              {language === "en" ? "Reset" : "Pastro"}
            </button>
          )}
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-lg border bg-transparent px-2 py-1.5 text-xs font-semibold outline-none"
            style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)" }}
            aria-label={language === "en" ? "Sort results" : "Rendit rezultatet"}
          >
            <option value="recommended">{language === "en" ? "Recommended" : "Rekomanduar"}</option>
            <option value="rating">{language === "en" ? "Top rated" : "Vlerësimi më i lartë"}</option>
            <option value="name">{language === "en" ? "Name A–Z" : "Emri A–Z"}</option>
          </select>
        </div>
      </div>

      {results.length ? (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((listing: any) => (
            <BusinessCard key={listing._id || listing.slug} listing={listing} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed p-10 text-center"
          style={{ borderColor: "var(--border-medium)", background: "var(--surface-white)" }}
        >
          <p className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
            {language === "en" ? "Nothing matched" : "Nuk u gjet asnjë biznes"}
          </p>
          <p className="mt-1.5 text-[13px]" style={{ color: "var(--text-secondary)" }}>
            {language === "en" ? "Try another word or category." : "Provo një fjalë ose kategori tjetër."}
          </p>
          <Link href="/create-listing" className="btn-primary mt-4">
            {language === "en" ? "List your business" : "Regjistro biznesin tënd"}
          </Link>
        </div>
      )}
    </div>
  );
}
