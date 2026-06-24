"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, MapPin, Sparkles, ChevronLeft, ChevronRight, CheckCircle, Flame, Star, Bed, Utensils, Car, Plane, Anchor, Truck, Calendar, Music, Ticket, ShoppingBag, Camera } from "lucide-react";
import HomeSearchHero from "@/components/home/HomeSearchHero";
import HorizontalRail from "@/components/home/HorizontalRail";
import ListingCard from "@/components/ListingCard";
import { albaniaCities } from "@/lib/albania-cities";
import { categories } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

function HomePageClient() {
  const { language } = useLanguage();
  const t = translations[language];
  const searchParams = useSearchParams();
  
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [dynamicCities, setDynamicCities] = useState<any[]>(albaniaCities);

  // Get search parameters
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const query = searchParams.get('q');
  const city = searchParams.get('city');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const listingsRes = await fetch('/api/listings');
            const listingsData = await listingsRes.json();
            setListings(listingsData.listings || []);

            const postsRes = await fetch('/api/blog');
            const postsData = await postsRes.json();
            setBlogPosts(postsData.posts || []);

            const citiesRes = await fetch('/api/cities');
            const citiesData = await citiesRes.json();
            if (Array.isArray(citiesData.cities) && citiesData.cities.length) {
              setDynamicCities(citiesData.cities);
            }
        } catch (error) {
            console.error("Error fetching home data:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // Handle search results filtering
  useEffect(() => {
    if (category || subcategory || query || city) {
      let filtered = listings;

      if (category) {
        const normalizedCategory = String(category).toLowerCase();
        const categoryObj = categories.find(c => c.value === normalizedCategory);
        
        filtered = filtered.filter(listing => {
          const listingCategory = String(listing.category).toLowerCase();
          if (categoryObj?.aliases.some(alias => alias === listingCategory)) return true;
          return listingCategory === normalizedCategory;
        });

        if (subcategory) {
          const normalizedSubcategory = String(subcategory).toLowerCase();
          filtered = filtered.filter(listing => {
            const listingSubcategory = String(listing.subcategory || '').toLowerCase();
            return listingSubcategory === normalizedSubcategory;
          });
        }
      }

      if (query) {
        const normalizedQuery = String(query).toLowerCase();
        filtered = filtered.filter(listing => {
          const title = String(listing.title).toLowerCase();
          const description = String(listing.description).toLowerCase();
          const listingCity = String(listing.city).toLowerCase();
          return title.includes(normalizedQuery) || description.includes(normalizedQuery) || listingCity.includes(normalizedQuery);
        });
      }

      if (city) {
        const normalizedCity = String(city).toLowerCase();
        filtered = filtered.filter(listing => {
          const listingCity = String(listing.city).toLowerCase();
          return listingCity === normalizedCity;
        });
      }

      setSearchResults(filtered);
      setShowSearchResults(true);
      
      // Scroll to top to show results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  }, [category, subcategory, query, city, listings]);

  const featuredListings = listings.filter(l => l.featured).slice(0, 8);
  
  const accommodationCategory = categories.find(c => c.value === "akomodim");
  const foodCategory = categories.find(c => c.value === "restorante");
  const eventCategory = categories.find(c => c.value === "evente");
  const transportCategory = categories.find(c => c.value === "transport");
  const serviceCategory = categories.find(c => c.value === "sherbime-turistike");
  const localCategory = categories.find(c => c.value === "produkte-lokale");
  const attractionCategory = categories.find(c => c.value === "atraksione");

  const blogFallbacks = [
    { slug: "sample-guide-1", title: "Si të zgjidhni qytetin e duhur fillimisht", excerpt: "Filloni me vendndodhjen, pastaj kaloni te kategoria e duhur e shërbimit." },
    { slug: "sample-guide-2", title: "Çfarë të kërkoni te një listim i besueshëm", excerpt: "Cilësia, qartësia dhe sinjalet e besimit e lehtësojnë rezervimin." },
    { slug: "sample-guide-3", title: "Planifikimi i ushqimit, qëndrimeve dhe transportit së bashku", excerpt: "Një rrjedhë praktike për udhëtarët që duan strukturë më të mirë." }
  ];

  const railsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollRail = (id: string, direction: 'left' | 'right') => {
    const rail = railsRef.current[id];
    if (!rail) return;
    const offset = direction === 'left' ? -420 : 420;
    rail.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const normalizeValue = (value: unknown) => String(value || "").toLowerCase();

  const getCategoryListings = (category: any) => {
    if (!category) return [];
    const normalizedCategory = normalizeValue(category.value);
    const normalizedLabel = normalizeValue(category.label);

    return listings.filter((listing: any) => {
      const listingCategory = normalizeValue(listing.category);
      return (
        listingCategory === normalizedCategory ||
        listingCategory === normalizedLabel ||
        category.aliases.some((alias: string) => alias === listingCategory)
      );
    }).slice(0, 12);
  };

  const getTransportIcon = (val: string) => {
    if (val.includes('aeroport')) return <Plane className="w-8 h-8" />;
    if (val.includes('varka')) return <Anchor className="w-8 h-8" />;
    if (val.includes('makine')) return <Car className="w-8 h-8" />;
    return <Truck className="w-8 h-8" />;
  }

  return (
    <main className="pb-16" style={{ background: "var(--surface-page)" }}>
      {/* Search Results Section - Appears when search is active */}
      {showSearchResults && (
        <section className="relative py-20 min-h-screen flex flex-col justify-center" style={{ background: "var(--surface-page)" }}>
          <div className="page-shell">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow mb-2">
                  {searchResults.length} {searchResults.length === 1 ? t.common.result : t.common.results}
                </p>
                <h2 className="font-bold tracking-tight" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "var(--text-primary)" }}>
                  {category && categories.find(c => c.value === category)?.label}
                  {subcategory && ` > ${subcategory}`}
                  {city && dynamicCities.find(c => c.value === city)?.label && ` • ${dynamicCities.find(c => c.value === city)?.label}`}
                  {query && `${t.common.searchPrefix}"${query}"`}
                </h2>
              </div>
            </div>

            {searchResults.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((listing: any) => (
                  <ListingCard key={listing._id?.toString() || listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div
                className="rounded-2xl border-2 border-dashed p-16 text-center"
                style={{ borderColor: "var(--border-soft)", background: "var(--surface-white)" }}
              >
                <p className="text-xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
                  {t.common.noListingsFound}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {t.common.tryAdjustSearch}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hero Section - Hidden when search is active */}
      {!showSearchResults && <HomeSearchHero />}

      {showSearchResults ? null : (
      <div className="page-shell space-y-8 py-8 sm:space-y-14 sm:py-14">
        
        {/* 1. POPULAR DESTINATIONS (CITIES) - Logical First Step */}
        <HorizontalRail
          eyebrow={t.common.category}
          title={t.home.popularDestinations}
          description={t.home.popularSub}
        >
          {dynamicCities.map((city) => (
            <Link
              key={city.value}
              href={`/city/${city.value}`}
              className="travel-card group min-w-[260px] overflow-hidden transition-all duration-250 hover:-translate-y-1" 
            >
              <div className="relative aspect-[16/10] overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
                <Image src={city.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"} alt={city.label} fill className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,12,16,0.75) 0%, rgba(10,12,16,0.1) 60%, transparent 100%)" }} />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>{t.common.city}</p>
                    <h3 className="text-xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{city.label}</h3>
                </div>
              </div>
            </Link>
          ))}
        </HorizontalRail>

        {[
          {
            id: "akomodim",
            category: accommodationCategory,
            eyebrow: language === 'en' ? 'Accommodation' : 'Akomodimi',
            title: t.home.whereToSleepTitle,
            description: t.home.whereToSleepDesc,
            accent: 'bg-blue-50 text-blue-700',
            fallbackImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
            buttonLabel: t.home.addAccommodation
          },
          {
            id: "restorante",
            category: foodCategory,
            eyebrow: language === 'en' ? 'Food & Drink' : 'Ushqimi dhe pija',
            title: t.home.whereToEatTitle,
            description: t.home.whereToEatDesc,
            accent: 'bg-orange-50 text-orange-700',
            fallbackImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
            buttonLabel: t.home.addPlaceToEat
          },
          {
            id: "evente",
            category: eventCategory,
            eyebrow: language === 'en' ? 'Events' : 'Eventet',
            title: t.home.eventsTitle,
            description: t.home.eventsDesc,
            accent: 'bg-brand-50 text-brand-700',
            fallbackImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
            buttonLabel: t.home.addEvent
          },
          {
            id: "transport",
            category: transportCategory,
            eyebrow: language === 'en' ? 'Transportation' : 'Transporti',
            title: t.home.transportTitle,
            description: t.home.transportDesc,
            accent: 'bg-brand-50 text-brand-700',
            fallbackImage: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=600&q=80',
            buttonLabel: t.home.addTransport
          },
          {
            id: "sherbime-turistike",
            category: serviceCategory,
            eyebrow: language === 'en' ? 'Tourism Services' : 'Shërbime Turistike',
            title: language === 'en' ? 'Local Tourism Services' : 'Shërbimet Turistike Lokale',
            description: language === 'en'
              ? 'Browse local tourism services in a design that matches the rest of the homepage.'
              : 'Shfletoni shërbimet turistike lokale me stil të njëjtë si pjesët e tjera.',
            accent: 'bg-emerald-50 text-emerald-700',
            fallbackImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
            buttonLabel: t.home.addService
          },
          {
            id: "produkte-lokale",
            category: localCategory,
            eyebrow: language === 'en' ? 'Local Products' : 'Produkte Lokale',
            title: language === 'en' ? 'Shop Local Products' : 'Produkte Lokale',
            description: language === 'en'
              ? 'Discover artisan products, souvenirs and local specialties.'
              : 'Zbuloni produkte artizanale, suvenire dhe specialitete lokale.',
            accent: 'bg-cyan-50 text-cyan-700',
            fallbackImage: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=80',
            buttonLabel: t.home.addProduct
          },
          {
            id: "atraksione",
            category: attractionCategory,
            eyebrow: language === 'en' ? 'Attractions' : 'Atraksione',
            title: language === 'en' ? 'Explore Attractions' : 'Atraksione për të Eksploruar',
            description: language === 'en'
              ? 'Find top places, museums, and outdoor activities.'
              : 'Gjeni vendet kryesore, muzeun dhe aktivitete jashtë.',
            accent: 'bg-violet-50 text-violet-700',
            fallbackImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
            buttonLabel: t.home.addAttraction
          }
        ].map((section) => {
          const categoryListings = getCategoryListings(section.category);
          const showFallback = categoryListings.length === 0;

          return (
            <HorizontalRail
              key={section.id}
              id={section.id}
              eyebrow={section.eyebrow}
              title={section.title}
              description={section.description}
              actionButton={
                <Link 
                  href={`/create-listing?category=${section.id}`} 
                  className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95 border border-[var(--border-medium)] bg-[var(--surface-white)] text-[var(--text-secondary)] hover:border-[var(--brand-accent)] hover:text-[var(--brand-accent)] shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  {section.buttonLabel}
                </Link>
              }
            >
              {showFallback ? (
                section.category?.subcategories.map((sub) => (
                  <Link
                    key={sub.value}
                    href={`/categories/${section.category?.value}/${sub.value}`}
                    className="travel-card min-w-[300px] max-w-[300px] shrink-0 snap-start group relative overflow-hidden transition hover:-translate-y-1"
                  >
                    <Image
                      src={section.fallbackImage}
                      alt={sub.label}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110 opacity-80"
                    />
                     <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,12,16,0.85) 0%, rgba(10,12,16,0.15) 60%, transparent 100%)" }} />
                     <div className="absolute inset-0 flex flex-col justify-end p-6">
                       <h3 className="text-xl font-bold text-white" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>{sub.label}</h3>
                       <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mt-2 flex items-center gap-2 group-hover:gap-3 transition-all" style={{ color: "rgba(255,255,255,0.65)" }}>
                         {t.common.explore} <ArrowRight className="w-3 h-3" />
                       </p>
                    </div>
                  </Link>
                ))
              ) : (
                categoryListings.map((listing) => (
                  <div key={listing._id} className="min-w-[280px] max-w-[280px] shrink-0 snap-start h-full">
                    <ListingCard listing={listing} />
                  </div>
                ))
              )}
            </HorizontalRail>
          );
        })}

        {/* 9. TRUST / WHY CHOOSE US */}
        <section
          className="rounded-2xl p-8 sm:p-14 overflow-hidden"
          style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
        >
            <div className="grid gap-12 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <p className="eyebrow mb-4">{language === 'en' ? 'The Advantage' : 'Avantazhi'}</p>
                    <h2
                      className="font-bold tracking-tight mb-5"
                      style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
                    >
                        {language === 'en' ? 'Why choose our marketplace?' : 'Pse të zgjidhni tregun tonë?'}
                    </h2>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                        {language === 'en' 
                            ? 'We connect you directly with verified local hosts to ensure authentic experiences and the best prices.' 
                            : 'Ne ju lidhim drejtpërdrejt me hostë lokalë të verifikuar për të siguruar përvoja autentike dhe çmimet më të mira.'}
                    </p>
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                      style={{ background: "var(--brand-accent)", boxShadow: "0 2px 12px rgba(34,153,120,0.22)" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-hover)")}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-accent)")}>
                        {language === 'en' ? 'Explore All Services' : 'Eksploro të gjitha shërbimet'} <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                
                <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                    {[
                        { title: language === 'en' ? 'Verified Quality' : 'Cilësi e Verifikuar', desc: language === 'en' ? 'Every listing is manually reviewed for accuracy.' : 'Çdo listim shqyrtohet manualisht për saktësi.', icon: CheckCircle },
                        { title: language === 'en' ? 'Direct Booking' : 'Rezervim Direkt', desc: language === 'en' ? 'Communicate directly with the hosts via phone or WhatsApp.' : 'Komunikoni drejtpërdrejt me hostët me telefon ose WhatsApp.', icon: Sparkles },
                        { title: language === 'en' ? 'Local Expertise' : 'Ekspertizë Lokale', desc: language === 'en' ? 'Get insider tips from people who live in the cities you visit.' : 'Merrni këshilla nga njerëzit që jetojnë në qytetet që vizitoni.', icon: Star },
                        { title: language === 'en' ? 'No Hidden Fees' : 'Pa Tarifa të Fshehura', desc: language === 'en' ? 'What you see is what you pay. Transparent pricing always.' : 'Ajo që shihni është ajo që paguani. Çmime transparente gjithmonë.', icon: Flame }
                    ].map((benefit, i) => (
                        <div
                          key={i}
                          className="group p-7 rounded-2xl transition-all duration-250"
                          style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,153,120,0.25)"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)"; }}
                        >
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-250 group-hover:scale-105"
                              style={{ background: "var(--brand-light)", color: "var(--brand-accent)", border: "1px solid rgba(34,153,120,0.15)" }}
                            >
                                <benefit.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{benefit.title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 8. BLOG (RE-PRESENTED IN NEW FORM) - CLEAN VERSION */}
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
                <p className="eyebrow mb-3">{t.blog.archiveTitle}</p>
                <h2
                  className="font-bold tracking-tight"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
                >{t.blog.latestPub}</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 shrink-0"
              style={{ background: "var(--brand-accent)", boxShadow: "0 2px 12px rgba(34,153,120,0.22)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-hover)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-accent)")}>
                {language === 'en' ? 'Visit Journal' : 'Vizito Revistën'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Main Featured */}
            <div className="lg:col-span-12">
                <Link href={`/blog/${blogPosts[0]?.slug || "sample"}`} className="group relative block h-[420px] sm:h-[520px] overflow-hidden" style={{ borderRadius: "20px" }}>
                    <Image src={blogPosts[0]?.coverImage || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"} alt="Hero Blog" fill className="object-cover transition duration-700 group-hover:scale-103" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,12,16,0.9) 0%, rgba(10,12,16,0.2) 55%, transparent 100%)" }} />
                    <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end text-white">
                        <div
                          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] mb-5 w-fit"
                          style={{ background: "var(--brand-accent)", boxShadow: "0 2px 8px rgba(34,153,120,0.3)" }}
                        >
                            {language === 'en' ? 'Featured Story' : 'Historia e rekomanduar'}
                        </div>
                        <h3
                          className="font-bold mb-4 text-white leading-tight group-hover:opacity-90 transition-opacity"
                          style={{ fontSize: "clamp(1.5rem, 4vw, 2.75rem)", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
                        >{blogPosts[0]?.title || blogFallbacks[0].title}</h3>
                        <p className="text-sm mb-6 line-clamp-2 max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                            {blogPosts[0]?.excerpt || blogFallbacks[0].excerpt}
                        </p>
                        <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                            {t.blog.readStory} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </div>
                </Link>
            </div>
            
            {/* Small Cards below */}
            <div className="lg:col-span-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(blogPosts.length > 1 ? blogPosts.slice(1, 4) : blogFallbacks).map((post: any) => (
                    <Link
                        key={post._id?.toString?.() || post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col transition-all duration-250 hover:-translate-y-1"
                        style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", borderRadius: "16px", boxShadow: "var(--shadow-card)", overflow: "hidden" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,153,120,0.2)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)"; }}
                    >
                        <div className="relative w-full aspect-[16/9] overflow-hidden flex-shrink-0">
                            <Image src={post.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-103" />
                        </div>
                        <div className="flex flex-col flex-1 p-5">
                            <p className="eyebrow mb-2">
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Editorial"}
                            </p>
                            <h4
                              className="text-base font-semibold line-clamp-2 leading-snug mb-2 transition-colors"
                              style={{ color: "var(--text-primary)" }}
                            >{post.title}</h4>
                            <p className="text-sm line-clamp-2 leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{post.excerpt}</p>
                            <span
                              className="mt-auto text-xs font-semibold uppercase tracking-[0.18em] flex items-center gap-2 transition-colors"
                              style={{ color: "var(--brand-accent)" }}
                            >
                                {language === 'en' ? 'Full Story' : 'Lexo të plotë'} <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
          </div>
        </section>
      </div>
      )}
    </main>
  );
}

export default HomePageClient;
