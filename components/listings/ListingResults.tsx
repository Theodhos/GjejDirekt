"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, MapPin, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import MobileAppBar from "@/components/layout/MobileAppBar";
import CategoryRails from "@/components/listings/CategoryRails";
import ListingRow from "@/components/listings/ListingRow";
import ListingsBanner, { type ListingsBannerData } from "@/components/listings/ListingsBanner";
import { useLanguage } from "@/context/LanguageContext";
import { categories, getCategoryByValue } from "@/lib/constants";
import { offersFoodServices } from "@/lib/food";
import { getOpenStatus, matchesQuery, normalizeText, parseHours } from "@/lib/listing-display";

type Tab = "all" | "businesses" | "products" | "services";
type Sort = "updated" | "rating" | "popular" | "name";

const PAGE_SIZE = 20;

/**
 * The results screen of every directory page — the search directory for any
 * category (or all of them), and the Ushqim & Pije category pages: an optional
 * category banner, the search field, an optional Të gjitha / Biznese / Produkte /
 * Shërbime tab row, a Filtra · city · sort row, the result count and a list of rows.
 *
 * `listings` is already scoped by the page (a subcategory page hands over only its
 * own businesses); everything typed or picked here filters that set on the device.
 */
export default function ListingResults({
  listings,
  title,
  category = "",
  banner,
  initialQuery = "",
  initialCity = "",
  activeSubcategory = "",
  subcategoryBasePath,
  onCategorySelect,
  onSubcategorySelect,
  onSubmitQuery,
  showTabs = false,
  categoryFilters = false
}: {
  listings: any[];
  /** Screen-reader heading — only used when there is no banner (the banner carries the h1). */
  title?: string;
  /** Canonical value of the category the list is scoped to; "" when it mixes categories. */
  category?: string;
  /** Photo banner above the search field. */
  banner?: ListingsBannerData;
  initialQuery?: string;
  initialCity?: string;
  /** Value of the subcategory the page is scoped to; "" for the whole category. */
  activeSubcategory?: string;
  /** Where the "Lloji" chips lead: `${basePath}/${subcategory}` (default: the category page). */
  subcategoryBasePath?: string;
  /** Client parents can take over the category chips (they appear in Filtra) ... */
  onCategorySelect?: (value: string) => void;
  /** ... and the subcategory chips (they become buttons) instead of linking. */
  onSubcategorySelect?: (value: string) => void;
  /** When set the parent owns the URL — it is told the query on submit. */
  onSubmitQuery?: (query: string) => void;
  /** The Të gjitha / Biznese / Produkte / Shërbime row under the search field (food only). */
  showTabs?: boolean;
  /**
   * Filter with rows of pills (every category, then the picked category's types)
   * instead of the Filtra sheet. The parent owns the URL, so pressing a pill
   * reports it through `onCategorySelect` / `onSubcategorySelect`. The directory page uses this.
   */
  categoryFilters?: boolean;
}) {
  const { language, t } = useLanguage();
  const en = language === "en";

  const categoryDefinition = getCategoryByValue(category);
  const categoryName = categoryDefinition
    ? (t.categories.names as Record<string, string>)[categoryDefinition.value] || categoryDefinition.label
    : "";

  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState<Tab>("all");
  const [city, setCity] = useState(initialCity);
  const [sort, setSort] = useState<Sort>("updated");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const cities = useMemo(() => {
    const seen = new Map<string, string>();
    for (const listing of listings) {
      const label = String(listing.location || "").trim();
      if (label && !seen.has(normalizeText(label))) seen.set(normalizeText(label), label);
    }
    return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
  }, [listings]);

  // Picking another category changes which cities exist; a city the new list lacks would
  // leave the results empty behind a select that no longer shows it.
  useEffect(() => {
    if (city && !cities.some((label) => normalizeText(label) === normalizeText(city))) setCity("");
  }, [cities, city]);

  // "Hapur tani" only means something when businesses in this list gave opening hours.
  const hasOpeningHours = useMemo(() => listings.some((listing) => parseHours(listing.businessHours)), [listings]);

  const results = useMemo(() => {
    const text = query.trim();
    const cityKey = normalizeText(city);

    const filtered = listings.filter((listing) => {
      if (cityKey && normalizeText(listing.location) !== cityKey) return false;
      if (onlyVerified && !listing.verified) return false;
      if (minRating && Number(listing.ratingAverage || 0) < minRating) return false;
      if (onlyOpen && getOpenStatus(listing.businessHours).kind !== "open") return false;

      const menu: string[] = listing.menuTerms || [];
      const business = [
        listing.title,
        listing.description,
        listing.location,
        listing.address,
        listing.category,
        listing.subcategory,
        ...(listing.cuisines || []),
        ...(listing.tags || [])
      ].join(" ");
      // Place words in the query ("tirane") must still match when only the dishes are searched.
      const dishes = [...menu, listing.location, listing.address].join(" ");

      switch (tab) {
        case "businesses":
          return matchesQuery(business, text);
        case "products":
          return menu.length > 0 && matchesQuery(dishes, text);
        case "services":
          return offersFoodServices(listing) && matchesQuery(`${business} ${menu.join(" ")}`, text);
        default:
          return matchesQuery(`${business} ${menu.join(" ")}`, text);
      }
    });

    // "Më të përditësuar" keeps the order the page came with (paid tiers first, then the
    // most contacted, then newest), so choosing another sort is the only thing that reorders.
    if (sort === "updated") return filtered;
    return [...filtered].sort((a, b) => {
      if (sort === "rating") {
        return Number(b.ratingAverage || 0) - Number(a.ratingAverage || 0) || Number(b.reviewCount || 0) - Number(a.reviewCount || 0);
      }
      if (sort === "popular") return Number(b.views || 0) - Number(a.views || 0);
      return String(a.title || "").localeCompare(String(b.title || ""));
    });
  }, [listings, query, tab, city, sort, onlyOpen, onlyVerified, minRating]);

  // A new filter starts the list from the top again instead of leaving it expanded.
  useEffect(() => setVisible(PAGE_SIZE), [query, tab, city, sort, onlyOpen, onlyVerified, minRating, listings]);

  useEffect(() => {
    if (!filtersOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filtersOpen]);

  const activeFilters = Number(onlyOpen) + Number(onlyVerified) + Number(minRating > 0) + Number(Boolean(activeSubcategory));
  const trimmedQuery = query.trim();

  const tabs: { value: Tab; label: string }[] = [
    { value: "all", label: en ? "All" : "Të gjitha" },
    { value: "businesses", label: en ? "Businesses" : "Biznese" },
    { value: "products", label: en ? "Products" : "Produkte" },
    { value: "services", label: en ? "Services" : "Shërbime" }
  ];

  const sortLabels: Record<Sort, string> = {
    updated: en ? "Most recent" : "Më të përditësuar",
    rating: en ? "Top rated" : "Vlerësimi më i lartë",
    popular: en ? "Most viewed" : "Më të shikuarat",
    name: en ? "Name A–Z" : "Emri A–Z"
  };

  function resetFilters() {
    setOnlyOpen(false);
    setOnlyVerified(false);
    setMinRating(0);
    setCity("");
    setTab("all");
    setQuery("");
    onSubmitQuery?.("");
  }

  const countLabel =
    en
      ? `Found ${results.length} ${results.length === 1 ? "result" : "results"}`
      : results.length === 1
      ? "U gjet 1 rezultat"
      : `U gjetën ${results.length} rezultate`;

  return (
    <div className="min-h-screen bg-white">
      <MobileAppBar variant="results" backHref={category ? `/categories/${category}` : "/"} />
      {!banner && title && <h1 className="sr-only">{title}</h1>}

      {/* The banner runs edge to edge under the header; everything below it lines up with the header's content. */}
      {banner && <ListingsBanner {...banner} />}

      <div className="mx-auto w-full lg:w-[calc(100%-4rem)] lg:max-w-[1136px] lg:pb-12 lg:pt-6">
        {/* Search */}
        <form
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitQuery?.(query.trim());
          }}
          className="px-4 pt-3 lg:px-0 lg:pt-0"
        >
          <div
            className="flex h-12 items-center gap-2.5 rounded-xl border px-3.5"
            style={{ borderColor: "var(--border-medium)", background: "var(--surface-white)" }}
          >
            <Search className="h-5 w-5 shrink-0" style={{ color: "var(--text-secondary)" }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              enterKeyHint="search"
              placeholder={
                categoryName
                  ? en
                    ? `Search in ${categoryName}...`
                    : `Kërko në ${categoryName}...`
                  : en
                  ? "Search business, product, service..."
                  : "Kërko biznes, produkt, shërbim..."
              }
              className="min-w-0 flex-1 bg-transparent text-[15px] font-medium outline-none placeholder:font-normal"
              style={{ color: "var(--text-primary)" }}
              aria-label={en ? "Search" : "Kërko"}
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  onSubmitQuery?.("");
                }}
                aria-label={en ? "Clear" : "Pastro"}
                className="flex h-5 min-h-0 w-5 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: "#9CA3AF" }}
              >
                <X className="h-3 w-3" strokeWidth={3} />
              </button>
            )}
          </div>
        </form>

        {categoryFilters && (
          <CategoryRails
            category={categoryDefinition?.value || ""}
            activeSubcategory={activeSubcategory}
            onCategorySelect={onCategorySelect}
            onSubcategorySelect={onSubcategorySelect}
          />
        )}

        {/* Tabs */}
        {showTabs && (
          <div className="mt-1 flex gap-7 overflow-x-auto border-b px-4 lg:px-0" style={{ borderColor: "var(--border-soft)", scrollbarWidth: "none" }} role="tablist">
            {tabs.map((item) => {
              const active = tab === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.value)}
                  className="relative shrink-0 py-3 text-[14px] font-semibold transition-colors"
                  style={{ color: active ? "var(--brand-accent)" : "var(--text-primary)" }}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-0 bottom-[-1px] h-[2.5px] rounded-full" style={{ background: "var(--brand-accent)" }} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Filter row */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 lg:px-0" style={{ scrollbarWidth: "none" }}>
          {!categoryFilters && (
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="relative inline-flex h-10 min-h-0 shrink-0 items-center gap-2 rounded-xl border px-3.5 text-[14px] font-medium"
              style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)", background: "var(--surface-white)" }}
            >
              <SlidersHorizontal className="h-[18px] w-[18px]" />
              {en ? "Filters" : "Filtra"}
              {activeFilters > 0 && (
                <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10.5px] font-bold text-white" style={{ background: "var(--brand-accent)" }}>
                  {activeFilters}
                </span>
              )}
            </button>
          )}

          <label
            className="relative inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border pl-3 pr-2.5 text-[14px] font-medium"
            style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)", background: "var(--surface-white)" }}
          >
            <MapPin className="h-[18px] w-[18px]" style={{ color: "var(--brand-accent)" }} />
            <span className="max-w-[120px] truncate">{city || (en ? "All cities" : "Të gjitha qytetet")}</span>
            <ChevronDown className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
            <select
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={en ? "City" : "Qyteti"}
            >
              <option value="">{en ? "All cities" : "Të gjitha qytetet"}</option>
              {cities.map((label) => (
                <option key={label} value={label}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label
            className="relative inline-flex h-10 min-w-0 flex-1 shrink-0 items-center justify-between gap-2 rounded-xl border pl-3 pr-2.5 text-[14px] font-medium"
            style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)", background: "var(--surface-white)", minWidth: 210 }}
          >
            <span className="truncate">
              {en ? "Sort" : "Rendit"}: {sortLabels[sort]}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "var(--text-secondary)" }} />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={en ? "Sort results" : "Rendit rezultatet"}
            >
              {(Object.keys(sortLabels) as Sort[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Count */}
        <p className="px-4 pb-2.5 text-[13.5px] lg:px-0" style={{ color: "var(--text-secondary)" }} aria-live="polite">
          {countLabel}
          {trimmedQuery && (
            <>
              {" "}
              {en ? "for" : "për"}{" "}
              <span className="font-semibold" style={{ color: "var(--brand-accent)" }}>
                &ldquo;{trimmedQuery}&rdquo;
              </span>
            </>
          )}
        </p>

        {/* Results */}
        {results.length ? (
          <>
            <div className="border-t lg:grid lg:grid-cols-2 lg:gap-3 lg:border-t-0 lg:px-0 lg:pb-4" style={{ borderColor: "var(--border-soft)" }}>
              {results.slice(0, visible).map((listing, index) => (
                <ListingRow key={listing._id?.toString?.() || listing.slug} listing={listing} priority={index < 3} showCategory={!category} />
              ))}
            </div>
            {results.length > visible && (
              <div className="px-4 pb-6 pt-4 lg:px-0">
                <button
                  type="button"
                  onClick={() => setVisible((count) => count + PAGE_SIZE)}
                  className="h-11 w-full rounded-xl border text-[14px] font-semibold transition-colors hover:bg-neutral-50"
                  style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)" }}
                >
                  {en ? "Show more" : "Shfaq më shumë"} ({results.length - visible})
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center px-6 pb-16 pt-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
              <SearchX className="h-6 w-6" />
            </span>
            <p className="mt-4 text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>
              {en ? "No results found" : "Nuk u gjet asnjë rezultat"}
            </p>
            <p className="mt-1 max-w-xs text-[13.5px]" style={{ color: "var(--text-secondary)" }}>
              {en ? "Try another word, city or filter." : "Provo një fjalë, qytet ose filtër tjetër."}
            </p>
            <button type="button" onClick={resetFilters} className="btn-primary mt-5">
              {en ? "Clear filters" : "Pastro filtrat"}
            </button>
            <Link href="/create-listing" className="mt-3 text-[13px] font-semibold" style={{ color: "var(--brand-accent)" }}>
              {en ? "List your business" : "Regjistro biznesin tënd"}
            </Link>
          </div>
        )}
      </div>

      {filtersOpen && (
        <FilterSheet
          onClose={() => setFiltersOpen(false)}
          count={results.length}
          category={categoryDefinition?.value || ""}
          activeSubcategory={activeSubcategory}
          subcategoryBasePath={subcategoryBasePath || `/categories/${categoryDefinition?.value || ""}`}
          onCategorySelect={onCategorySelect}
          onSubcategorySelect={onSubcategorySelect}
          showOpenNow={hasOpeningHours}
          onlyOpen={onlyOpen}
          setOnlyOpen={setOnlyOpen}
          onlyVerified={onlyVerified}
          setOnlyVerified={setOnlyVerified}
          minRating={minRating}
          setMinRating={setMinRating}
        />
      )}
    </div>
  );
}

function FilterSheet({
  onClose,
  count,
  category,
  activeSubcategory,
  subcategoryBasePath,
  onCategorySelect,
  onSubcategorySelect,
  showOpenNow,
  onlyOpen,
  setOnlyOpen,
  onlyVerified,
  setOnlyVerified,
  minRating,
  setMinRating
}: {
  onClose: () => void;
  count: number;
  category: string;
  activeSubcategory: string;
  subcategoryBasePath: string;
  onCategorySelect?: (value: string) => void;
  onSubcategorySelect?: (value: string) => void;
  showOpenNow: boolean;
  onlyOpen: boolean;
  setOnlyOpen: (value: boolean) => void;
  onlyVerified: boolean;
  setOnlyVerified: (value: boolean) => void;
  minRating: number;
  setMinRating: (value: number) => void;
}) {
  const { language, t } = useLanguage();
  const en = language === "en";

  const definition = getCategoryByValue(category);
  const subLabels = (t.categories.subnames as Record<string, Record<string, string>>)[category] || {};
  const subcategories = definition
    ? [{ value: "", label: en ? "All" : "Të gjitha" }].concat(
        definition.subcategories.map((sub) => ({ value: sub.value, label: subLabels[sub.value] || sub.label }))
      )
    : [];
  const categoryNames = t.categories.names as Record<string, string>;

  const chip = "inline-flex h-9 min-h-0 items-center rounded-full border px-3.5 text-[13.5px] font-semibold transition-colors";
  const chipStyle = (active: boolean) =>
    active
      ? { background: "var(--brand-accent)", borderColor: "var(--brand-accent)", color: "#fff" }
      : { background: "var(--surface-white)", borderColor: "var(--border-medium)", color: "var(--text-primary)" };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
      style={{ background: "rgba(15,23,42,0.55)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={en ? "Filters" : "Filtra"}
        className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border-soft)" }}>
          <h2 className="!text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
            {en ? "Filters" : "Filtra"}
          </h2>
          <button type="button" onClick={onClose} aria-label={en ? "Close" : "Mbyll"} className="rounded-full p-1.5 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          {onCategorySelect && (
            <section>
              <h3 className="mb-2.5 !text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-tertiary)" }}>
                {en ? "Category" : "Kategoria"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {[{ value: "", label: en ? "All" : "Të gjitha" }, ...categories.map((item) => ({ value: item.value, label: categoryNames[item.value] || item.label }))].map((item) => (
                  <button
                    key={item.value || "all"}
                    type="button"
                    onClick={() => {
                      onCategorySelect(item.value);
                      onClose();
                    }}
                    className={chip}
                    style={chipStyle(item.value === category)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {subcategories.length > 0 && (
            <section>
              <h3 className="mb-2.5 !text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-tertiary)" }}>
                {en ? "Type" : "Lloji"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((sub) => {
                  const active = sub.value === activeSubcategory;
                  return onSubcategorySelect ? (
                    <button
                      key={sub.value || "all"}
                      type="button"
                      onClick={() => {
                        onSubcategorySelect(sub.value);
                        onClose();
                      }}
                      className={chip}
                      style={chipStyle(active)}
                    >
                      {sub.label}
                    </button>
                  ) : (
                    <Link
                      key={sub.value || "all"}
                      href={sub.value ? `${subcategoryBasePath}/${sub.value}` : subcategoryBasePath}
                      className={chip}
                      style={chipStyle(active)}
                    >
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <h3 className="mb-2.5 !text-[12px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-tertiary)" }}>
              {en ? "Rating" : "Vlerësimi"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {[0, 4, 4.5].map((value) => (
                <button key={value} type="button" onClick={() => setMinRating(value)} className={chip} style={chipStyle(minRating === value)}>
                  {value === 0 ? (en ? "Any" : "Të gjitha") : `${value.toFixed(1)}+ ★`}
                </button>
              ))}
            </div>
          </section>

          <section className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
            {showOpenNow && <Toggle label={en ? "Open now" : "Hapur tani"} value={onlyOpen} onChange={setOnlyOpen} />}
            <Toggle label={en ? "Verified businesses only" : "Vetëm biznese të verifikuara"} value={onlyVerified} onChange={setOnlyVerified} />
          </section>
        </div>

        <div className="flex gap-3 border-t px-5 pb-5 pt-4" style={{ borderColor: "var(--border-soft)" }}>
          <button
            type="button"
            onClick={() => {
              setOnlyOpen(false);
              setOnlyVerified(false);
              setMinRating(0);
            }}
            className="h-12 rounded-xl border px-5 text-[14.5px] font-semibold"
            style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)" }}
          >
            {en ? "Reset" : "Pastro"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-[14.5px] font-bold text-white"
            style={{ background: "var(--brand-accent)" }}
          >
            <Check className="h-4 w-4" />
            {en ? `Show ${count} results` : `Shfaq ${count} rezultate`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between py-3 text-left"
    >
      <span className="text-[14.5px] font-semibold" style={{ color: "var(--text-primary)" }}>
        {label}
      </span>
      <span
        className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        style={{ background: value ? "var(--brand-accent)" : "#D1D5DB" }}
      >
        <span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" style={{ left: value ? 22 : 2 }} />
      </span>
    </button>
  );
}
