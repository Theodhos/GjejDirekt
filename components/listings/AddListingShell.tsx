"use client";

import ListingForm from "@/components/forms/ListingForm";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { Sparkles, CheckCircle, Lightbulb, Camera } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/constants";
import Image from "next/image";

export default function AddListingShell() {
  const { language } = useLanguage();
  const t = translations[language];
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const subParam = searchParams.get("subcategory");
  const categoryDef = categories.find((c) => c.value === categoryParam);
  const categoryLabel = categoryParam ? (t.categories.names[categoryParam as keyof typeof t.categories.names] || categoryDef?.label) : null;
  const subLabel = subParam ? (t.categories.subnames?.[categoryParam as keyof typeof t.categories.subnames]?.[subParam] || subParam) : null;

  return (
    <section className="page-shell py-8 bg-transparent min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {categoryLabel ? (
            <div>
              <div id="listing-form" className="bg-white rounded-xl p-4 border border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 mb-2">{t.addListing.formTitle}</h3>
                <p className="text-sm text-slate-500 mb-4">{t.addListing.formDesc}</p>
                <ListingForm />
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 mb-3">{t.addListing.formTitle}</h2>
                <p className="text-sm text-slate-500">{t.addListing.formDesc}</p>
              </div>
              <ListingForm />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
