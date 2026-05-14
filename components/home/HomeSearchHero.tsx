"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, Compass, Sparkles, MapPin, Tag } from "lucide-react";
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

  const [activeCityTab, setActiveCityTab] = useState("all");

  // Handle clicking outside of suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch listing suggestions
  useEffect(() => {
    const fetchListings = async () => {
      if (!debouncedSearch.trim() || debouncedSearch.length < 2) {
        setListingSuggestions([]);
        return;
      }

      setIsLoadingListings(true);
      try {
        const response = await fetch(`/api/listings?q=${encodeURIComponent(debouncedSearch)}`);
        const data = await response.json();
        if (data.listings) {
          setListingSuggestions(data.listings.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoadingListings(false);
      }
    };

    fetchListings();
  }, [debouncedSearch]);

  const suggestions = useMemo(() => {
    const query = city.toLowerCase().trim();
    
    // If empty input, show all categories
    if (!query) {
      return categories.map(cat => ({
        type: 'category',
        label: cat.label,
        value: cat.value,
        icon: Tag
      }));
    }

    const results: any[] = [];

    // Categories
    categories.forEach(cat => {
      if (cat.label.toLowerCase().includes(query) || cat.aliases.some(a => a.includes(query))) {
        results.push({ type: 'category', label: cat.label, value: cat.value, icon: Tag });
      }
      
      // Subcategories
      cat.subcategories.forEach(sub => {
        if (sub.label.toLowerCase().includes(query) || sub.aliases?.some(a => a.includes(query))) {
          results.push({ 
            type: 'subcategory', 
            label: `${sub.label} (${cat.label})`, 
            value: sub.value, 
            categoryValue: cat.value,
            icon: Compass 
          });
        }
      });
    });

    // Cities
    albaniaCities.forEach(c => {
      if (c.label.toLowerCase().includes(query)) {
        results.push({ type: 'city', label: c.label, value: c.value, icon: MapPin });
      }
    });

    // Merge with listings
    const merged = [...results.slice(0, 6)];
    
    listingSuggestions.forEach(listing => {
      merged.push({
        type: 'listing',
        label: listing.title,
        value: listing.slug,
        category: listing.category,
        icon: Sparkles
      });
    });

    return merged;
  }, [city, listingSuggestions]);

  const cityTabs = [
    { id: "all", label: language === 'en' ? "Search All" : "Kërko gjithçka" },
    { id: "tirane", label: "Tiranë" },
    { id: "durres", label: "Durrës" },
    { id: "vlore", label: "Vlorë" },
    { id: "sarande", label: "Sarandë" },
    { id: "shkoder", label: "Shkodër" },
    { id: "berat", label: "Berat" },
    { id: "gjirokaster", label: "Gjirokastër" },
    { id: "korce", label: "Korçë" },
    { id: "cities", label: language === 'en' ? "More Cities" : "Më shumë qytete", isLink: true },
  ];

  function handleSuggestionClick(suggestion: any) {
    if (suggestion.type === 'listing') {
      router.push(`/listings/${suggestion.value}`);
      setShowSuggestions(false);
      return;
    }

    const params = new URLSearchParams();
    if (suggestion.type === 'category') {
      params.set("category", suggestion.value);
    } else if (suggestion.type === 'subcategory') {
      params.set("category", suggestion.categoryValue);
      params.set("subcategory", suggestion.value);
    } else if (suggestion.type === 'city') {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-visible bg-slate-950">
      {/* Background Layer */}
      <div className="absolute inset-0 overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=80" 
          alt="Albania Landscapes" 
          fill 
          className="object-cover opacity-70 animate-slow-zoom" 
          priority
        />
        {/* Balanced Cinematic Overlay */}
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-transparent to-slate-950" />
      </div>

      {/* Vector Decorators */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[15%] right-[10%] w-80 h-80 bg-emerald-500/10 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      <div className="page-shell relative z-10 w-full flex flex-col items-center">
        <div className="text-center max-w-4xl mb-12">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-brand-400 mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'en' ? "Explore Albania Like Never Before" : "Eksploro Shqipërinë si kurrë më parë"}
          </div>
          
          <h1 className="text-5xl sm:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.9] animate-slide-up">
            {language === 'en' ? "Find Your Next" : "Gjej Tjetrën"}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-400 to-brand-500">
              {language === 'en' ? "Adventure." : "Aventurë."}
            </span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-slate-100 font-semibold leading-relaxed max-w-2xl mx-auto animate-slide-up delay-100 drop-shadow-sm">
            {language === 'en' 
              ? "Discover curated stays, local flavors, and unforgettable adventures across the Land of Eagles." 
              : "Zbuloni akomodime të zgjedhura, shije lokale dhe aventura të paharrueshme në vendin e shqiponjave."}
          </p>
        </div>

        {/* Search Wrapper - High Z-index and overflow visible */}
        <div className="w-full max-w-4xl relative z-[100]" ref={searchRef}>
          {/* Glassmorphism Container */}
          <div className="relative z-20 glass shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] sm:rounded-[3.5rem] p-3 sm:p-5 border-white/10 backdrop-blur-3xl bg-white/40">
            {/* Tabs */}
            <div className="flex items-center gap-2 sm:gap-6 px-6 mb-4 overflow-x-auto no-scrollbar">
              {cityTabs.map((tab) => (
                tab.isLink ? (
                  <Link 
                    key={tab.id}
                    href="/services" 
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition whitespace-nowrap"
                  >
                    {tab.label}
                  </Link>
                ) : (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveCityTab(tab.id);
                      if (tab.id === "all") {
                        router.push("/services");
                      } else {
                        router.push(`/city/${tab.id}`);
                      }
                    }}
                    className="group relative py-2 transition whitespace-nowrap"
                  >
                    <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                      activeCityTab === tab.id ? "text-brand-600 scale-110 drop-shadow-[0_0_8px_rgba(34,153,120,0.3)]" : "text-slate-700 hover:text-slate-900"
                    }`}>
                      {tab.label}
                    </span>
                    {activeCityTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-400 rounded-full shadow-[0_0_20px_rgba(34,153,120,0.8)]" />
                    )}
                  </button>
                )
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={submit} className="relative">
              <div className="flex flex-col sm:flex-row items-center gap-4 p-2 pl-4 sm:pl-8 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl transition-all duration-500 focus-within:ring-8 focus-within:ring-brand-500/20">
                <div className="flex items-center gap-3 sm:gap-5 w-full">
                  <Search className="h-6 w-6 sm:h-7 sm:w-7 text-brand-600 shrink-0" />
                  <input
                    value={city}
                    onChange={(event) => {
                      setCity(event.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder={language === 'en' ? "Search for cities, hotels, activities..." : "Kërko për qytete, hotele, aktivitete..."}
                    className="w-full bg-transparent py-3 sm:py-5 text-lg sm:text-xl text-slate-950 outline-none font-black placeholder:text-slate-400 placeholder:font-bold"
                  />
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 pr-2">
                  <button 
                    type="submit" 
                    className="w-full sm:w-auto px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-2xl shadow-brand-600/30 active:scale-95 flex items-center justify-center gap-3"
                  >
                    {language === 'en' ? "Search" : "Kërko"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Suggestions Dropdown - Positioned BELOW the search and outside the clipping containers */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-6 bg-white rounded-[2.5rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.6)] border border-slate-200 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-6 duration-500">
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 mb-4">
                  <div className="flex items-center gap-3">
                    <Compass className="w-5 h-5 text-brand-600 animate-spin-slow" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-950">
                      {language === 'en' ? "Quick Discovery" : "Zbulim i shpejtë"}
                    </span>
                  </div>
                  {isLoadingListings && (
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                      <div className="w-2 h-2 bg-brand-500 rounded-full animate-ping" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Searching...</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 p-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-6 px-8 py-5 hover:bg-slate-50 transition-all text-left group rounded-3xl"
                    >
                      <div className="w-14 h-14 rounded-[1.25rem] bg-slate-100 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all shadow-sm border border-slate-200/50">
                        <suggestion.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-lg font-black text-slate-950 group-hover:text-brand-700 transition truncate">
                          {suggestion.label}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${
                            suggestion.type === 'category' ? 'bg-emerald-100 text-emerald-700' :
                            suggestion.type === 'subcategory' ? 'bg-blue-100 text-blue-700' :
                            suggestion.type === 'city' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {suggestion.type === 'listing' ? suggestion.category : suggestion.type}
                          </span>
                          {suggestion.type === 'listing' && (
                            <span className="text-[11px] font-bold text-slate-400 italic">Listing</span>
                          )}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shadow-sm">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {city && suggestions.length > 0 && (
                  <div className="mt-6 mx-4 p-5 bg-slate-50/80 backdrop-blur-sm rounded-[2rem] border border-slate-100">
                    <button 
                      onClick={() => submit({ preventDefault: () => {} } as any)}
                      className="w-full flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-brand-600 transition group"
                    >
                      {language === 'en' ? "Show all matching results" : "Shfaq të gjitha rezultatet"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce pointer-events-none">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
