"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import ListingCard from "@/components/ListingCard";
import { ArrowLeft, Sparkles, MapPin, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SubcategoryPage() {
  const { category, subcategory } = useParams() as { category: string; subcategory: string };
  const { language } = useLanguage();
  const t = translations[language];

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/listings?category=${category}&subcategory=${subcategory}`);
        const data = await res.json();
        setListings(data.listings || []);
      } catch (error) {
        console.error("Error fetching subcategory listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, [category, subcategory]);

  const categoryName = getCategoryLabel(category);
  const subcategoryName = getSubcategoryLabel(category, subcategory);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Dynamic Hero */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <Image 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80" 
            alt={subcategoryName}
            fill
            className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
            <Link href="/services" className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-6 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-white/20 transition">
                <ArrowLeft className="w-4 h-4" />
                {language === 'en' ? 'All Services' : 'Të gjitha shërbimet'}
            </Link>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-brand-400 mb-4">{categoryName}</p>
            <h1 className="display-font text-5xl sm:text-7xl font-black tracking-tight mb-6">
                {subcategoryName}
            </h1>
            <div className="h-1.5 w-24 bg-brand-500 rounded-full" />
        </div>
      </section>

      <div className="page-shell -mt-20 relative z-20">
        {/* Results Info */}
        <div className="surface mb-8 flex flex-col justify-between gap-5 border-none p-5 shadow-2xl sm:p-8 md:mb-12 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-950">
                        {loading ? '...' : listings.length} {language === 'en' ? 'Services found' : 'Shërbime të gjetura'}
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">{language === 'en' ? 'Verified local providers' : 'Ofrues lokalë të verifikuar'}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder={language === 'en' ? 'Search in category...' : 'Kërko në kategori...'}
                        className="pl-12 pr-6 py-3 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-brand-500 text-sm font-medium w-full sm:w-64"
                    />
                </div>
            </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-white animate-pulse shadow-soft" />
                ))}
            </div>
        ) : listings.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {listings.map(listing => (
                    <ListingCard key={listing._id} listing={listing} />
                ))}
            </div>
        ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-8">
                    <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-950 mb-4">{t.common.noResults}</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-10">{language === 'en' ? 'No services currently listed in this specific subcategory.' : 'Nuk ka shërbime të listuara aktualisht në këtë nënkategori specifike.'}</p>
                <Link href="/services" className="text-sm font-black text-brand-700 hover:underline">
                    {language === 'en' ? 'Explore all categories' : 'Eksploro të gjitha kategoritë'}
                </Link>
            </div>
        )}
      </div>
    </main>
  );
}
