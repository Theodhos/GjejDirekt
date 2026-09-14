"use client";

import SafeImage from "@/components/ui/SafeImage";
import { useRouter } from "next/navigation";
import { Bed, Compass, LoaderCircle, MapPin, Search, Sparkles, Tag, UtensilsCrossed, X } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/lib/constants";
import { albaniaCities } from "@/lib/albania-cities";
import { nearestCity } from "@/lib/city-coordinates";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomeSearchHero() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listingSuggestions, setListingSuggestions] = useState<any[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [locating, setLocating] = useState(false);
  const debouncedSearch = useDebounce(city, 300);
  const { language } = useLanguage();
  const searchRef = useRef<HTMLDivElement>(null);
  const [availableCities, setAvailableCities] = useState<any[]>(albaniaCities);
  const popularCities = ["Tirane", "Durres", "Vlore", "Sarande", "Shkoder", "Berat"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      if (!debouncedSearch.trim()) {
        setListingSuggestions([]);
        return;
      }
      setIsLoadingListings(true);
      try {
        const response = await fetch(`/api/listings?q=${encodeURIComponent(debouncedSearch)}`);
        const data = await response.json();
        if (data.listings) setListingSuggestions(data.listings.slice(0, 12));
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoadingListings(false);
      }
    };
    fetchListings();
  }, [debouncedSearch]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch("/api/cities");
        const data = await res.json();
        if (Array.isArray(data.cities) && data.cities.length) setAvailableCities(data.cities);
      } catch {}
    };
    loadCities();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateMobileState = () => setIsMobileScreen(window.innerWidth < 640);
    updateMobileState();
    window.addEventListener("resize", updateMobileState);
    return () => window.removeEventListener("resize", updateMobileState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("mobile-search-overlay", { detail: { open: showSuggestions && isMobileScreen } })
    );
    if (showSuggestions && isMobileScreen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.dispatchEvent(new CustomEvent("mobile-search-overlay", { detail: { open: false } }));
      };
    }
    return () => {
      window.dispatchEvent(new CustomEvent("mobile-search-overlay", { detail: { open: false } }));
    };
  }, [showSuggestions, isMobileScreen]);

  const suggestions = useMemo(() => {
    const query = city.toLowerCase().trim();
    const scoreMatch = (text: string) => {
      const value = text.toLowerCase();
      if (!query) return 0;
      if (value.startsWith(query)) return 0;
      const index = value.indexOf(query);
      if (index >= 0) return 1 + index;
      return 9999;
    };

    if (!query) {
      return categories.map((cat) => ({
        type: "category",
        label: cat.label,
        value: cat.value,
        icon: Tag
      }));
    }

    const results: any[] = [];

    categories.forEach((cat) => {
      if (cat.label.toLowerCase().includes(query) || cat.aliases.some((a) => a.includes(query))) {
        results.push({ type: "category", label: cat.label, value: cat.value, icon: Tag, score: scoreMatch(cat.label) });
      }
      cat.subcategories.forEach((sub) => {
        if (sub.label.toLowerCase().includes(query) || sub.aliases?.some((a) => a.includes(query))) {
          results.push({
            type: "subcategory",
            label: `${sub.label} (${cat.label})`,
            value: sub.value,
            categoryValue: cat.value,
            icon: Compass,
            score: scoreMatch(sub.label)
          });
        }
      });
    });

    availableCities.forEach((c) => {
      if (c.label.toLowerCase().includes(query)) {
        results.push({ type: "city", label: c.label, value: c.value, icon: MapPin, score: scoreMatch(c.label) });
      }
    });

    const merged = [...results.sort((a, b) => a.score - b.score).slice(0, 8)];

    listingSuggestions.forEach((listing) => {
      const listingLabel = listing.title || "";
      const listingLocation = listing.location || "";
      const listingCategory = listing.category || "";
      merged.push({
        type: "listing",
        label: listingLabel,
        value: listing.slug,
        category: listingCategory,
        image: listing.coverImage || listing.image || listing.images?.[0] || listing.gallery?.[0] || null,
        icon: Sparkles,
        score: Math.min(scoreMatch(listingLabel), scoreMatch(listingLocation), scoreMatch(listingCategory))
      });
    });

    return merged.sort((a, b) => a.score - b.score).slice(0, 12);
  }, [city, listingSuggestions, availableCities]);

  function handleSuggestionClick(suggestion: any) {
    setShowSuggestions(false);
    if (suggestion.type === "listing") return router.push(`/listings/${suggestion.value}`);
    if (suggestion.type === "category") return router.push(`/categories/${suggestion.value}`);
    if (suggestion.type === "subcategory") {
      return router.push(`/categories/${suggestion.categoryValue}?subcategory=${suggestion.value}`);
    }
    if (suggestion.type === "city") return router.push(`/city/${suggestion.value}`);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = city.toLowerCase().trim();
    const matchedCity = availableCities.find(
      (c) => String(c.label).toLowerCase() === query || String(c.value).toLowerCase() === query
    );
    setShowSuggestions(false);
    if (matchedCity) return router.push(`/city/${matchedCity.value}`);
    router.push(query ? `/listings?q=${encodeURIComponent(query)}` : "/listings");
  }

  /** "Pranë meje" — one geolocation fix, resolved to the closest city we cover. */
  function findNearMe() {
    if (!navigator.geolocation) {
      toast.error(language === "en" ? "Location is not available" : "Vendndodhja nuk mbështetet");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const slug = nearestCity(
          { lat: position.coords.latitude, lng: position.coords.longitude },
          availableCities.map((c) => String(c.value))
        );
        if (slug) {
          router.push(`/city/${slug}`);
        } else {
          toast(language === "en" ? "No city nearby — showing all" : "S'ka qytet afër — po shfaqim të gjitha");
          router.push("/listings");
        }
      },
      () => {
        setLocating(false);
        toast.error(language === "en" ? "Could not get your location" : "Nuk morëm dot vendndodhjen");
      },
      { timeout: 8000 }
    );
  }

  const quickFilters = [
    { icon: MapPin, label: language === "en" ? "Near me" : "Pranë meje", onClick: findNearMe, loading: locating },
    { icon: UtensilsCrossed, label: language === "en" ? "Restaurants" : "Restorante", href: "/categories/restorante" },
    { icon: Bed, label: language === "en" ? "Hotels" : "Hotele", href: "/categories/hotele" }
  ];

  return (
    <section className="relative overflow-visible" style={{ background: "#171A1F" }}>
      {/* Full-bleed background photo — clipped so the desktop dropdown isn't cut off */}
      <div className="absolute inset-0 overflow-hidden">
        <SafeImage
          src="/uploads/1000068416.jpg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ willChange: "auto" }}
        />
        {/* Two-stop gradient: darker top for the header overlay, darker bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,12,16,0.75) 0%, rgba(10,12,16,0.45) 40%, rgba(10,12,16,0.85) 100%)"
          }}
        />
      </div>

      <div className="page-shell relative z-10 pb-6 pt-7 sm:pb-8 sm:pt-12">
        {/* Main headline — two lines exactly like the mockup */}
        <h1
          className="max-w-xs text-[1.85rem] font-bold text-white sm:max-w-2xl sm:text-[2.6rem]"
          style={{ lineHeight: 1.12, letterSpacing: "-0.025em" }}
        >
          {language === "en" ? (
            <>
              Find it easily.
              <br />
              <span style={{ color: "var(--brand-accent)" }}>Order</span> directly.
            </>
          ) : (
            <>
              Gjej lehtë.
              <br />
              <span style={{ color: "var(--brand-accent)" }}>Porosit</span> direkt.
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p
          className="mt-2 max-w-xs text-[12.5px] leading-relaxed sm:max-w-lg sm:text-[14px]"
          style={{ color: "rgba(255,255,255,0.78)" }}
        >
          {language === "en"
            ? "Find the best businesses near you and order or book directly on WhatsApp."
            : "Gjej bizneset më të mira pranë teje dhe porosit ose rezervo direkt në WhatsApp."}
        </p>

        {/* Search bar */}
        <div className="relative z-[100] mt-4 max-w-2xl" ref={searchRef}>
          <form onSubmit={submit}>
            <div
              className="flex items-center gap-2 rounded-2xl p-1.5 pl-4"
              style={{
                background: "rgba(255,255,255,0.97)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)"
              }}
            >
              <Search className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-tertiary)" }} />
              <input
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={
                  language === "en" ? "Search business, product, service..." : "Kërko biznes, produkt, shërbim..."
                }
                className="min-w-0 flex-1 bg-transparent py-2 text-[14px] font-medium outline-none sm:text-[15px]"
                style={{ color: "var(--text-primary)" }}
                aria-label={language === "en" ? "Search" : "Kërko"}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all"
                style={{
                  background: "var(--brand-accent)",
                  boxShadow: "0 2px 8px rgba(225,29,46,0.35)"
                }}
              >
                {language === "en" ? "Search" : "Kërko"}
              </button>
            </div>
          </form>

          {/* Desktop suggestions dropdown */}
          {!isMobileScreen && showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute inset-x-0 top-full z-[9999] mt-2 overflow-hidden rounded-2xl border bg-white"
              style={{
                borderColor: "var(--border-soft)",
                boxShadow: "0 20px 60px rgba(15,23,42,0.18), 0 4px 16px rgba(15,23,42,0.08)"
              }}
            >
              <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {!city.trim() && (
                  <div className="flex flex-wrap gap-2 border-b p-3" style={{ borderColor: "var(--border-soft)" }}>
                    {popularCities.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          setShowSuggestions(false);
                          router.push(`/city/${name.toLowerCase()}`);
                        }}
                        className="rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors hover:bg-[var(--surface-subtle)]"
                        style={{ background: "var(--surface-cream)", color: "var(--text-secondary)" }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
                {isLoadingListings && (
                  <p className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>
                    {language === "en" ? "Searching..." : "Duke kërkuar..."}
                  </p>
                )}
                <SuggestionList suggestions={suggestions} onPick={handleSuggestionClick} />
              </div>
            </div>
          )}
        </div>

        {/* Quick filter pills — Pranë meje · Restorante · Hotele */}
        <div className="mt-3 flex flex-wrap gap-2">
          {quickFilters.map((filter) => {
            const Icon = filter.icon;
            const content = (
              <>
                {filter.loading ? (
                  <LoaderCircle className="h-[15px] w-[15px] animate-spin" style={{ color: "var(--brand-accent)" }} />
                ) : (
                  <Icon className="h-[15px] w-[15px]" style={{ color: "var(--brand-accent)" }} />
                )}
                <span className="text-[12.5px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  {filter.label}
                </span>
              </>
            );
            const pillStyle = {
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
            };
            return filter.href ? (
              <a
                key={filter.label}
                href={filter.href}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 transition-all active:scale-95 hover:bg-white"
                style={pillStyle}
              >
                {content}
              </a>
            ) : (
              <button
                key={filter.label}
                type="button"
                onClick={filter.onClick}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 transition-all active:scale-95 hover:bg-white"
                style={pillStyle}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile full-screen search overlay */}
      {isMobileScreen && showSuggestions && (
        <div className="fixed inset-0 z-[9999] overflow-y-auto bg-white">
          <div className="border-b px-4 pb-3 pt-4" style={{ borderColor: "var(--border-soft)" }}>
            <form onSubmit={submit} className="flex items-center gap-2.5">
              <div
                className="flex flex-1 items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5"
                style={{ borderColor: "var(--border-medium)" }}
              >
                <Search className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-tertiary)" }} />
                <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder={
                    language === "en" ? "Search business, product, service..." : "Kërko biznes, produkt, shërbim..."
                  }
                  className="w-full bg-transparent text-base font-medium outline-none"
                  style={{ color: "var(--text-primary)" }}
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                style={{ borderColor: "var(--border-soft)", color: "var(--text-secondary)" }}
                aria-label={language === "en" ? "Close" : "Mbyll"}
              >
                <X className="h-5 w-5" />
              </button>
            </form>
          </div>

          {!city.trim() && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {popularCities.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    router.push(`/city/${name.toLowerCase()}`);
                  }}
                  className="rounded-lg border px-3 py-2 text-sm font-medium"
                  style={{ borderColor: "var(--border-soft)", background: "var(--surface-cream)", color: "var(--text-secondary)" }}
                >
                  {name}
                </button>
              ))}
            </div>
          )}

          <SuggestionList suggestions={suggestions} onPick={handleSuggestionClick} />
        </div>
      )}
    </section>
  );
}

/** Shared result rows — the mobile overlay and the desktop dropdown render the same list. */
function SuggestionList({ suggestions, onPick }: { suggestions: any[]; onPick: (suggestion: any) => void }) {
  return (
    <ul>
      {suggestions.map((suggestion, index) => (
        <li key={`${suggestion.type}-${suggestion.value}-${index}`}>
          <button
            type="button"
            onClick={() => onPick(suggestion)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-cream)]"
            style={{ borderTop: index ? "1px solid var(--border-soft)" : "none" }}
          >
            {suggestion.type === "listing" && suggestion.image ? (
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                <SafeImage src={suggestion.image} alt={suggestion.label} fill className="object-cover" sizes="40px" />
              </span>
            ) : (
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
              >
                <suggestion.icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {suggestion.label}
              </span>
              <span className="block truncate text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                {suggestion.type === "listing" ? suggestion.category : suggestion.type}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
