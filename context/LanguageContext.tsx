"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Language, translations } from "@/lib/dictionary";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.en;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "language";
const DEFAULT_LANGUAGE: Language = "al";
/** Fired on every change so non-React listeners (and other components) can react. */
const LANGUAGE_EVENT = "language-changed";

function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "al";
}

/** localStorage first (survives reloads/new tabs), sessionStorage kept for older sessions. */
function readStoredLanguage(): Language | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(stored)) return stored;
    const legacy = window.sessionStorage.getItem(STORAGE_KEY);
    if (isLanguage(legacy)) return legacy;
  } catch {
    // storage can be blocked (private mode / cookie settings)
  }
  return null;
}

function persistLanguage(lang: Language) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
    window.sessionStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore
  }
  try {
    // Cookie so a full page load / server render can pick the same choice up.
    document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000; samesite=lax`;
  } catch {
    // ignore
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Must start at the server-rendered default, then sync from storage after mount.
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const stored = readStoredLanguage();
    if (stored && stored !== DEFAULT_LANGUAGE) setLanguageState(stored);
    if (!stored) persistLanguage(DEFAULT_LANGUAGE);
  }, []);

  // Keep the document <html> lang attribute in sync with the selected language
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "en" ? "en" : "sq";
    }
  }, [language]);

  // Stay in sync across tabs and across any other switcher on the page.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && isLanguage(event.newValue)) {
        setLanguageState(event.newValue);
      }
    };
    const onLanguageEvent = (event: Event) => {
      const detail = (event as CustomEvent<Language>).detail;
      if (isLanguage(detail)) setLanguageState(detail);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(LANGUAGE_EVENT, onLanguageEvent as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(LANGUAGE_EVENT, onLanguageEvent as EventListener);
    };
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    if (!isLanguage(lang)) return;
    setLanguageState(lang);
    persistLanguage(lang);
    try {
      window.dispatchEvent(new CustomEvent<Language>(LANGUAGE_EVENT, { detail: lang }));
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "al" : "en");
  }, [language, setLanguage]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
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
