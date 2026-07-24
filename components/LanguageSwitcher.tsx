"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Language } from "@/lib/dictionary";

const OPTIONS: { code: Language; label: string; title: string }[] = [
  { code: "al", label: "AL", title: "Shqip" },
  { code: "en", label: "EN", title: "English" }
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label={language === "en" ? "Change language" : "Ndrysho gjuhën"}
      className="inline-flex items-center gap-0.5 rounded-full p-1"
      style={{ background: "var(--surface-subtle)", border: "1px solid var(--border-soft)" }}
    >
      {OPTIONS.map((option) => {
        const active = language === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            aria-pressed={active}
            title={option.title}
            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition-all duration-150 active:scale-95"
            style={{
              background: active ? "var(--surface-white)" : "transparent",
              color: active ? "var(--brand-accent)" : "var(--text-tertiary)",
              boxShadow: active ? "0 1px 2px rgba(15,20,25,0.08)" : "none"
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
