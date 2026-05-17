"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-slate-200 bg-[radial-gradient(circle_at_top_right,#dbeafe_0%,#f8fafc_32%,#ffffff_65%)]">
      <div className="page-shell py-14 sm:py-16">
        <div className="rounded-[2rem] bg-slate-950 border border-slate-800 px-6 py-10 sm:p-12">
          <div className="grid gap-8 lg:gri d-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/80">{language === "en" ? "Tourism Platform" : "Platforma Turistike"}</p>
              <h2 className="display-font mt-3 text-4xl font-black leading-tight text-white">
                {language === "en" ? "Plan, review, and book the kind of trip people remember." : "Planifikoni, rishikoni dhe rezervoni llojin e udhetimit qe mbahet mend."}
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium text-white/90">
                {language === "en"
                  ? "Built for travelers, hosts, and editors. A single platform for discovery, trust, and high-quality tourism listings."
                  : "Ndertuar per udhetaret, hostet dhe editoret. Nje platforme e vetme per zbulim, besim dhe listime turistike cilesore."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/services" className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 hover:scale-105 active:scale-95">
                {language === "en" ? "Explore services" : "Eksploro sherbimet"}
              </Link>
              <Link href="/create-listing" className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 hover:scale-105 active:scale-95">
                {language === "en" ? "Add a listing" : "Shto nje listim"}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-transparent p-0 sm:p-0">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:pr-4">
              <p className="text-2xl font-black tracking-tight text-slate-950">Gjej Direkt</p>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-700">
                {language === "en" ? "A premium travel discovery and booking platform." : "Nje platforme premium per zbulimin dhe rezervimin e udhetimeve."}
              </p>
            </div>

            <div className="space-y-2.5 text-sm font-medium text-slate-700">
              <p className="text-base font-black uppercase tracking-[0.14em] text-slate-950">{language === "en" ? "Explore" : "Eksploro"}</p>
              <Link href="/" className="block hover:text-brand-700 transition-colors">{t.nav.home}</Link>
              <Link href="/services" className="block hover:text-brand-700 transition-colors">{t.nav.services}</Link>
              <Link href="/cities" className="block hover:text-brand-700 transition-colors">{language === "en" ? "Cities" : "Qytetet"}</Link>
              <Link href="/blog" className="block hover:text-brand-700 transition-colors">{t.nav.blog}</Link>
            </div>

            <div className="space-y-2.5 text-sm font-medium text-slate-700">
              <p className="text-base font-black uppercase tracking-[0.14em] text-slate-950">{language === "en" ? "Get started" : "Fillo tani"}</p>
              <Link href="/create-listing" className="block hover:text-brand-700 transition-colors">{t.nav.addListing}</Link>
              <Link href="/register" className="block hover:text-brand-700 transition-colors">{t.nav.register}</Link>
              <Link href="/login" className="block hover:text-brand-700 transition-colors">{t.nav.login}</Link>
              <Link href="/dashboard" className="block hover:text-brand-700 transition-colors">{t.nav.dashboard}</Link>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <p className="text-base font-black uppercase tracking-[0.14em] text-slate-950">{language === "en" ? "Follow" : "Na ndiqni"}</p>
              <div className="flex gap-3">
                <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all"><Facebook className="h-4 w-4" /></Link>
                <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all"><Instagram className="h-4 w-4" /></Link>
                <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all"><Linkedin className="h-4 w-4" /></Link>
                <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all"><Youtube className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-5 text-xs font-medium text-slate-500 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} Gjej Direkt. {language === "en" ? "All rights reserved." : "Te gjitha te drejtat e rezervuara."}</p>
            <div className="flex items-center gap-4">
              <Link href="/terms-and-conditions" className="hover:text-brand-700 transition-colors">{language === "en" ? "Terms and Conditions" : "Kushtet"}</Link>
              <Link href="/privacy-policy" className="hover:text-brand-700 transition-colors">{language === "en" ? "Privacy Policy" : "Privatesia"}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

