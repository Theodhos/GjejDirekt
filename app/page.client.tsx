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
    <main className="pb-12 bg-slate-50/30">
      {/* Search Results Section - Appears when search is active */}
      {showSearchResults && (
        <section className="relative bg-slate-50 py-32 min-h-screen flex flex-col justify-center">
          <div className="page-shell">
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-brand-600 font-black mb-2">
                  {searchResults.length} {searchResults.length === 1 ? (language === 'en' ? 'result' : 'rezultat') : (language === 'en' ? 'results' : 'rezultate')}
                </p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-950">
                  {category && categories.find(c => c.value === category)?.label}
                  {subcategory && ` > ${subcategory}`}
                  {city && dynamicCities.find(c => c.value === city)?.label && ` • ${dynamicCities.find(c => c.value === city)?.label}`}
                  {query && `${language === 'en' ? 'Search: ' : 'Kërkimi: '}"${query}"`}
                </h2>
              </div>
            </div>

            {searchResults.length ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((listing: any) => (
                  <ListingCard key={listing._id?.toString() || listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white p-16 text-center">
                <p className="text-2xl font-black text-slate-900 mb-4">
                  {language === 'en' ? 'No listings found.' : 'Nuk u gjet asnjë listim.'}
                </p>
                <p className="text-slate-500">
                  {language === 'en' ? 'Try adjusting your search criteria.' : 'Përpiquni të ndryshoni kriteret e kërkimit.'}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Hero Section - Hidden when search is active */}
      {!showSearchResults && <HomeSearchHero />}

      {showSearchResults ? null : (
      <div className="page-shell space-y-10 py-6 sm:space-y-12 sm:py-12">
        
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
              className="group min-w-[280px] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10"
            >
              <div className="relative aspect-[16/10]">
                <Image src={city.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"} alt={city.label} fill className="object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <p className="text-xs font-black uppercase tracking-widest text-emerald-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mb-2">{language === 'en' ? 'City' : 'Qytet'}</p>
                    <h3 className="text-2xl font-black text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">{city.label}</h3>
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
            buttonLabel: language === 'en' ? 'Add Accommodation' : 'Shto Akomodim'
          },
          {
            id: "restorante",
            category: foodCategory,
            eyebrow: language === 'en' ? 'Food & Drink' : 'Ushqimi dhe pija',
            title: t.home.whereToEatTitle,
            description: t.home.whereToEatDesc,
            accent: 'bg-orange-50 text-orange-700',
            fallbackImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
            buttonLabel: language === 'en' ? 'Add Place to Eat' : 'Shto Restorant'
          },
          {
            id: "evente",
            category: eventCategory,
            eyebrow: language === 'en' ? 'Events' : 'Eventet',
            title: t.home.eventsTitle,
            description: t.home.eventsDesc,
            accent: 'bg-brand-50 text-brand-700',
            fallbackImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
            buttonLabel: language === 'en' ? 'Add Event' : 'Shto Event'
          },
          {
            id: "transport",
            category: transportCategory,
            eyebrow: language === 'en' ? 'Transportation' : 'Transporti',
            title: t.home.transportTitle,
            description: t.home.transportDesc,
            accent: 'bg-brand-50 text-brand-700',
            fallbackImage: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=600&q=80',
            buttonLabel: language === 'en' ? 'Add Transport' : 'Shto Transport'
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
            buttonLabel: language === 'en' ? 'Add Service' : 'Shto Shërbim'
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
            buttonLabel: language === 'en' ? 'Add Product' : 'Shto Produkt'
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
            buttonLabel: language === 'en' ? 'Add Attraction' : 'Shto Atraksion'
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
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-2.5 text-sm font-black text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:text-brand-600 hover:shadow-[0_8px_30px_rgb(var(--brand-500)/0.12)] active:translate-y-0 active:scale-95"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-brand-100 group-hover:text-brand-600">
                    <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                  {section.buttonLabel}
                </Link>
              }
            >
              {showFallback ? (
                section.category?.subcategories.map((sub) => (
                  <Link
                    key={sub.value}
                    href={`/categories/${section.category?.value}/${sub.value}`}
                    className="min-w-[320px] max-w-[320px] shrink-0 snap-start group relative overflow-hidden rounded-[2.5rem] bg-slate-100 transition hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <Image
                      src={section.fallbackImage}
                      alt={sub.label}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <h3 className="text-2xl font-black text-white">{sub.label}</h3>
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-2 flex items-center gap-2 group-hover:gap-4 transition-all">
                        {t.common.explore} <ArrowRight className="w-3.5 h-3.5" />
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
        <section className="bg-white rounded-[4rem] p-8 sm:p-20 border border-slate-100 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] -ml-48 -mt-48" />
            <div className="relative z-10 grid gap-20 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <p className="text-xs uppercase tracking-[0.4em] font-black text-brand-700 mb-6">{language === 'en' ? 'The Advantage' : 'Avantazhi'}</p>
                    <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 mb-10 leading-[1.1]">
                        {language === 'en' ? 'Why choose our marketplace?' : 'Pse të zgjidhni tregun tonë?'}
                    </h2>
                    <p className="text-xl text-slate-700 leading-relaxed font-medium mb-12">
                        {language === 'en' 
                            ? 'We connect you directly with verified local hosts to ensure authentic experiences and the best prices.' 
                            : 'Ne ju lidhim drejtpërdrejt me hostë lokalë të verifikuar për të siguruar përvoja autentike dhe çmimet më të mira.'}
                    </p>
                    <Link href="/services" className="inline-flex items-center gap-4 px-10 py-5 bg-brand-600 text-white rounded-full font-black text-sm hover:bg-brand-700 transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95">
                        {language === 'en' ? 'Explore All Services' : 'Eksploro të gjitha shërbimet'} <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
                
                <div className="lg:col-span-2 grid gap-8 sm:grid-cols-2">
                    {[
                        { title: language === 'en' ? 'Verified Quality' : 'Cilësi e Verifikuar', desc: language === 'en' ? 'Every listing is manually reviewed for accuracy.' : 'Çdo listim shqyrtohet manualisht për saktësi.', icon: CheckCircle },
                        { title: language === 'en' ? 'Direct Booking' : 'Rezervim Direkt', desc: language === 'en' ? 'Communicate directly with the hosts via phone or WhatsApp.' : 'Komunikoni drejtpërdrejt me hostët me telefon ose WhatsApp.', icon: Sparkles },
                        { title: language === 'en' ? 'Local Expertise' : 'Ekspertizë Lokale', desc: language === 'en' ? 'Get insider tips from people who live in the cities you visit.' : 'Merrni këshilla nga njerëzit që jetojnë në qytetet që vizitoni.', icon: Star },
                        { title: language === 'en' ? 'No Hidden Fees' : 'Pa Tarifa të Fshehura', desc: language === 'en' ? 'What you see is what you pay. Transparent pricing always.' : 'Ajo që shihni është ajo që paguani. Çmime transparente gjithmonë.', icon: Flame }
                    ].map((benefit, i) => (
                        <div key={i} className="group p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:border-brand-300 hover:bg-white transition-all duration-500 shadow-sm hover:shadow-2xl">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-brand-600 mb-8 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition duration-500 shadow-sm">
                                <benefit.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-950 mb-4">{benefit.title}</h3>
                            <p className="text-base text-slate-700 leading-relaxed font-medium">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 8. BLOG (RE-PRESENTED IN NEW FORM) - CLEAN VERSION */}
        <section className="relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 relative z-10">
            <div>
                <p className="text-xs uppercase tracking-[0.4em] font-black text-brand-700 mb-4">{t.blog.archiveTitle}</p>
                <h2 className="text-5xl sm:text-8xl font-black tracking-tight text-slate-950 leading-none">{t.blog.latestPub}</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-4 px-10 py-5 bg-brand-600 text-white rounded-full font-black text-sm hover:bg-brand-700 transition-all duration-300 shadow-2xl">
                {language === 'en' ? 'Visit Journal' : 'Vizito Revistën'} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-12 relative z-10">
            {/* Main Featured */}
            <div className="lg:col-span-12">
                <Link href={`/blog/${blogPosts[0]?.slug || "sample"}`} className="group relative block h-[500px] sm:h-[650px] overflow-hidden rounded-[4rem] shadow-2xl">
                    <Image src={blogPosts[0]?.coverImage || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"} alt="Hero Blog" fill className="object-cover transition duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
                    <div className="absolute inset-0 p-10 sm:p-20 flex flex-col justify-end text-white">
                        <div className="inline-flex items-center gap-3 rounded-full bg-brand-500 px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] mb-8 w-fit shadow-lg shadow-brand-500/30">
                            {language === 'en' ? 'Featured Story' : 'Historia e rekomanduar'}
                        </div>
                        <h3 className="text-4xl sm:text-7xl font-black mb-8 leading-[1] text-white group-hover:text-brand-100 transition duration-500">{blogPosts[0]?.title || blogFallbacks[0].title}</h3>
                        <p className="text-slate-100 text-xl mb-10 line-clamp-2 max-w-3xl leading-relaxed font-medium">
                            {blogPosts[0]?.excerpt || blogFallbacks[0].excerpt}
                        </p>
                        <span className="inline-flex items-center gap-4 text-sm font-black uppercase tracking-widest text-white border-b-2 border-brand-500 pb-2 w-fit">
                            {t.blog.readStory} <ArrowRight className="w-5 h-5" />
                        </span>
                    </div>
                </Link>
            </div>
            
            {/* Small Cards below */}
            <div className="lg:col-span-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {(blogPosts.length > 1 ? blogPosts.slice(1, 4) : blogFallbacks).map((post: any) => (
                    <Link
                        key={post._id?.toString?.() || post.slug}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col gap-6 bg-white p-5 border border-slate-100 transition-all duration-300 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 hover:border-brand-200 hover:shadow-brand-500/10"
                    >
                        <div className="relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden flex-shrink-0">
                            <Image src={post.coverImage || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"} alt={post.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                        </div>
                        <div className="flex flex-col min-w-0 px-2 pb-2">
                            <p className="text-[10px] uppercase font-black text-brand-600 tracking-[0.3em] mb-3">
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Editorial"}
                            </p>
                            <h4 className="text-xl font-black text-slate-950 line-clamp-2 group-hover:text-brand-600 transition duration-300 leading-tight mb-3">{post.title}</h4>
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium mb-6">{post.excerpt}</p>
                            <span className="mt-auto text-[11px] font-black uppercase tracking-widest text-slate-800 group-hover:text-brand-600 flex items-center gap-2 transition-colors">
                                {language === 'en' ? 'Full Story' : 'Lexo të plotë'} <ArrowRight className="w-4 h-4" />
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
