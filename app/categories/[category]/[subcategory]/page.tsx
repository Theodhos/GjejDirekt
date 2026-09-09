"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, SearchX } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { getCategoryByValue, getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import { getCategoryIcon } from "@/lib/category-icons";
import BusinessCard from "@/components/home/BusinessCard";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

/**
 * One subcategory of one category. Same shell as the category page above it — the
 * only additions are the way back up and the sibling subcategory strip.
 */
export default function SubcategoryPage() {
  const { category, subcategory } = useParams() as { category: string; subcategory: string };
  const { language } = useLanguage();
  const t = translations[language];

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listings?category=${category}&subcategory=${subcategory}`);
        const data = await res.json();
        setListings(data.listings || []);
      } catch (error) {
        console.error("Error fetching subcategory listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [category, subcategory]);

  const definition = getCategoryByValue(category);
  const Icon = getCategoryIcon(category);

  const categoryLabel =
    t.categories.names[category as keyof typeof t.categories.names] || getCategoryLabel(category);
  const subLabels = (t.categories.subnames as Record<string, Record<string, string>>)[category] || {};
  const subcategoryLabel = subLabels[subcategory] || getSubcategoryLabel(category, subcategory);

  // Sibling subcategories, so a dead end is one tap away from a full one.
  const siblings = useMemo(() => definition?.subcategories ?? [], [definition]);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <PageHeader
        title={subcategoryLabel}
        description={
          language === "en"
            ? `${categoryLabel} · verified businesses near you.`
            : `${categoryLabel} · biznese të verifikuara pranë teje.`
        }
        action={
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full text-white sm:h-14 sm:w-14"
            style={{
              background: definition?.color || "var(--brand-accent)",
              boxShadow: "0 3px 12px rgba(15,20,25,0.16)"
            }}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
        }
      >
        <div className="gd-rail -mx-4 mt-3.5 px-4 sm:-mx-6 sm:px-6">
          <Link href={`/categories/${category}`} className="gd-quick-pill">
            <ChevronLeft className="h-4 w-4" />
            {categoryLabel}
          </Link>
          {siblings.map((sub) => {
            const active = sub.value === subcategory;
            return (
              <Link
                key={sub.value}
                href={`/categories/${category}/${sub.value}`}
                className="gd-quick-pill"
                style={
                  active
                    ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" }
                    : undefined
                }
              >
                {subLabels[sub.value] || sub.label}
              </Link>
            );
          })}
        </div>
      </PageHeader>

      <div className="page-shell space-y-4 py-4 sm:py-6">
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>{loading ? "…" : listings.length}</strong>{" "}
          {language === "en"
            ? listings.length === 1
              ? "business"
              : "businesses"
            : listings.length === 1
            ? "biznes"
            : "biznese"}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className="h-[190px] animate-pulse rounded-[14px]"
                style={{ background: "var(--surface-subtle)" }}
              />
            ))}
          </div>
        ) : listings.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {listings.map((listing: any) => (
              <BusinessCard key={listing._id?.toString() || listing.slug} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title={
              language === "en"
                ? `No businesses in ${subcategoryLabel} yet`
                : `Ende asnjë biznes te ${subcategoryLabel}`
            }
            description={
              language === "en"
                ? "Be the first one listed here, or browse the whole category."
                : "Bëhu i pari këtu, ose shfleto të gjithë kategorinë."
            }
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Link href="/create-listing" className="btn-primary">
                  {language === "en" ? "List your business" : "Regjistro biznesin tënd"}
                </Link>
                <Link href={`/categories/${category}`} className="btn-secondary">
                  {categoryLabel}
                </Link>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
