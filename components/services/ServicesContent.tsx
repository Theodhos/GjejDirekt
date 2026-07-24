"use client";

import Link from "next/link";
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Star } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useState, useRef } from "react";
import { useServicesData } from "@/hooks/useServicesData";
import SafeImage from "@/components/ui/SafeImage";

export default function ServicesContent() {
  const { language } = useLanguage();
  const t = translations[language];
  const { listings, featuredListings, suggestedListings, loading } = useServicesData();
  const [visibleCount, setVisibleCount] = useState(12);
  const railRef = useRef<HTMLDivElement>(null);

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const scrollRail = (dir: 'left' | 'right') => {
    if (!railRef.current) return;
    const scrollAmount = 400;
    railRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }

  return (
    <>
      {/* Horizontal Filters - Floating */}
      <section className="page-shell -mt-24 relative z-30">
        <SearchFilters />
      </section>

      {/* Featured Slider Section */}
      {!loading && featuredListings.length > 0 && (
          <section className="page-shell mt-8 sm:mt-10">
            <div className="surface p-6 sm:p-8 border-none shadow-2xl">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 mb-2">Editor&apos;s Picks</p>
                        <h2 className="text-3xl font-black text-slate-950 tracking-tight">Hand-picked Services</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => scrollRail('left')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-950 hover:text-white transition shadow-sm bg-white">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => scrollRail('right')} className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-950 hover:text-white transition shadow-sm bg-white">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <div 
                    ref={railRef}
                    className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory"
                >
                    {featuredListings.map((listing) => (
                        <Link 
                            key={listing._id} 
                            href={`/listings/${listing.slug}`}
                            className="min-w-[320px] sm:min-w-[400px] snap-start group"
                        >
                            <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden mb-4 shadow-xl">
                                <SafeImage src={listing.images?.[0]} alt={listing.title} fill className="object-cover transition duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                                <div className="absolute bottom-5 left-5 text-white">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-brand-400 mb-1">{listing.location}</p>
                                    <h3 className="text-xl font-black">{listing.title}</h3>
                                </div>
                                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
          </section>
      )}

      {/* Full Width Grid Section */}
      <section className="page-shell mt-8 sm:mt-10">
        <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-950 flex items-center justify-center text-white shadow-xl">
                <Filter className="w-7 h-7" />
            </div>
            <div>
                <h2 className="text-4xl font-black text-slate-950 tracking-tight">{t.services.results}</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                    {loading ? t.common.loading : `${listings.length} ${language === 'en' ? 'Verified Listings' : 'Listime të verifikuara'}`}
                </p>
            </div>
        </div>

        {/* Phones swipe through the results; from sm up it stays the usual grid.
            The mobile cards keep a fixed width so the next one peeks in and the
            row reads as swipeable. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 no-scrollbar sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[420px] w-[78vw] shrink-0 snap-start rounded-[2rem] bg-slate-200 animate-pulse sm:w-auto" />
            ))
          ) : listings.length > 0 ? (
            listings.slice(0, visibleCount).map((listing) => (
              <div key={listing._id} className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-auto sm:max-w-none">
                <ListingCard listing={listing} />
              </div>
            ))
          ) : (
            <div className="w-full col-span-full py-16 sm:py-20 flex flex-col items-center justify-center surface border-none shadow-2xl bg-white">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                    <Search className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-slate-500 text-2xl font-black text-center px-6">{t.common.noResults}</p>
                <p className="text-slate-400 text-base mt-3 text-center px-6 max-w-md font-medium">{language === 'en' ? 'Try adjusting your filters or search for something else.' : 'Provoni të rregulloni filtrat ose kërkoni për diçka tjetër.'}</p>
                <Link href="/services" className="mt-8 px-8 py-3.5 bg-slate-950 text-white rounded-full font-black text-sm hover:bg-brand-600 transition shadow-2xl">
                    {t.services.reset}
                </Link>
            </div>
          )}
        </div>

        {!loading && listings.length > visibleCount && (
            <div className="mt-8 flex justify-center">
                <button
                    onClick={loadMore}
                    className="group flex items-center gap-3 px-8 py-3.5 bg-slate-950 text-white rounded-full font-black text-sm hover:bg-brand-600 transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                    {language === 'en' ? 'Explore More Services' : 'Eksploro më shumë shërbime'}
                    <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition" />
                </button>
            </div>
        )}
      </section>

      {/* Suggestions — what else is close to the active filter. Same swipe row on
          phones, and it only appears when a filter left something out. */}
      {!loading && suggestedListings.length > 0 && (
        <section className="page-shell mt-8 sm:mt-10">
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 mb-1.5">
              {language === 'en' ? 'You may also like' : 'Mund t’ju pëlqejnë'}
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
              {language === 'en' ? 'Related services' : 'Shërbime të ngjashme'}
            </h2>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 no-scrollbar sm:mx-0 sm:gap-5 sm:px-0">
            {suggestedListings.map((listing) => (
              <div key={listing._id} className="w-[78vw] max-w-[320px] shrink-0 snap-start sm:w-[280px]">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
