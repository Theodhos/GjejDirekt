"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LayoutGrid, SearchX } from "lucide-react";
import { CategoryDefinition } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryIcon } from "@/lib/category-icons";
import BusinessCard from "@/components/home/BusinessCard";
import ListingResults from "@/components/listings/ListingResults";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { FOOD_CATEGORY } from "@/lib/food";

export default function CategoryClient({
  category,
  categories,
  initialListings = []
}: {
  category: CategoryDefinition;
  categories: CategoryDefinition[];
  initialListings?: any[];
}) {
  const { t, language } = useLanguage();
  const [activeSub, setActiveSub] = useState("");

  const categoryLabel = t.categories.names[category.value as keyof typeof t.categories.names] || category.label;
  const subLabels = (t.categories.subnames as Record<string, Record<string, string>>)[category.value] || {};
  const Icon = getCategoryIcon(category.value);

  // Only offer subcategory chips that actually have businesses behind them.
  const availableSubs = useMemo(() => {
    const present = new Set(initialListings.map((listing: any) => String(listing.subcategory || "").toLowerCase()));
    return category.subcategories.filter(
      (sub) => present.has(sub.value) || sub.aliases?.some((alias) => present.has(alias))
    );
  }, [category.subcategories, initialListings]);

  const listings = useMemo(() => {
    if (!activeSub) return initialListings;
    const sub = category.subcategories.find((item) => item.value === activeSub);
    const values = new Set([activeSub, ...(sub?.aliases || [])]);
    return initialListings.filter((listing: any) => values.has(String(listing.subcategory || "").toLowerCase()));
  }, [activeSub, category.subcategories, initialListings]);

  // Every Ushqim & Pije page shares one results layout (search, tabs, filter row, rows).
  if (category.value === FOOD_CATEGORY) {
    return <ListingResults listings={initialListings} title={categoryLabel} category={FOOD_CATEGORY} showTabs />;
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <PageHeader
        title={categoryLabel}
        description={t.categories.description.replace("{category}", categoryLabel)}
        action={
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full text-white sm:h-14 sm:w-14"
            style={{ background: category.color, boxShadow: "0 3px 12px rgba(15,20,25,0.16)" }}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
        }
      >
        {/* Sibling categories keep the home grid reachable from any category page. */}
        <div className="gd-rail -mx-4 mt-3.5 px-4 sm:-mx-6 sm:px-6">
          <Link href="/listings" className="gd-quick-pill">
            <LayoutGrid className="h-4 w-4" />
            {language === "en" ? "All" : "Të gjitha"}
          </Link>
          {categories.map((item) => {
            const ItemIcon = getCategoryIcon(item.value);
            const active = item.value === category.value;
            return (
              <Link
                key={item.value}
                href={`/categories/${item.value}`}
                className="gd-quick-pill"
                style={active ? { background: item.color, color: "#fff", borderColor: item.color } : undefined}
              >
                <ItemIcon className="h-4 w-4" style={{ color: active ? "#fff" : item.color }} />
                {t.categories.names[item.value as keyof typeof t.categories.names] || item.label}
              </Link>
            );
          })}
        </div>
      </PageHeader>

      <div className="page-shell space-y-4 py-4 sm:py-6">
        {availableSubs.length > 0 && (
          <div className="gd-rail -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            <button
              type="button"
              onClick={() => setActiveSub("")}
              className="gd-quick-pill"
              style={
                !activeSub
                  ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" }
                  : undefined
              }
            >
              {language === "en" ? "All" : "Të gjitha"}
            </button>
            {availableSubs.map((sub) => {
              const active = activeSub === sub.value;
              return (
                <button
                  key={sub.value}
                  type="button"
                  onClick={() => setActiveSub(active ? "" : sub.value)}
                  className="gd-quick-pill"
                  style={
                    active
                      ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" }
                      : undefined
                  }
                >
                  {subLabels[sub.value] || sub.label}
                </button>
              );
            })}
          </div>
        )}

        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>{listings.length}</strong>{" "}
          {language === "en" ? (listings.length === 1 ? "business" : "businesses") : listings.length === 1 ? "biznes" : "biznese"}
        </p>

        {listings.length ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {listings.map((listing: any) => (
              <BusinessCard key={listing._id?.toString() || listing.slug} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title={
              language === "en"
                ? `No businesses in ${categoryLabel} yet`
                : `Ende asnjë biznes te ${categoryLabel}`
            }
            description={
              language === "en"
                ? "Be the first one listed in this category."
                : "Bëhu i pari që regjistrohet në këtë kategori."
            }
            action={
              <Link href="/create-listing" className="btn-primary">
                {language === "en" ? "List your business" : "Regjistro biznesin tënd"}
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
