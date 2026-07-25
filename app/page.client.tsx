"use client";

import { useEffect, useState, useRef } from "react";
import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, MapPin, Sparkles, ChevronLeft, ChevronRight, CheckCircle, Flame, Star, Bed, Utensils, Car, Plane, Anchor, Truck, Calendar, Music, Ticket, ShoppingBag, Camera, Phone, Wallet } from "lucide-react";
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
      <div className="page-shell space-y-7 py-6 sm:space-y-9 sm:py-10">
        
        {/* 1. POPULAR DESTINATIONS (CITIES) - Logical First Step */}
        <HorizontalRail title={t.home.popularDestinations}>
          {dynamicCities.map((city) => (
            <Link
              key={city.value}
              href={`/city/${city.value}`}
              className="travel-card group min-w-[260px] overflow-hidden transition-all duration-250 hover:-translate-y-1" 
            >
              <div className="relative aspect-[16/10] overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
                <SafeImage src={city.image} fallbackSrc="https://images.unsplash.com/photo-1512917774080-9991f1c4c750" alt={city.label} fill className="object-cover transition duration-500 group-hover:scale-105" />
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
            >
              {showFallback ? (
                section.category?.subcategories.map((sub) => (
                  <Link
                    key={sub.value}
                    href={`/categories/${section.category?.value}/${sub.value}`}
                    className="travel-card min-w-[300px] max-w-[300px] shrink-0 snap-start group relative overflow-hidden transition hover:-translate-y-1"
                  >
                    <SafeImage
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
                  <div key={listing._id} className="min-w-[280px] max-w-[280px] shrink-0 snap-start">
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
            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <p className="eyebrow mb-4">{language === 'en' ? 'The Advantage' : 'Avantazhi'}</p>
                    <h2
                      className="font-bold tracking-tight mb-5"
                      style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.25rem)", color: "var(--text-primary)", lineHeight: 1.15 }}
                    >
                        {language === 'en' ? 'Why use TripShqip?' : 'Pse të përdorni TripShqip?'}
                    </h2>
                    <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                        {language === 'en'
                            ? 'Find tourism businesses in Albania, contact them directly by phone or WhatsApp, and book with zero commission.'
                            : 'Gjeni bizneset turistike në Shqipëri, kontaktoni direkt me telefon ose WhatsApp dhe rezervoni pa komision.'}
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
                        { title: language === 'en' ? 'Direct Contact' : 'Kontakt Direkt', desc: language === 'en' ? 'Phone, WhatsApp or Book Now — no middlemen.' : 'Telefon, WhatsApp ose Book Now pa ndërmjetës.', icon: Phone },
                        { title: language === 'en' ? '0% Commission' : '0% Komision', desc: language === 'en' ? 'Get the price directly from the business.' : 'Merrni çmimin direkt nga biznesi.', icon: Wallet },
                        { title: language === 'en' ? 'Verified Businesses' : 'Biznese të Verifikuara', desc: language === 'en' ? 'The Verified badge builds trust and safety.' : 'Badge Verified rrit besimin dhe sigurinë.', icon: CheckCircle },
                        { title: language === 'en' ? 'Everything in one place' : 'Gjithçka në një vend', desc: language === 'en' ? 'Hotels, restaurants, attractions and activities.' : 'Hotele, restorante, atraksione dhe aktivitete.', icon: MapPin }
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

        {/* 8. BLOG (RE-PRESENTED AS SLIDER) */}
        <HorizontalRail
          eyebrow={t.blog.archiveTitle}
          title={t.blog.latestPub}
          actionButton={
            <Link
              href="/blog"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 shrink-0"
              style={{ background: "var(--brand-accent)", boxShadow: "0 2px 12px rgba(34,153,120,0.22)" }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-hover)")}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "var(--brand-accent)")}>
                {language === 'en' ? 'View all articles' : 'Shiko të gjitha artikujt'} <ArrowRight className="w-4 h-4" />
            </Link>
          }
        >
          {/* The card wrapper must NOT set a height: an explicit height on a flex item
              opts it out of the rail's items-stretch, so cards ended up sized to their
              own text. Letting it stretch keeps every card the same height. */}
          {(blogPosts.length > 0 ? blogPosts : blogFallbacks).map((post: any) => (
            <div key={post._id?.toString?.() || post.slug} className="min-w-[320px] max-w-[320px] shrink-0 snap-start">
              <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col transition-all duration-250 hover:-translate-y-1"
                  style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", borderRadius: "16px", boxShadow: "var(--shadow-card)", overflow: "hidden" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,153,120,0.2)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-card)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-soft)"; }}
              >
                  <div className="relative w-full aspect-[16/9] overflow-hidden flex-shrink-0">
                      <SafeImage src={post.coverImage} fallbackSrc="https://images.unsplash.com/photo-1507525428034-b723cf961d3e" alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-103" />
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
            </div>
          ))}
        </HorizontalRail>
      </div>
      )}
    </main>
  );
}

export default HomePageClient;
