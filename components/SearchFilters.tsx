"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Tag, SlidersHorizontal, RotateCcw, Loader2, Star, Euro, ArrowUpDown } from "lucide-react";
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
  const [sort, setSort] = useState(params?.get("sort") || "latest");

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
    setSort("latest");
    router.push('/services');
  };

  return (
    <div className="flex flex-col gap-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-8 sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-600" />
          {language === 'en' ? 'Filters' : 'Filtrat'}
        </h3>
        <button 
          onClick={handleReset}
          className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-brand-600 transition flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          {language === 'en' ? 'Reset' : 'Fshi'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Keyword */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <Search className="w-3 h-3" />
            {language === 'en' ? 'Keyword' : 'Fjala kyçe'}
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
            placeholder={language === 'en' ? 'Any city...' : 'Çdo qytet...'}
            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner"
          />
        </div>

        {/* Category */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            {language === 'en' ? 'Category' : 'Kategoria'}
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
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {selectedCategory && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2">
              {language === 'en' ? 'Subcategory' : 'Nënkategoria'}
            </label>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  setSelectedSubcategory("");
                  applyFilters({ subcategory: "" });
                }}
                className={`text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${!selectedSubcategory ? 'bg-slate-950 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                All {selectedCategory}
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
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <Euro className="w-3 h-3" />
            {language === 'en' ? 'Price Range' : 'Gama e Çmimit'}
          </label>
          <div className="flex items-center gap-3">
            <input 
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={() => applyFilters({ minPrice })}
              placeholder="Min"
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner"
            />
            <span className="text-slate-300">-</span>
            <input 
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={() => applyFilters({ maxPrice })}
              placeholder="Max"
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner"
            />
          </div>
        </div>

        {/* Rating */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <Star className="w-3 h-3" />
            {language === 'en' ? 'Minimum Rating' : 'Vlerësimi Minimal'}
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

        {/* Sort */}
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2">
            <ArrowUpDown className="w-3 h-3" />
            {language === 'en' ? 'Sort By' : 'Rendit sipas'}
          </label>
          <select 
            value={sort}
            onChange={(e) => {
              const val = e.target.value;
              setSort(val);
              applyFilters({ sort: val });
            }}
            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner appearance-none cursor-pointer"
          >
            <option value="latest">{language === 'en' ? 'Latest' : 'Më të fundit'}</option>
            <option value="popular">{language === 'en' ? 'Most Popular' : 'Më populloret'}</option>
          </select>
        </div>
      </div>

      {isPending && (
        <div className="flex items-center justify-center py-4 gap-2 text-brand-600 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest">Updating...</span>
        </div>
      )}
    </div>
  );
}
