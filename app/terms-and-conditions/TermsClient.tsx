"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function TermsClient() {
  const { language } = useLanguage();
  const t = translations[language];

  const termsSections = t.terms || [];

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="page-shell max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 sm:px-10 sm:py-14">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-300">{language === 'en' ? 'Legal' : 'Ligjor'}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">{t.nav.terms}</h1>
            <p className="mt-4 text-sm text-slate-200 sm:text-base">{t.legal.intro}</p>
            <p className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">{t.legal.lastUpdated}</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-5 h-fit lg:sticky lg:top-24">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">{language === 'en' ? 'Quick Summary' : 'Përmbledhje e Shpejtë'}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>{language === 'en' ? 'Use the platform lawfully and provide accurate data.' : 'Përdorni platformën në mënyrë të ligjshme dhe jepni të dhëna të sakta.'}</li>
              <li>{language === 'en' ? 'Listings and reviews can be moderated by admins.' : 'Listimet dhe vlerësimet mund të moderohen nga administratorët.'}</li>
              <li>{language === 'en' ? 'Users are responsible for their account security.' : 'Përdoruesit janë përgjegjës për sigurinë e llogarive të tyre.'}</li>
              <li>{language === 'en' ? 'Third-party services are not guaranteed by the platform.' : 'Shërbimet e palëve të treta nuk garantohen nga platforma.'}</li>
            </ul>
          </aside>

          <div className="space-y-4">
            {termsSections.map((section: any) => (
              <section key={section.title} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6">
                <h3 className="text-lg font-black text-slate-950">{section.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-700 sm:text-base">{section.body}</p>
              </section>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
