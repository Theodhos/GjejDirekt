"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Tag, SlidersHorizontal, RotateCcw, Loader2, Star, Euro, X } from "lucide-react";
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
  const [keyword, setKeyword] = useState(params?.get("q") || "");
  const [location, setLocation] = useState(params?.get("location") || "");
  const [selectedCategory, setSelectedCategory] = useState(params?.get("category") || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(params?.get("subcategory") || "");
  const [minPrice, setMinPrice] = useState(params?.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(params?.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(params?.get("minRating") || "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  const getCategoryLabel = (value: string, fallback: string) => {
    return t.categories.names[value as keyof typeof t.categories.names] || fallback;
  };

  const getSubcategoryLabel = (categoryValue: string, value: string, fallback: string) => {
    const categoryNames = t.categories.subnames[categoryValue as keyof typeof t.categories.subnames];
    return categoryNames?.[value as keyof typeof categoryNames] || fallback;
  };

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
    setTimeout(() => setIsPending(false), 500);
  }, [params, router]);

  useEffect(() => {
    if (debouncedKeyword !== (params?.get("q") || "")) applyFilters({ q: debouncedKeyword });
  }, [debouncedKeyword, applyFilters, params]);

  useEffect(() => {
    if (debouncedLocation !== (params?.get("location") || "")) applyFilters({ location: debouncedLocation });
  }, [debouncedLocation, applyFilters, params]);

  const handleReset = () => {
    setKeyword("");
    setLocation("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    router.push('/services');
  };

  return (
    <>
    <div className="lg:hidden sticky top-20 z-30 mb-5 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t.hero.searchPlaceholder}
            className="w-full h-11 rounded-2xl border border-slate-200 pl-9 pr-3 text-sm font-semibold text-slate-900 outline-none focus:border-brand-500"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="h-11 px-4 rounded-2xl bg-slate-950 text-white text-xs font-black uppercase tracking-widest inline-flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t.services.filters}
        </button>
      </div>
    </div>

    <div className="hidden lg:flex flex-col gap-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-8 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-600" />
          {t.services.filters}
        </h3>
        <button 
          onClick={handleReset}
          className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-brand-600 transition flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          {t.services.reset}
        </button>
      </div>

      <div className="space-y-8">
        {/* Keyword */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <Search className="w-3 h-3" />
            {t.common.keyword}
          </label>
          <input 
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t.hero.searchPlaceholder}
            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner"
          />
        </div>

        {/* Location */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            {language === 'en' ? 'Location' : 'Vendndodhja'}
          </label>
          <input 
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t.common.anyCity}
            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner"
          />
        </div>

        {/* Category */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            {t.common.category}
          </label>
          <select 
            value={selectedCategory}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCategory(val);
              setSelectedSubcategory("");
              applyFilters({ category: val, subcategory: "" });
            }}
            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner appearance-none cursor-pointer"
          >
            <option value="">{t.services.allCategories}</option>
            {categories.map((item) => (
              <option key={item.value} value={item.value}>{getCategoryLabel(item.value, item.label)}</option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {selectedCategory && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2">
              {t.common.subcategory}
            </label>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setSelectedSubcategory("");
                  applyFilters({ subcategory: "" });
                }}
                className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${!selectedSubcategory ? 'bg-slate-950 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                {language === "en" ? "All" : "Te gjitha"}{" "}
                {getCategoryLabel(
                  selectedCategory,
                  categories.find((item) => item.value === selectedCategory)?.label || selectedCategory
                )}
              </button>
              {subcategories.map((sub) => (
                <button 
                  key={sub.value}
                  onClick={() => {
                    setSelectedSubcategory(sub.value);
                    applyFilters({ subcategory: sub.value });
                  }}
                  className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedSubcategory === sub.value ? 'bg-slate-950 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {getSubcategoryLabel(selectedCategory, sub.value, sub.label)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <Euro className="w-3 h-3" />
            {t.common.priceRange}
          </label>
          <div className="flex items-center gap-3">
            <input 
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={() => applyFilters({ minPrice })}
              placeholder={language === "en" ? "Min" : "Min."}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner"
            />
            <span className="text-slate-300">-</span>
            <input 
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={() => applyFilters({ maxPrice })}
              placeholder={language === "en" ? "Max" : "Maks."}
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <Star className="w-3 h-3" />
            {t.common.minRating}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  const val = String(star);
                  setMinRating(val);
                  applyFilters({ minRating: val });
                }}
                className={`flex-1 h-10 rounded-xl flex items-center justify-center transition-all ${
                  Number(minRating) === star 
                    ? 'bg-amber-500 text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                <span className="text-xs font-black">{star}</span>
                <Star className={`w-3 h-3 ml-1 ${Number(minRating) === star ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        </div>

      </div>

      {isPending && (
        <div className="flex items-center justify-center py-4 gap-2 text-brand-600 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t.common.loading}</span>
        </div>
      )}
    </div>

    {mobileFiltersOpen && (
      <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/55" onClick={() => setMobileFiltersOpen(false)}>
        <div
          className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-[2rem] bg-white p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-brand-600" />
              {t.services.filters}
            </h3>
            <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">{t.common.location}</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t.common.anyCity} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none text-sm font-semibold" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">{t.common.category}</label>
              <select value={selectedCategory} onChange={(e) => { const val = e.target.value; setSelectedCategory(val); setSelectedSubcategory(""); applyFilters({ category: val, subcategory: "" }); }} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none text-sm font-semibold">
                <option value="">{t.services.allCategories}</option>
                {categories.map((item) => <option key={item.value} value={item.value}>{getCategoryLabel(item.value, item.label)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">{t.common.priceRange}</label>
              <div className="flex items-center gap-2">
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} onBlur={() => applyFilters({ minPrice })} placeholder={language === "en" ? "Min" : "Min."} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none text-sm font-semibold" />
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} onBlur={() => applyFilters({ maxPrice })} placeholder={language === "en" ? "Max" : "Maks."} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none text-sm font-semibold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">{t.common.minRating}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => { const val = String(star); setMinRating(val); applyFilters({ minRating: val }); }} className={`flex-1 h-10 rounded-xl flex items-center justify-center transition-all ${Number(minRating) === star ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                    <span className="text-xs font-black">{star}</span>
                    <Star className={`w-3 h-3 ml-1 ${Number(minRating) === star ? 'fill-current' : ''}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={handleReset} className="h-11 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest">{t.services.reset}</button>
            <button onClick={() => setMobileFiltersOpen(false)} className="h-11 rounded-xl bg-slate-950 text-white text-xs font-black uppercase tracking-widest">{t.common.showResults}</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
