"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Tag, SlidersHorizontal, RotateCcw, Loader2 } from "lucide-react";
import { categories } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchFilters() {
  const { language } = useLanguage();
  const t = translations[language];
  const router = useRouter();
  const params = useSearchParams();

  const [isPending, setIsPending] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(params?.get("category") || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(params?.get("subcategory") || "");
  const [location, setLocation] = useState(params?.get("location") || "");
  const [keyword, setKeyword] = useState(params?.get("q") || "");

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  const debouncedKeyword = useDebounce(keyword, 500);
  const debouncedLocation = useDebounce(location, 500);

  const applyFilters = useCallback((updates: Record<string, string>) => {
    setIsPending(true);
    const query = new URLSearchParams(params?.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
        if (value) query.set(key, value);
        else query.delete(key);
    });

    router.push(`/services?${query.toString()}`, { scroll: false });
    setTimeout(() => setIsPending(false), 800);
  }, [params, router]);

  // Proactive updates for selects
  useEffect(() => {
    if (selectedCategory !== (params?.get("category") || "")) {
        applyFilters({ category: selectedCategory, subcategory: "" });
    }
  }, [selectedCategory, applyFilters, params]);

  useEffect(() => {
    if (selectedSubcategory !== (params?.get("subcategory") || "")) {
        applyFilters({ subcategory: selectedSubcategory });
    }
  }, [selectedSubcategory, applyFilters, params]);

  // Proactive updates for text inputs (debounced)
  useEffect(() => {
    if (debouncedKeyword !== (params?.get("q") || "")) {
        applyFilters({ q: debouncedKeyword });
    }
  }, [debouncedKeyword, applyFilters, params]);

  useEffect(() => {
    if (debouncedLocation !== (params?.get("location") || "")) {
        applyFilters({ location: debouncedLocation });
    }
  }, [debouncedLocation, applyFilters, params]);

  const handleReset = () => {
    setKeyword("");
    setLocation("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    router.push('/services');
  };

  return (
    <div className="w-full relative group">
      {/* Loading Glow */}
      {isPending && (
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 to-blue-500/20 rounded-[3rem] blur-xl animate-pulse z-0" />
      )}
      
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] p-4 sm:p-6 lg:p-8 relative z-10 transition-all duration-500 hover:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.15)]">
        <div className="grid gap-6 lg:grid-cols-[1fr_240px_240px_auto] items-end">
            
            {/* 1. Keyword - PROACTIVE DEBOUNCED */}
            <div className="relative">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 ml-4">
                    <Search className="w-3 h-3" />
                    {language === 'en' ? 'What are you looking for?' : 'Çfarë po kërkoni?'}
                </label>
                <input 
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={t.hero.searchPlaceholder}
                    className="w-full h-16 pl-6 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 placeholder:text-slate-300 shadow-inner"
                />
            </div>

            {/* 2. Location - PROACTIVE DEBOUNCED */}
            <div className="relative">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 ml-4">
                    <MapPin className="w-3 h-3" />
                    {t.common.location}
                </label>
                <input 
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={language === 'en' ? 'Destination...' : 'Destinacioni...'}
                    className="w-full h-16 pl-6 pr-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 placeholder:text-slate-300 shadow-inner"
                />
            </div>

            {/* 3. Category - PROACTIVE INSTANT */}
            <div className="relative">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 ml-4">
                    <Tag className="w-3 h-3" />
                    {t.common.category}
                </label>
                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full h-16 pl-6 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 appearance-none shadow-inner cursor-pointer"
                >
                    <option value="">{t.services.allCategories}</option>
                    {categories.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                </select>
                <SlidersHorizontal className="absolute right-5 bottom-5.5 w-5 h-5 text-slate-300 pointer-events-none" />
            </div>

            {/* 4. Controls */}
            <div className="flex gap-3">
                <button 
                    onClick={handleReset}
                    className="h-16 w-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-100 hover:text-slate-950 transition-all shadow-inner group"
                >
                    <RotateCcw className={`w-6 h-6 transition-transform duration-500 ${isPending ? 'rotate-180' : 'group-hover:-rotate-90'}`} />
                </button>
                <div className="h-16 flex items-center justify-center px-8 bg-slate-950 text-white rounded-2xl font-black text-sm relative overflow-hidden group">
                    {isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
                    ) : (
                        <span className="flex items-center gap-2">
                            {language === 'en' ? 'Live Results' : 'Rezultate Live'}
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        </span>
                    )}
                </div>
            </div>

        </div>

        {/* Proactive Subcategories Rail */}
        {selectedCategory && (
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-500">
                <button 
                    onClick={() => setSelectedSubcategory("")}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!selectedSubcategory ? 'bg-brand-500 text-slate-950 shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                >
                    All {selectedCategory}
                </button>
                {subcategories.map((sub) => (
                    <button 
                        key={sub.value}
                        onClick={() => setSelectedSubcategory(sub.value)}
                        className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedSubcategory === sub.value ? 'bg-slate-950 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                        {sub.label}
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
