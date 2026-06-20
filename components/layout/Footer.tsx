"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function Footer() {
  const { language, t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-slate-200 bg-[radial-gradient(circle_at_top_right,#dbeafe_0%,#f8fafc_32%,#ffffff_65%)]">
      <div className="page-shell py-14 sm:py-16">
        <div className="rounded-[2rem] bg-slate-950 border border-slate-800 px-6 py-10 sm:p-12">
          <div className="grid gap-8 lg:gri d-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/80">{t.footer.platformName}</p>
              <h2 className="display-font mt-3 text-4xl font-black leading-tight text-white">
                {t.footer.tagline}
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium text-white/90">
                {t.footer.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/services" className="rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 hover:scale-105 active:scale-95">
                {t.footer.exploreServices}
              </Link>
              <Link href="/create-listing" className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 hover:scale-105 active:scale-95">
                {t.footer.addListing}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-transparent p-0 sm:p-0">
          <div className="grid gap-10 md:grid-cols-5">
            <div className="md:pr-4">
              <p className="text-2xl font-black tracking-tight text-slate-950">Gjej Direkt</p>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-700">
                {t.footer.description}
              </p>
            </div>

            <div className="space-y-2.5 text-sm font-medium text-slate-700">
              <p className="text-base font-black uppercase tracking-[0.14em] text-slate-950">{t.nav.explore || (language === 'en' ? 'Explore' : 'Eksploro')}</p>
              <Link href="/" className="block hover:text-brand-700 transition-colors">{t.nav.home}</Link>
              <Link href="/services" className="block hover:text-brand-700 transition-colors">{t.nav.services}</Link>
              <Link href="/cities" className="block hover:text-brand-700 transition-colors">{t.nav.cities || (language === 'en' ? 'Cities' : 'Qytetet')}</Link>
              <Link href="/blog" className="block hover:text-brand-700 transition-colors">{t.nav.blog}</Link>
              <Link href="/about-us" className="block hover:text-brand-700 transition-colors">{t.nav.aboutUs || (language === 'en' ? 'About Us' : 'Rreth Nesh')}</Link>
              <Link href="/faq" className="block hover:text-brand-700 transition-colors">{t.nav.faq || (language === 'en' ? 'FAQ' : 'Pyetje të Shpeshta')}</Link>
            </div>

            <div className="space-y-2.5 text-sm font-medium text-slate-700">
              <p className="text-base font-black uppercase tracking-[0.14em] text-slate-950">{t.footer.getStarted}</p>
              <Link href="/create-listing" className="block hover:text-brand-700 transition-colors">{t.nav.addListing}</Link>
              <Link href="/register" className="block hover:text-brand-700 transition-colors">{t.nav.register}</Link>
              <Link href="/login" className="block hover:text-brand-700 transition-colors">{t.nav.login}</Link>
              <Link href="/dashboard" className="block hover:text-brand-700 transition-colors">{t.nav.dashboard}</Link>
            </div>

            <div className="space-y-2.5 text-sm font-medium text-slate-700">
              <p className="text-base font-black uppercase tracking-[0.14em] text-slate-950">{t.footer.contactTitle}</p>
              <a 
                href="mailto:infoturizemalbania@gmail.com" 
                className="block hover:text-brand-700 transition-colors font-bold text-brand-600 break-all"
              >
                infoturizemalbania@gmail.com
              </a>
              <p className="text-xs text-slate-500 mt-1">
                {language === "en" ? "We respond within 24 hours" : "Përgjigjemi brenda 24 orëve"}
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <p className="text-base font-black uppercase tracking-[0.14em] text-slate-950">{t.footer.follow}</p>
              <div className="flex gap-3">
                <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all"><Facebook className="h-4 w-4" /></Link>
                <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all"><Instagram className="h-4 w-4" /></Link>
                <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all"><Linkedin className="h-4 w-4" /></Link>
                <Link href="/" className="rounded-full border border-slate-200 bg-slate-50 p-2.5 text-slate-600 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition-all"><Youtube className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-5 text-xs font-medium text-slate-500 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} Gjej Direkt. {t.footer.rightsReserved}</p>
            <div className="flex items-center gap-4">
              <Link href="/terms-and-conditions" className="hover:text-brand-700 transition-colors">{t.nav.terms || (language === 'en' ? 'Terms and Conditions' : 'Kushtet')}</Link>
              <Link href="/privacy-policy" className="hover:text-brand-700 transition-colors">{t.nav.privacy || (language === 'en' ? 'Privacy Policy' : 'Privatesia')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

