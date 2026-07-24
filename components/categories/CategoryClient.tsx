"use client";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import React from "react";
import { CategoryDefinition } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import ListingCard from "@/components/ListingCard";
import { Sparkles } from "lucide-react";

export default function CategoryClient({ 
  category, 
  categories,
  initialListings = []
}: { 
  category: CategoryDefinition; 
  categories: CategoryDefinition[];
  initialListings?: any[];
}) {
  const { t } = useLanguage();

  const categoryLabel = t.categories.names[category.value as keyof typeof t.categories.names] || category.label;

  return (
    <main className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <section className="relative flex min-h-[calc(62vh-var(--header-height))] items-center overflow-hidden bg-slate-950 py-16 sm:min-h-[calc(72vh-var(--header-height))] sm:py-20">
        <div className="absolute inset-0">
          <SafeImage src={category.image} alt={categoryLabel} fill className="object-cover opacity-90" priority />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.48) 46%, rgba(0,0,0,0.18) 100%)"
            }}
          />
        </div>

        <div className="page-shell relative z-10">
          <div
            className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase"
            style={{
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "0.18em",
              textShadow: "0 2px 8px rgba(0,0,0,0.45)"
            }}
          >
            <Sparkles className="w-4 h-4" />
            {t.categories.header}
          </div>
          <h1
            className="mb-5 max-w-3xl font-bold capitalize text-white"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              textShadow: "0 3px 24px rgba(0,0,0,0.72)"
            }}
          >
            {categoryLabel}
          </h1>
          <p
            className="max-w-xl text-base font-semibold leading-relaxed sm:text-lg"
            style={{ color: "rgba(255,255,255,0.96)", textShadow: "0 2px 12px rgba(0,0,0,0.86)" }}
          >
            {t.categories.description.replace("{category}", categoryLabel)}
          </p>
        </div>
      </section>

      <div className="page-shell py-6 sm:py-10">
        {initialListings.length === 0 ? (
          <div className="text-center py-10">
            <div
              className="mb-6 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
            >
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="section-heading mb-3">Asnje sherbim nuk u gjet</h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-500">
              Nuk u gjet asnje sherbim per &quot;{categoryLabel}&quot; per momentin. Provoni te kerkoni diçka tjeter.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {initialListings.map((listing: any) => (
              <ListingCard key={listing._id.toString()} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
