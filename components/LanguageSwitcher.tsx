"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
          language === "en" ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("al")}
        className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
          language === "al" ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        AL
      </button>
    </div>
  );
}
