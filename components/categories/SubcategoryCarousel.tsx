"use client";

import Link from "next/link";
import { useMemo, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CategoryDefinition } from "@/lib/constants";

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function SubcategoryCarousel({ category }: { category: CategoryDefinition }) {
  const railRef = useRef<HTMLDivElement>(null);
  const shuffledSubcategories = useMemo(() => shuffle(category.subcategories), [category.subcategories]);
  const { t } = useLanguage();
  const categoryLabel = t.categories.names[category.value as keyof typeof t.categories.names] || category.label;
  const subcategoryLabels = t.categories.subnames?.[
    category.value as keyof typeof t.categories.subnames
  ] as Record<string, string> | undefined;

  const scroll = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">{category.label}</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t.common.explore} {categoryLabel}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{t.common.explore} {categoryLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
            aria-label="Previous subcategory"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950"
            aria-label="Next subcategory"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={railRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none" style={{ msOverflowStyle: "none" }}>
        {shuffledSubcategories.map((sub) => (
          <Link
            key={sub.value}
            href={`/categories/${category.value}/${sub.value}`}
            className="min-w-[280px] flex-shrink-0 overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative h-60 overflow-hidden bg-slate-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.05),_transparent_45%)]" />
              <div className="flex h-full w-full items-end justify-start p-5">
                <div className="rounded-3xl bg-slate-950/90 px-4 py-3 text-white backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-300">{categoryLabel}</p>
                  <h3 className="mt-2 text-2xl font-black">{subcategoryLabels?.[sub.value] || sub.label}</h3>
                </div>
              </div>
            </div>
            <div className="px-5 py-6">
              <p className="text-sm text-slate-500">{t.common.viewAll}</p>
              <div className="mt-4 flex items-center justify-between gap-4 text-sm font-semibold text-brand-600">
                <span>{t.common.viewAll}</span>
                <div className="flex items-center gap-3">
                  <Link href={`/listings/add?category=${category.value}&subcategory=${sub.value}`} className="text-xs font-black uppercase tracking-wider text-slate-500 hover:text-brand-600">{t.nav.addListing}</Link>
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
