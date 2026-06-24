"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/dictionary";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("al");

  useEffect(() => {
    // Initialize language from sessionStorage if present
    try {
      if (typeof sessionStorage !== "undefined") {
        const saved = sessionStorage.getItem("language") as Language | null;
        if (saved === "en" || saved === "al") {
          setLanguageState(saved);
        } else {
          sessionStorage.setItem("language", "al");
        }
      }
    } catch (e) {
      // noop
    }
  }, []);

  // Keep the document <html> lang attribute in sync with the selected language
  useEffect(() => {
    try {
      if (typeof document !== "undefined") {
        document.documentElement.lang = language === "en" ? "en" : "sq";
      }
    } catch (e) {
      // noop for SSR
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("language", lang);
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
