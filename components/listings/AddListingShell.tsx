"use client";

import ListingForm from "@/components/forms/ListingForm";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/constants";

export default function AddListingShell() {
  const { language } = useLanguage();
  const t = translations[language];
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryDef = categories.find((c) => c.value === categoryParam);
  const categoryLabel = categoryParam ? (t.categories.names[categoryParam as keyof typeof t.categories.names] || categoryDef?.label) : null;

  return (
    <section className="page-shell py-8 bg-transparent min-h-screen">
      <div className="relative">
        {categoryLabel ? (
          <div id="listing-form" className="bg-white rounded-xl p-4 sm:p-6 border border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 mb-2">{t.addListing.formTitle}</h3>
            <p className="text-sm text-slate-500 mb-4">{t.addListing.formDesc}</p>
            <ListingForm />
          </div>
        ) : (
          <div>
            <div className="mb-6 max-w-2xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 mb-3">{t.addListing.formTitle}</h2>
              <p className="text-sm text-slate-500">{t.addListing.formDesc}</p>
            </div>
            <ListingForm />
          </div>
        )}
      </div>
    </section>
  );
}
