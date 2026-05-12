"use client";

import ListingForm from "@/components/forms/ListingForm";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { Sparkles, CheckCircle, Lightbulb, Camera } from "lucide-react";

export default function AddListingShell() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <section className="page-shell py-12 sm:py-20 bg-slate-50/50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="surface p-8 sm:p-16 shadow-2xl border-none overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="mb-10">
              <h2 className="display-font text-4xl font-black tracking-tight text-slate-950 sm:text-6xl mb-8 leading-[1.1]">
                {t.addListing.formTitle}
              </h2>
              <p className="text-slate-500 mt-2">{t.addListing.formDesc}</p>
            </div>
            <ListingForm />
          </div>
        </div>
      </div>
    </section>
  );
}
