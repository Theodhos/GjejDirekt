"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CategoryDefinition } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import SubcategoryCarousel from "@/components/categories/SubcategoryCarousel";

export default function CategoryClient({ category, categories }: { category: CategoryDefinition; categories: CategoryDefinition[] }) {
  const { t } = useLanguage();

  const categoryLabel = t.categories.names[category.value as keyof typeof t.categories.names] || category.label;
  return (
    <main className="min-h-screen bg-slate-50/50 pb-16">
      <section className="page-shell border-b border-slate-200 py-6 bg-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t.categories.header}</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{categoryLabel}</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">{t.categories.description.replace("{category}", categoryLabel)}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/listings/add?category=${category.value}`}
              className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-500"
            >
              {t.nav.addListing}
            </Link>
          </div>
        </div>
      </section>

      <div className="page-shell py-8">
        <SubcategoryCarousel category={category} />
      </div>
    </main>
  );
}
