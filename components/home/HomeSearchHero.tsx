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
        if (data.listings) {
          setListingSuggestions(data.listings.slice(0, 12));
        }
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
        if (Array.isArray(data.cities) && data.cities.length) {
          setAvailableCities(data.cities);
        }
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
        icon: Tag,
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
            score: scoreMatch(sub.label),
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
        score: Math.min(scoreMatch(listingLabel), scoreMatch(listingLocation), scoreMatch(listingCategory)),
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

    const params = new URLSearchParams();
    if (suggestion.type === "category") {
      params.set("category", suggestion.value);
    } else if (suggestion.type === "subcategory") {
      params.set("category", suggestion.categoryValue);
      params.set("subcategory", suggestion.value);
    } else if (suggestion.type === "city") {
      params.set("city", suggestion.value);
    }

    router.push(`/?${params.toString()}`);
    setShowSuggestions(false);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = city.toLowerCase().trim();

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/${params.toString() ? `?${params.toString()}` : ""}`);
    setShowSuggestions(false);
  }

  return (
    <section className="relative min-h-[72svh] sm:min-h-screen flex items-center justify-center overflow-visible bg-slate-950 py-8 sm:py-0">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=80"
          alt="Albania Landscapes"
          fill
          className="object-cover opacity-70 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-emerald-500/10 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      <div className="page-shell relative z-10 w-full flex flex-col items-center pt-4 sm:pt-0">
        <div className="text-center max-w-4xl mb-5 sm:mb-12">
          <h1 className="text-[2.05rem] sm:text-8xl font-black tracking-[-0.02em] text-white mb-3 sm:mb-4 leading-[1.02] animate-slide-up drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] px-2">
            {language === "en" ? "Discover Albania Beautifully" : "Zbulo Shqiperine Bukur"}
          </h1>
        </div>

        <div
          className={`${showSuggestions ? "fixed inset-0 z-[11111111111] w-screen h-screen bg-slate-50 sm:relative sm:z-[100] sm:bg-transparent sm:w-full sm:h-auto sm:max-w-4xl flex flex-col" : "relative w-full max-w-4xl z-[100]"}`}
          ref={searchRef}
        >
          {showSuggestions && (
            <div className="sm:hidden px-4 pt-3 pb-3 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 rounded-full border border-slate-400 bg-white px-4 py-2.5">
                  <Search className="w-5 h-5 text-fuchsia-600 shrink-0" />
                  <input
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder={language === "en" ? "ex. city, hotel, address..." : "p.sh. qytet, hotel, adrese..."}
                  className="w-full bg-transparent text-lg text-slate-700 outline-none font-semibold placeholder:text-slate-500"
                  autoFocus
                />
                </div>
                <button onClick={() => setShowSuggestions(false)} className="p-1.5 text-fuchsia-600 hover:text-fuchsia-700 rounded-full transition-colors">
                  <X className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}

          <div
            className={`relative z-20 ${showSuggestions ? "hidden sm:block sm:glass sm:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] sm:rounded-[3.5rem] sm:p-5 sm:border-white/10 sm:backdrop-blur-3xl sm:bg-white/40 p-4" : "glass shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-[2rem] sm:rounded-[3.5rem] p-2.5 sm:p-5 border-white/10 backdrop-blur-3xl bg-white/45"}`}
          >
            <form onSubmit={submit} className="relative">
              <div className="flex flex-col sm:flex-row items-center gap-3 p-2.5 pl-4 sm:pl-8 bg-white rounded-[1.6rem] sm:rounded-[2.5rem] shadow-2xl transition-all duration-500 focus-within:ring-8 focus-within:ring-brand-500/20 border border-slate-100 sm:border-transparent">
                <div className="flex items-center gap-3 sm:gap-5 w-full">
                  <Search className="h-6 w-6 sm:h-7 sm:w-7 text-brand-600 shrink-0" />
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
                    placeholder={language === "en" ? "Search for cities, hotels, activities..." : "Kerko per qytete, hotele, aktivitete..."}
                    className="w-full bg-transparent py-3 sm:py-5 text-lg sm:text-xl text-slate-950 outline-none font-black placeholder:text-slate-400 placeholder:font-bold"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pr-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-2xl shadow-brand-600/30 active:scale-95 flex items-center justify-center gap-3"
                  >
                    {language === "en" ? "Search" : "Kerko"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="sm:absolute sm:top-full sm:left-0 sm:right-0 sm:mt-6 flex-grow sm:flex-grow-0 bg-white sm:rounded-[2.5rem] sm:shadow-[0_64px_128px_-32px_rgba(0,0,0,0.6)] sm:border border-slate-200 overflow-hidden z-[9999] animate-in fade-in sm:slide-in-from-top-6 duration-500">
              <div className="p-3 sm:p-4 h-full sm:max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                {!city.trim() && (
                <div className="sm:hidden px-2 pb-3">
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-200 mb-3">
                    <MapPin className="w-6 h-6 text-slate-700 mt-0.5" />
                    <div>
                      <p className="text-slate-900 font-semibold text-[1.1rem] leading-6">{language === "en" ? "Search around me" : "Kerko afer meje"}</p>
                      <p className="text-slate-600 text-sm">{language === "en" ? "Available accommodations nearby" : "Akomodime te disponueshme prane teje"}</p>
                    </div>
                  </div>
                  <h3 className="text-slate-700 text-[1.75rem] font-medium mb-3">{language === "en" ? "Popular destinations" : "Destinacione popullore"}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {popularCities.map((name) => (
                      <button
                        key={name}
                        onClick={() => {
                          setCity(name);
                          router.push(`/?q=${encodeURIComponent(name.toLowerCase())}`);
                          setShowSuggestions(false);
                        }}
                        className="rounded-full bg-slate-200 text-slate-800 px-3 py-1.5 text-[1rem] font-medium"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
                )}

                {isLoadingListings && (
                  <div className="flex items-center justify-center gap-3 px-4 py-3 mb-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-2 h-2 bg-brand-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Searching...</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-1 p-1 sm:gap-2 sm:p-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 sm:gap-6 px-3 sm:px-8 py-2.5 sm:py-5 hover:bg-slate-50 transition-all text-left group rounded-2xl sm:rounded-3xl border-b border-slate-100 last:border-b-0"
                    >
                      {suggestion.type === "listing" && suggestion.image ? (
                        <div className="relative w-14 h-14 overflow-hidden rounded-[1.25rem] border border-slate-200 shadow-sm">
                          <Image src={suggestion.image} alt={suggestion.label} fill className="object-cover" sizes="56px" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-[1.25rem] bg-brand-50 text-brand-700 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm border border-brand-200/70">
                          <suggestion.icon className="w-6 h-6" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <p className="text-base sm:text-lg font-semibold sm:font-black text-slate-950 group-hover:text-brand-700 transition truncate">{suggestion.label}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span
                            className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${
                              suggestion.type === "category"
                                ? "bg-emerald-100 text-emerald-700"
                                : suggestion.type === "subcategory"
                                  ? "bg-blue-100 text-blue-700"
                                  : suggestion.type === "city"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {suggestion.type === "listing" ? suggestion.category : suggestion.type}
                          </span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all hidden sm:block">
                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce pointer-events-none">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
