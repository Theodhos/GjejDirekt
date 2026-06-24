"use client";

import { CheckCircle, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const copy = {
  al: {
    eyebrow: "Listime te verifikuara",
    title: "Gjeni pervojen tuaj te radhes",
    description:
      "Zbuloni hotele, restorante, atraksione dhe sherbime direkt nga hoste lokale te verifikuara ne Shqiperi.",
    badges: ["Ne te gjithe Shqiperine", "Hoste te verifikuara", "Pa komision"]
  },
  en: {
    eyebrow: "Verified listings",
    title: "Find your next experience",
    description:
      "Discover hotels, restaurants, attractions and services directly from verified local hosts in Albania.",
    badges: ["Albania wide", "Verified hosts", "No commission"]
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
      <div className="page-shell relative z-10 pb-14 pt-14">
        <p className="eyebrow mb-4">{text.eyebrow}</p>
        <h1
          className="mb-4 font-bold tracking-tight"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--text-primary)",
            lineHeight: 1.1
          }}
        >
          {text.title}
        </h1>
        <p className="max-w-md text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {text.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-5">
          {text.badges.map((label, index) => {
            const Icon = index === 0 ? MapPin : CheckCircle;
            return (
              <span
                key={label}
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                <Icon className="h-4 w-4" style={{ color: "var(--brand-accent)" }} />
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
