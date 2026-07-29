"use client";

import { useLanguage } from "@/context/LanguageContext";

const copy = {
  al: {
    title: "Eksploro shërbimet turistike në Shqipëri",
    description:
      "Gjeni hotele, restorante, atraksione, aktivitete dhe më shumë. Kontakt direkt, pa komision."
  },
  en: {
    title: "Explore tourism services in Albania",
    description:
      "Find hotels, restaurants, attractions, activities and more. Direct contact, no commission."
  }
};

export default function ServicesPageHeader() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--surface-cream)",
        borderBottom: "1px solid var(--border-soft)"
      }}
    >
      <div className="page-shell relative z-10 py-10 sm:py-14">
        <h1
          className="mb-3 font-bold tracking-tight"
          style={{
            fontSize: "clamp(1.75rem, 5vw, 3rem)",
            color: "var(--text-primary)",
            lineHeight: 1.1
          }}
        >
          {text.title}
        </h1>
        <p className="max-w-xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
          {text.description}
        </p>
      </div>
    </section>
  );
}
