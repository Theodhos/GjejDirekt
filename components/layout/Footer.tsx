"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <footer className="mt-20 border-t border-slate-900/5 bg-white">
      <div className="page-shell py-12">
        <div className="surface-strong px-6 py-8 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-brand-200">{language === 'en' ? 'Tourism Platform' : 'Platforma Turistike'}</p>
              <h2 className="display-font mt-3 text-4xl font-black leading-tight">
                {language === 'en' ? 'Plan, review, and book the kind of trip people remember.' : 'Planifikoni, rishikoni dhe rezervoni llojin e udhëtimit që mbahet mend.'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium text-slate-100 opacity-90">
                {language === 'en' 
                    ? 'Built for travelers, hosts, and editors. A single platform for discovery, trust, and high-quality tourism listings.' 
                    : 'Ndërtuar për udhëtarët, hostët dhe editorët. Një platformë e vetme për zbulim, besim dhe listime turistike të cilësisë së lartë.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/services" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-105 active:scale-95">
                {language === 'en' ? 'Explore services' : 'Eksploro shërbimet'}
              </Link>
              <Link href="/listings/add" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:scale-105 active:scale-95">
                {language === 'en' ? 'Add a listing' : 'Shto një listim'}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-black text-slate-950">Gjej Direkt</p>
            <p className="mt-2 text-sm font-medium text-slate-800">
                {language === 'en' ? 'A premium travel discovery and booking platform.' : 'Një platformë premium për zbulimin dhe rezervimin e udhëtimeve.'}
            </p>
          </div>
          <div className="space-y-2 text-sm font-medium text-slate-800">
            <p className="font-semibold text-slate-900">{language === 'en' ? 'Explore' : 'Eksploro'}</p>
            <Link href="/services" className="block hover:text-brand-700 transition">
              {t.nav.services}
            </Link>
            <Link href="/blog" className="block hover:text-brand-700 transition">
              {t.nav.blog}
            </Link>
          </div>
          <div className="space-y-2 text-sm font-medium text-slate-800">
            <p className="font-semibold text-slate-900">{language === 'en' ? 'Get started' : 'Fillo tani'}</p>
            <Link href="/listings/add" className="block hover:text-brand-700 transition">
              {t.nav.addListing}
            </Link>
            <Link href="/register" className="block hover:text-brand-700 transition">
              {t.nav.register}
            </Link>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">{language === 'en' ? 'Follow' : 'Na ndiqni'}</p>
            <div className="flex gap-3">
              <Link href="/" className="rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="/" className="rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="/" className="rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="/" className="rounded-full bg-slate-100 p-2 hover:bg-slate-200 transition">
                <Youtube className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
