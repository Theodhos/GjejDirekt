"use client";

import Link from "next/link";
import { Sparkles, MapPin, Search, Filter, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Star } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ServicesPage() {
  const { language } = useLanguage();
  const t = translations[language];
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<any[]>([]);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams(searchParams?.toString());
            const res = await fetch(`/api/listings?${query.toString()}`);
            const data = await res.json();
            setListings(data.listings || []);
            setFeaturedListings((data.listings || []).filter((l: any) => l.featured).slice(0, 8));
            setVisibleCount(12); // Reset visible count on filter change
        } catch (error) {
            console.error("Error loading services:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [searchParams]);

  const loadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  const scrollRail = (dir: 'left' | 'right') => {
    if (!railRef.current) return;
    const scrollAmount = 400;
    railRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-32">
      {/* Premium Header */}
      <section className="bg-slate-950 pt-20 pb-40 sm:pt-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />
        <div className="page-shell relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 border border-brand-500/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                {t.services.subtitle}
            </div>
            <h1 className="display-font text-6xl sm:text-8xl font-black text-white leading-[0.95] tracking-tighter">
                {t.services.title}
            </h1>
            <p className="mt-8 text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
                {language === 'en' 
                    ? 'Explore thousands of verified services across Albania. From luxury stays to local street food, find everything you need.' 
                    : 'Eksploroni mijëra shërbime të verifikuara në të gjithë Shqipërinë. Nga qëndrimet luksoze te ushqimi lokal i rrugës, gjeni gjithçka që ju nevojitet.'}
            </p>
          </div>
        </div>
      </section>

      {/* Horizontal Filters - Floating */}
      <section className="page-shell -mt-24 relative z-30">
        <SearchFilters />
      </section>

      {/* Featured Slider Section */}
      {!loading && featuredListings.length > 0 && (
          <section className="page-shell mt-20">
            <div className="surface p-8 sm:p-12 border-none shadow-2xl">
                <div className="flex items-center justify-between gap-6 mb-10">
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
                                <Image src={listing.images?.[0] || ""} alt={listing.title} fill className="object-cover transition duration-700 group-hover:scale-110" />
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
      <section className="page-shell mt-20">
        <div className="flex items-center gap-6 mb-12">
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[450px] rounded-[3rem] bg-slate-200 animate-pulse" />
            ))
          ) : listings.length > 0 ? (
            listings.slice(0, visibleCount).map((listing) => <ListingCard key={listing._id} listing={listing} />)
          ) : (
            <div className="col-span-full py-40 flex flex-col items-center justify-center surface border-none shadow-2xl bg-white">
                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100">
                    <Search className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-slate-500 text-2xl font-black text-center px-6">{t.common.noResults}</p>
                <p className="text-slate-400 text-base mt-3 text-center px-6 max-w-md font-medium">{language === 'en' ? 'Try adjusting your filters or search for something else.' : 'Provoni të rregulloni filtrat ose kërkoni për diçka tjetër.'}</p>
                <Link href="/services" className="mt-12 px-12 py-5 bg-slate-950 text-white rounded-full font-black text-sm hover:bg-brand-600 transition shadow-2xl">
                    {t.services.reset}
                </Link>
            </div>
          )}
        </div>

        {!loading && listings.length > visibleCount && (
            <div className="mt-24 flex justify-center">
                <button 
                    onClick={loadMore}
                    className="group flex items-center gap-6 px-20 py-7 bg-slate-950 text-white rounded-full font-black text-sm hover:bg-brand-600 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95"
                >
                    {language === 'en' ? 'Explore More Services' : 'Eksploro më shumë shërbime'}
                    <ChevronDown className="w-6 h-6 group-hover:translate-y-2 transition" />
                </button>
            </div>
        )}
      </section>
      
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}
