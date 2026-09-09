"use client";

import { useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Tag, SlidersHorizontal, RotateCcw, Loader2, Euro, X, Check, BadgeCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { categories } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useDebounce } from "@/hooks/useDebounce";

/** One field style for every input, select and number box in the panel. */
const FIELD_CLASS =
  "w-full h-11 px-3.5 rounded-xl text-[14px] font-medium outline-none transition-colors border";
const FIELD_STYLE = {
  background: "var(--surface-white)",
  borderColor: "var(--border-medium)",
  color: "var(--text-primary)"
} as const;

/** Section label — same weight and colour as the rest of the product. */
function Label({ icon: Icon, children }: { icon?: LucideIcon; children: ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </label>
  );
}

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
  const [verifiedOnly, setVerifiedOnly] = useState(params?.get("verified") === "true");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const cityLabel = language === "en" ? "City" : "Qyteti";
  const verifiedLabel = language === "en" ? "Verified only" : "Vetëm Verified";
  const verifiedHint =
    language === "en" ? "Show only admin-verified businesses." : "Shfaq vetëm bizneset e verifikuara.";

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

  const toggleVerified = useCallback(() => {
    const next = !verifiedOnly;
    setVerifiedOnly(next);
    applyFilters({ verified: next ? "true" : "" });
  }, [verifiedOnly, applyFilters]);

  const handleReset = () => {
    setKeyword("");
    setLocation("");
    setSelectedCategory("");
    setSelectedSubcategory("");
    setMinPrice("");
    setMaxPrice("");
    setPriceError("");
    setVerifiedOnly(false);
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
    const onlyVerified = params?.get("verified") === "true";

    if (q) chips.push({ key: "q", label: `"${q}"` });
    if (loc) chips.push({ key: "location", label: loc });
    if (cat) chips.push({ key: "category", label: getCategoryLabel(cat, cat) });
    if (sub) chips.push({ key: "subcategory", label: getSubcategoryLabel(cat || "", sub, sub) });
    if (minP || maxP) chips.push({ key: "price", label: formatPriceChip(minP, maxP) });
    if (onlyVerified) chips.push({ key: "verified", label: "Verified" });
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
      case "verified":
        setVerifiedOnly(false);
        applyFilters({ verified: "" });
        break;
    }
  }, [applyFilters]);

  const isPresetActive = (min: string, max: string) => minPrice === min && maxPrice === max && (min !== "" || max !== "");

  const activeCount = activeFilters.length;

  /** Removable chip for a filter that is currently applied. */
  const chips = (
    <>
      {activeFilters.map((chip) => (
        <button
          key={chip.key}
          onClick={() => removeFilter(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-full py-1.5 pl-3 pr-2 text-[12px] font-semibold transition-colors"
          style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
        >
          <span className="max-w-[150px] truncate">{chip.label}</span>
          <X className="h-3.5 w-3.5 opacity-70" />
        </button>
      ))}
    </>
  );

  /** The full set of controls — rendered in the desktop panel and the mobile sheet. */
  const controls = (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label icon={Search}>{t.common.keyword}</Label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t.hero.searchPlaceholder}
          className={FIELD_CLASS}
          style={FIELD_STYLE}
        />
      </div>

      <div className="space-y-2">
        <Label icon={MapPin}>{cityLabel}</Label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t.common.anyCity}
          className={FIELD_CLASS}
          style={FIELD_STYLE}
        />
      </div>

      <div className="space-y-2">
        <Label icon={Tag}>{t.common.category}</Label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            const val = e.target.value;
            setSelectedCategory(val);
            setSelectedSubcategory("");
            applyFilters({ category: val, subcategory: "" });
          }}
          className={`${FIELD_CLASS} cursor-pointer`}
          style={FIELD_STYLE}
        >
          <option value="">{t.services.allCategories}</option>
          {categories.map((item) => (
            <option key={item.value} value={item.value}>{getCategoryLabel(item.value, item.label)}</option>
          ))}
        </select>
      </div>

      {selectedCategory && subcategories.length > 0 && (
        <div className="space-y-2">
          <Label>{t.common.subcategory}</Label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedSubcategory("");
                applyFilters({ subcategory: "" });
              }}
              className="gd-quick-pill !px-3 !py-1.5 !text-[12px]"
              style={
                !selectedSubcategory
                  ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" }
                  : undefined
              }
            >
              {language === "en" ? "All" : "Të gjitha"}
            </button>
            {subcategories.map((sub) => {
              const active = selectedSubcategory === sub.value;
              return (
                <button
                  key={sub.value}
                  onClick={() => {
                    setSelectedSubcategory(sub.value);
                    applyFilters({ subcategory: sub.value });
                  }}
                  className="gd-quick-pill !px-3 !py-1.5 !text-[12px]"
                  style={
                    active
                      ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" }
                      : undefined
                  }
                >
                  {getSubcategoryLabel(selectedCategory, sub.value, sub.label)}
                  {active && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label icon={Euro}>{t.common.priceRange}</Label>
        <div className="grid grid-cols-2 gap-2">
          {pricePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset.min, preset.max)}
              className="h-10 rounded-xl border text-[12px] font-semibold transition-colors"
              style={
                isPresetActive(preset.min, preset.max)
                  ? { background: "var(--brand-accent)", color: "#fff", borderColor: "var(--brand-accent)" }
                  : { background: "var(--surface-white)", color: "var(--text-secondary)", borderColor: "var(--border-medium)" }
              }
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder={language === "en" ? "Min" : "Min."}
            className={FIELD_CLASS}
            style={FIELD_STYLE}
          />
          <span style={{ color: "var(--text-tertiary)" }}>—</span>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            placeholder={language === "en" ? "Max" : "Maks."}
            className={FIELD_CLASS}
            style={FIELD_STYLE}
          />
        </div>
        {priceError && (
          <p className="text-[12px] font-semibold" style={{ color: "var(--brand-accent)" }}>{priceError}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label icon={BadgeCheck}>Verified</Label>
        <button
          type="button"
          onClick={toggleVerified}
          aria-pressed={verifiedOnly}
          className="inline-flex h-11 w-full items-center justify-between rounded-xl border px-3.5 text-[13px] font-semibold transition-colors"
          style={
            verifiedOnly
              ? { background: "var(--verified-blue)", color: "#fff", borderColor: "var(--verified-blue)" }
              : { background: "var(--surface-white)", color: "var(--text-secondary)", borderColor: "var(--border-medium)" }
          }
        >
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            {verifiedLabel}
          </span>
          <span
            className="flex h-5 w-5 items-center justify-center rounded-md border"
            style={
              verifiedOnly
                ? { borderColor: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.2)" }
                : { borderColor: "var(--border-medium)", background: "var(--surface-white)" }
            }
          >
            {verifiedOnly && <Check className="h-3 w-3" />}
          </span>
        </button>
        <p className="text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>{verifiedHint}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger bar — mirrors the search row on /listings */}
      <div className="sticky top-[var(--header-height)] z-30 mb-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div
            className="flex flex-1 items-center gap-2.5 rounded-xl border px-3.5 py-2"
            style={{ borderColor: "var(--border-medium)", background: "var(--surface-white)" }}
          >
            <Search className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-tertiary)" }} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={t.hero.searchPlaceholder}
              className="w-full bg-transparent py-1.5 text-[15px] font-medium outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="relative inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border"
            style={{
              borderColor: activeCount ? "var(--brand-accent)" : "var(--border-medium)",
              color: activeCount ? "var(--brand-accent)" : "var(--text-secondary)",
              background: "var(--surface-white)"
            }}
            aria-label={t.services.filters}
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" />
            {activeCount > 0 && (
              <span
                className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                style={{ background: "var(--brand-accent)" }}
              >
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop panel */}
      <div className="gd-panel sticky top-24 hidden flex-col overflow-hidden lg:flex">
        <div className="flex items-center justify-between px-5 pb-4 pt-5">
          <h3 className="gd-section-title flex items-center gap-2">
            <SlidersHorizontal className="h-[18px] w-[18px]" style={{ color: "var(--brand-accent)" }} />
            {t.services.filters}
            {activeCount > 0 && (
              <span
                className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold"
                style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
              >
                {activeCount}
              </span>
            )}
          </h3>
          {activeCount > 0 && (
            <button onClick={handleReset} className="gd-section-link flex items-center gap-1">
              <RotateCcw className="h-3 w-3" />
              {t.services.reset}
            </button>
          )}
        </div>

        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 border-b px-5 pb-4" style={{ borderColor: "var(--border-soft)" }}>
            {chips}
          </div>
        )}

        <div className="px-5 py-5">{controls}</div>

        <div className="px-5 pb-5">
          <button onClick={handleSearch} disabled={isPending} className="btn-primary w-full disabled:opacity-60">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {language === "en" ? "Search" : "Kërko"}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: "rgba(10,12,16,0.55)" }}
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-2xl p-4"
            style={{ background: "var(--surface-white)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="gd-section-title flex items-center gap-2">
                <SlidersHorizontal className="h-[18px] w-[18px]" style={{ color: "var(--brand-accent)" }} />
                {t.services.filters}
                {activeCount > 0 && (
                  <span
                    className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold"
                    style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
                  >
                    {activeCount}
                  </span>
                )}
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border"
                style={{ borderColor: "var(--border-soft)", color: "var(--text-secondary)" }}
                aria-label={language === "en" ? "Close" : "Mbyll"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {activeCount > 0 && <div className="mb-4 flex flex-wrap gap-2">{chips}</div>}

            {controls}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={handleReset} className="btn-secondary">{t.services.reset}</button>
              <button
                onClick={() => { if (handleSearch()) setMobileFiltersOpen(false); }}
                className="btn-primary"
              >
                {t.common.showResults}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
