"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, Compass, Sparkles, MapPin, Tag, X } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/lib/constants";
import { albaniaCities } from "@/lib/albania-cities";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomeSearchHero() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [listingSuggestions, setListingSuggestions] = useState<any[]>([]);
  const [isLoadingListings, setIsLoadingListings] = useState(false);
  const debouncedSearch = useDebounce(city, 300);
  const { language } = useLanguage();
  const searchRef = useRef<HTMLDivElement>(null);
  const [availableCities, setAvailableCities] = useState<any[]>(albaniaCities);
  const popularCities = ["Tirane", "Durres", "Vlore", "Sarande", "Shkoder", "Berat", "Himare", "Ksamil", "Pogradec", "Korce"];

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
      if (!debouncedSearch.trim() || debouncedSearch.length < 1) {
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
    const isMobile = window.innerWidth < 640;
    window.dispatchEvent(
      new CustomEvent("mobile-search-overlay", { detail: { open: showSuggestions && isMobile } })
    );
    if (showSuggestions && isMobile) {
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
  }, [showSuggestions]);

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
    if (suggestion.type === "listing") {
      router.push(`/listings/${suggestion.value}`);
      setShowSuggestions(false);
      return;
    }
    if (suggestion.type === "category") {
      router.push(`/categories/${suggestion.value}`);
      setShowSuggestions(false);
      return;
    } else if (suggestion.type === "subcategory") {
      router.push(`/categories/${suggestion.categoryValue}?subcategory=${suggestion.value}`);
      setShowSuggestions(false);
      return;
    } else if (suggestion.type === "city") {
      router.push(`/city/${suggestion.value}`);
      setShowSuggestions(false);
      return;
    }
    const params = new URLSearchParams();
    router.push(`/?${params.toString()}`);
    setShowSuggestions(false);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = city.toLowerCase().trim();
    const matchedCity = availableCities.find(
      (c) => String(c.label).toLowerCase() === query || String(c.value).toLowerCase() === query
    );
    if (matchedCity) {
      router.push(`/city/${matchedCity.value}`);
      setShowSuggestions(false);
      return;
    }
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/${params.toString() ? `?${params.toString()}` : ""}`);
    setShowSuggestions(false);
  }

  return (
    <section className="relative flex min-h-[76svh] items-center justify-center overflow-visible py-10 sm:min-h-[calc(100vh-var(--header-height))] sm:py-0" style={{ background: "#0d1117" }}>
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=80"
          alt="Albania Landscapes"
          fill
          className="object-cover opacity-80 animate-slow-zoom"
          priority
        />
        {/* Darker overlay to make text highly readable */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)" }} />
      </div>

      {/* Content */}
      <div className="page-shell relative z-10 w-full flex flex-col items-center pt-2 sm:pt-0">
        {/* Heading */}
        <div className="text-center max-w-4xl mb-7 sm:mb-12">
          <p className="text-[11px] sm:text-sm font-bold uppercase tracking-[0.22em] sm:tracking-[0.25em] text-white/80 mb-4 sm:mb-5" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
            {language === "en" ? "Albania's Tourism Marketplace" : "Platforma e Turizmit Shqiptar"}
          </p>
          <h1
            className="font-bold text-white mb-4 px-1 sm:mb-6 sm:px-2"
            style={{
              fontSize: "clamp(2rem, 12vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              textShadow: "0 4px 32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.9)"
            }}
          >
            {language === "en" ? "Find easily. Contact directly. Enjoy holidays." : "Gjej lehtë. Kontakto direkt. Shijo pushimet."}
          </h1>
          <p
            className="text-sm sm:text-lg text-white/90 font-medium leading-relaxed max-w-2xl mx-auto px-2 sm:px-4"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.9)" }}
          >
            {language === "en"
              ? "Discover hotels, restaurants, attractions, experiences, and authentic Albanian businesses in a single platform."
              : "Zbulo hotele, restorante, atraksione, eksperienca dhe biznese autentike shqiptare në një platformë të vetme."}
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={`${
            showSuggestions
              ? "fixed inset-0 z-[11111111111] w-screen h-screen bg-white sm:relative sm:z-[100] sm:bg-transparent sm:w-full sm:h-auto sm:max-w-3xl flex flex-col"
              : "relative w-full max-w-3xl z-[100]"
          }`}
          ref={searchRef}
        >
          {/* Mobile overlay header */}
          {showSuggestions && (
            <div className="sm:hidden px-4 pt-3 pb-3 border-b" style={{ borderColor: "var(--border-soft)", background: "#fff" }}>
              <div className="flex items-center justify-between gap-3">
                <div
                  className="flex items-center gap-3 flex-1 rounded-xl border bg-white px-4 py-2.5"
                  style={{ borderColor: "var(--border-medium)" }}
                >
                  <Search className="w-4 h-4 shrink-0" style={{ color: "var(--brand-accent)" }} />
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder={language === "en" ? "Search hotels, restaurants, beaches, tours..." : "Kërko hotele, restorante, plazhe, ture..."}
                    className="w-full bg-transparent text-base outline-none font-medium"
                    style={{ color: "var(--text-primary)" }}
                    autoFocus
                  />
                </div>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="p-2 rounded-xl transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Search form */}
          <div
            className={`relative z-20 ${
              showSuggestions
                ? "hidden sm:block"
                : ""
            }`}
          >
            <div
              className="rounded-2xl p-1.5"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)"
              }}
            >
              <form onSubmit={submit}>
                <div
                  className="flex flex-col sm:flex-row items-center gap-2 p-2.5 pl-4 sm:pl-6 rounded-xl transition-all duration-300"
                  style={{
                    background: "var(--surface-white)",
                    border: "1px solid var(--border-soft)"
                  }}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Search className="h-5 w-5 shrink-0" style={{ color: "var(--brand-accent)" }} />
                    <input
                      value={city}
                      onChange={(event) => {
                        setCity(event.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => {
                        setShowSuggestions(true);
                        if (window.innerWidth >= 640) {
                          searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                      }}
                      placeholder={language === "en" ? "Search hotels, restaurants, beaches, tours..." : "Kërko hotele, restorante, plazhe, ture..."}
                      className="w-full bg-transparent py-3 sm:py-3.5 text-base outline-none font-medium"
                      style={{ color: "var(--text-primary)" }}
                    />
                  </div>
                  <div className="flex items-center w-full sm:w-auto shrink-0 pr-1">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm text-white transition-all active:scale-95 flex items-center justify-center gap-2.5"
                      style={{
                        background: "var(--brand-accent)",
                        boxShadow: "0 2px 12px rgba(34,153,120,0.28)"
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-hover)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-accent)")}
                    >
                      {language === "en" ? "Explore Albania" : "Eksploro Shqipërinë"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="sm:absolute sm:top-full sm:left-0 sm:right-0 sm:mt-3 flex-grow sm:flex-grow-0 bg-white sm:rounded-2xl sm:border overflow-hidden z-[9999]"
              style={{
                borderColor: "var(--border-soft)",
                boxShadow: "var(--shadow-float)"
              }}
            >
              <div className="p-2 h-full sm:max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                {/* Mobile: popular cities */}
                {!city.trim() && (
                  <div className="sm:hidden px-2 pb-3">
                    <h3 className="text-base font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
                      {language === "en" ? "Popular destinations" : "Destinacione popullore"}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {popularCities.map((name) => (
                        <button
                          key={name}
                          onClick={() => {
                            setCity(name);
                            router.push(`/city/${encodeURIComponent(name.toLowerCase())}`);
                            setShowSuggestions(false);
                          }}
                          className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                          style={{
                            background: "var(--surface-cream)",
                            color: "var(--text-secondary)",
                            border: "1px solid var(--border-soft)"
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isLoadingListings && (
                  <div className="flex items-center gap-2 px-4 py-2.5 mb-1 rounded-xl" style={{ background: "var(--surface-cream)" }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: "var(--brand-accent)" }} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-tertiary)" }}>
                      Searching...
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-0.5">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-4 px-4 sm:px-5 py-3 sm:py-3.5 text-left rounded-xl transition-colors group"
                      style={{ borderBottom: index < suggestions.length - 1 ? "1px solid var(--border-soft)" : "none" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--surface-cream)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      {suggestion.type === "listing" && suggestion.image ? (
                        <div className="relative w-11 h-11 overflow-hidden rounded-xl border shrink-0" style={{ borderColor: "var(--border-soft)" }}>
                          <Image src={suggestion.image} alt={suggestion.label} fill className="object-cover" sizes="44px" />
                        </div>
                      ) : (
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            background: "var(--brand-light)",
                            color: "var(--brand-accent)",
                            border: "1px solid rgba(34,153,120,0.15)"
                          }}
                        >
                          <suggestion.icon className="w-5 h-5" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <p
                          className="text-sm font-semibold truncate transition-colors"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {suggestion.label}
                        </p>
                        <span
                          className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md"
                          style={{
                            background: suggestion.type === "category"
                              ? "rgba(34,153,120,0.1)"
                              : suggestion.type === "city"
                              ? "rgba(245,158,11,0.1)"
                              : "var(--surface-cream)",
                            color: suggestion.type === "category"
                              ? "var(--brand-accent)"
                              : suggestion.type === "city"
                              ? "#b45309"
                              : "var(--text-secondary)"
                          }}
                        >
                          {suggestion.type === "listing" ? suggestion.category : suggestion.type}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 hidden sm:block" style={{ color: "var(--brand-accent)" }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25 animate-bounce pointer-events-none">
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
