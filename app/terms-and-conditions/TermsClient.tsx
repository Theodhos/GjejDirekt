"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import Link from "next/link";
import { FileText, CheckCircle } from "lucide-react";

export default function TermsClient() {
  const { language } = useLanguage();
  const t = translations[language];
  const termsSections = t.terms || [];

  const quickSummary = language === "en"
    ? [
        "Use the platform lawfully and don't publish false content.",
        "Businesses are responsible for the accuracy of their listings.",
        "TripShqip enables direct contact but is not a party to reservations.",
        "TripShqip may moderate or remove inappropriate listings."
      ]
    : [
        "Përdorni platformën në mënyrë të ligjshme dhe pa përmbajtje të rreme.",
        "Bizneset janë përgjegjëse për saktësinë e listing-eve të tyre.",
        "TripShqip mundëson kontakt direkt, por nuk është palë në rezervime.",
        "TripShqip mund të moderojë ose heqë listing-e të papërshtatshme."
      ];

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }}>

      {/* ── HEADER ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--surface-cream)", borderBottom: "1px solid var(--border-soft)" }}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(31,138,112,0.06)", filter: "blur(100px)" }} />
        <div className="page-shell relative z-10 pt-14 pb-14 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/" className="hover:text-brand-600 transition-colors">{language === "en" ? "Home" : "Kreu"}</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>{t.nav.terms}</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-5" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
            <FileText className="w-6 h-6" />
          </div>
          <p className="eyebrow mb-3">{language === "en" ? "Legal" : "Ligjor"}</p>
          <h1 className="font-bold tracking-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.1 }}>
            {t.nav.terms}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t.legal.intro}</p>
          <span
            className="mt-4 inline-flex rounded-full px-4 py-1.5 text-xs font-medium"
            style={{ background: "var(--surface-white)", border: "1px solid var(--border-medium)", color: "var(--text-tertiary)" }}
          >
            {t.legal.lastUpdated}
          </span>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="page-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

          {/* Sidebar */}
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-2xl p-5" style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.15em] mb-4" style={{ color: "var(--text-secondary)" }}>
                {language === "en" ? "Quick Summary" : "Përmbledhje e Shpejtë"}
              </h2>
              <ul className="space-y-3">
                {quickSummary.map((text, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--brand-accent)" }} />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Sections */}
          <div className="space-y-3">
            {termsSections.map((section: any) => (
              <div
                key={section.title}
                className="rounded-2xl p-5 sm:p-6"
                style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: "var(--text-primary)" }}>{section.title}</h3>
                <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
