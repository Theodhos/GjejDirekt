"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Tag, SlidersHorizontal, RotateCcw, Loader2, Euro, X, Check } from "lucide-react";
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
  const [priceError, setPriceError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const subcategories = useMemo(() => {
    return categories.find((item) => item.value === selectedCategory)?.subcategories || [];
  }, [selectedCategory]);

  const getCategoryLabel = useCallback((value: string, fallback: string) => {
    return t.categories.names[value as keyof typeof t.categories.names] || fallback;
  }, [t]);

  const getSubcategoryLabel = useCallback((categoryValue: string, value: string, fallback: string) => {
    const categoryNames = t.categories.subnames[categoryValue as keyof typeof t.categories.subnames];
    return categoryNames?.[value as keyof typeof categoryNames] || fallback;
  }, [t]);

  const pricePresets = useMemo(
    () => [
      { label: language === "en" ? "Under €50" : "Nën €50", min: "", max: "50" },
      { label: "€50 – €100", min: "50", max: "100" },
      { label: "€100 – €200", min: "100", max: "200" },
      { label: language === "en" ? "€200+" : "€200+", min: "200", max: "" }
    ],
    [language]
  );

  const formatPriceChip = useCallback((min?: string | null, max?: string | null) => {
    if (min && max) return `€${min} – €${max}`;
    if (min) return `≥ €${min}`;
    if (max) return `≤ €${max}`;
    return "";
  }, []);

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
    setPriceError("");
    router.push('/services');
  };

  const handleSearch = useCallback(() => {
    const min = minPrice.trim();
    const max = maxPrice.trim();

    if ((min && Number(min) < 0) || (max && Number(max) < 0)) {
      setPriceError(language === "en" ? "Price cannot be negative." : "Çmimi nuk mund të jetë negativ.");
      return false;
    }
    if (min && max && Number(min) > Number(max)) {
      setPriceError(language === "en" ? "Min price cannot exceed max price." : "Çmimi minimal nuk mund të jetë më i madh se maksimali.");
      return false;
    }

    setPriceError("");
    applyFilters({
      q: keyword.trim(),
      location: location.trim(),
      minPrice: min,
      maxPrice: max
    });
    return true;
  }, [keyword, location, minPrice, maxPrice, language, applyFilters]);

  const applyPreset = useCallback((min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPriceError("");
    applyFilters({ minPrice: min, maxPrice: max });
  }, [applyFilters]);

  // Chips reflect what is actually applied to the results (read from the URL).
  const activeFilters = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    const q = params?.get("q");
    const loc = params?.get("location");
    const cat = params?.get("category");
    const sub = params?.get("subcategory");
    const minP = params?.get("minPrice");
    const maxP = params?.get("maxPrice");

    if (q) chips.push({ key: "q", label: `"${q}"` });
    if (loc) chips.push({ key: "location", label: loc });
    if (cat) chips.push({ key: "category", label: getCategoryLabel(cat, cat) });
    if (sub) chips.push({ key: "subcategory", label: getSubcategoryLabel(cat || "", sub, sub) });
    if (minP || maxP) chips.push({ key: "price", label: formatPriceChip(minP, maxP) });
    return chips;
  }, [params, getCategoryLabel, getSubcategoryLabel, formatPriceChip]);

  const removeFilter = useCallback((key: string) => {
    switch (key) {
      case "q":
        setKeyword("");
        applyFilters({ q: "" });
        break;
      case "location":
        setLocation("");
        applyFilters({ location: "" });
        break;
      case "category":
        setSelectedCategory("");
        setSelectedSubcategory("");
        applyFilters({ category: "", subcategory: "" });
        break;
      case "subcategory":
        setSelectedSubcategory("");
        applyFilters({ subcategory: "" });
        break;
      case "price":
        setMinPrice("");
        setMaxPrice("");
        setPriceError("");
        applyFilters({ minPrice: "", maxPrice: "" });
        break;
    }
  }, [applyFilters]);

  const isPresetActive = (min: string, max: string) => minPrice === min && maxPrice === max && (min !== "" || max !== "");

  const activeCount = activeFilters.length;

  const inputBase =
    "w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner outline-none";

  return (
    <>
    {/* Mobile trigger bar */}
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
          className="relative h-11 px-4 rounded-2xl bg-slate-950 text-white text-xs font-black uppercase tracking-widest inline-flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t.services.filters}
          {activeCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-brand-500 text-white text-[10px] font-black inline-flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </div>
    </div>

    {/* Desktop panel */}
    <div className="hidden lg:flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-soft sticky top-24 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-7 pb-5">
        <h3 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-600" />
          {t.services.filters}
          {activeCount > 0 && (
            <span className="min-w-6 h-6 px-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-black inline-flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-brand-600 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            {t.services.reset}
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {activeCount > 0 && (
        <div className="px-8 pb-5 flex flex-wrap gap-2 border-b border-slate-100">
          {activeFilters.map((chip) => (
            <button
              key={chip.key}
              onClick={() => removeFilter(chip.key)}
              className="group inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition"
            >
              <span className="max-w-[150px] truncate">{chip.label}</span>
              <X className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}

      <div className="px-8 py-7 space-y-7">
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
            className={inputBase}
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
            className={inputBase}
          />
        </div>

        {/* Category */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2 pt-6">
            <Tag className="w-3 h-3" />
            {t.common.category}
          </label>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedCategory(val);
                setSelectedSubcategory("");
                applyFilters({ category: val, subcategory: "" });
              }}
              className={`${inputBase} appearance-none cursor-pointer pr-12`}
            >
              <option value="">{t.services.allCategories}</option>
              {categories.map((item) => (
                <option key={item.value} value={item.value}>{getCategoryLabel(item.value, item.label)}</option>
              ))}
            </select>
            <svg className="w-4 h-4 text-slate-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 20 20" fill="none">
              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Subcategory */}
        {selectedCategory && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2">
              {t.common.subcategory}
            </label>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedSubcategory("");
                  applyFilters({ subcategory: "" });
                }}
                className={`flex items-center justify-between text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${!selectedSubcategory ? 'bg-slate-950 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
              >
                <span>
                  {language === "en" ? "All" : "Te gjitha"}{" "}
                  {getCategoryLabel(
                    selectedCategory,
                    categories.find((item) => item.value === selectedCategory)?.label || selectedCategory
                  )}
                </span>
                {!selectedSubcategory && <Check className="w-3.5 h-3.5" />}
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.value}
                  onClick={() => {
                    setSelectedSubcategory(sub.value);
                    applyFilters({ subcategory: sub.value });
                  }}
                  className={`flex items-center justify-between text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedSubcategory === sub.value ? 'bg-slate-950 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  <span>{getSubcategoryLabel(selectedCategory, sub.value, sub.label)}</span>
                  {selectedSubcategory === sub.value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-2 flex items-center gap-2 pt-6">
            <Euro className="w-3 h-3" />
            {t.common.priceRange}
          </label>

          {/* Quick presets */}
          <div className="grid grid-cols-2 gap-2">
            {pricePresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.min, preset.max)}
                className={`h-10 rounded-xl text-xs font-bold transition-all ${isPresetActive(preset.min, preset.max) ? 'bg-brand-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom range */}
          <div className="flex items-center gap-3 pt-1">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">€</span>
              <input
                type="number"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                placeholder={language === "en" ? "Min" : "Min."}
                className="w-full h-12 pl-7 pr-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner outline-none"
              />
            </div>
            <span className="text-slate-300">—</span>
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">€</span>
              <input
                type="number"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                placeholder={language === "en" ? "Max" : "Maks."}
                className="w-full h-12 pl-7 pr-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white transition-all font-bold text-slate-950 text-sm shadow-inner outline-none"
              />
            </div>
          </div>
          {priceError && (
            <p className="text-xs font-semibold text-rose-600 ml-2">{priceError}</p>
          )}
        </div>
      </div>

      {/* Sticky footer search */}
      <div className="px-8 pb-7 pt-1">
        <button
          onClick={handleSearch}
          disabled={isPending}
          className="w-full h-14 rounded-2xl bg-brand-600 text-white text-xs font-black uppercase tracking-widest inline-flex items-center justify-center gap-2 transition-all hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {language === "en" ? "Search" : "Kërko"}
        </button>
      </div>
    </div>

    {/* Mobile sheet */}
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
              {activeCount > 0 && (
                <span className="min-w-6 h-6 px-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-black inline-flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </h3>
            <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeCount > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeFilters.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => removeFilter(chip.key)}
                  className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold"
                >
                  <span className="max-w-[150px] truncate">{chip.label}</span>
                  <X className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>
          )}

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
            {selectedCategory && subcategories.length > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">{t.common.subcategory}</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedSubcategory(""); applyFilters({ subcategory: "" }); }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition ${!selectedSubcategory ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-500'}`}
                  >
                    {language === "en" ? "All" : "Te gjitha"}
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub.value}
                      onClick={() => { setSelectedSubcategory(sub.value); applyFilters({ subcategory: sub.value }); }}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition ${selectedSubcategory === sub.value ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-500'}`}
                    >
                      {getSubcategoryLabel(selectedCategory, sub.value, sub.label)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 ml-1">{t.common.priceRange}</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {pricePresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(preset.min, preset.max)}
                    className={`h-10 rounded-xl text-xs font-bold transition ${isPresetActive(preset.min, preset.max) ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-600'}`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={0} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder={language === "en" ? "Min" : "Min."} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none text-sm font-semibold" />
                <input type="number" min={0} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder={language === "en" ? "Max" : "Maks."} className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none text-sm font-semibold" />
              </div>
              {priceError && (
                <p className="text-xs font-semibold text-rose-600 ml-1">{priceError}</p>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button onClick={handleReset} className="h-11 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest">{t.services.reset}</button>
            <button onClick={() => { if (handleSearch()) setMobileFiltersOpen(false); }} className="h-11 rounded-xl bg-slate-950 text-white text-xs font-black uppercase tracking-widest">{t.common.showResults}</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
