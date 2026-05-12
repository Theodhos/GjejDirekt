"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, MapPin, Phone, Star, Heart, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";

export default function ListingCard({ listing }: { listing: any }) {
  const { language } = useLanguage();
  const t = translations[language];

  const image = listing.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);
  const phone = listing.contactInfo?.phone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappHref = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello, I am interested in ${listing.title}.`)}`
    : "";

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border-none bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image 
            src={image} 
            alt={listing.title} 
            fill 
            className="object-cover transition duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute left-5 top-5 flex flex-wrap gap-2 z-10">
          {listing.featured && (
            <div className="flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              <Sparkles className="h-3 w-3" />
              {language === 'en' ? 'Featured' : 'E rekomanduar'}
            </div>
          )}
          {listing.priceFrom && (
            <div className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-lg">
              {listing.currency || "EUR"} {listing.priceFrom}+
            </div>
          )}
        </div>

        <button className="absolute right-5 top-5 h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition hover:bg-white hover:text-red-500 z-10">
            <Heart className="w-5 h-5" />
        </button>

        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between z-10">
          <div className="rounded-full bg-brand-600/90 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
            {categoryLabel}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1.5 text-[10px] font-black text-white">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            {Number(listing.ratingAverage || 0).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-6">
        <div className="mb-4">
            <Link href={`/listings/${listing.slug}`} className="block text-2xl font-black leading-tight text-slate-950 group-hover:text-brand-700 transition">
              {listing.title}
            </Link>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <MapPin className="h-3.5 w-3.5 text-brand-500" />
                <span className="truncate">
                    {listing.location}{listing.country ? `, ${listing.country}` : ""}
                </span>
            </div>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500 mb-6 flex-grow">
            {listing.description}
        </p>

        {phone && (
          <div className="mb-6 rounded-[1.8rem] bg-emerald-50/50 p-5 border border-emerald-100/50 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700/60 mb-3">{language === 'en' ? 'Quick Contact' : 'Kontakt i Shpejtë'}</p>
            <div className="flex items-center justify-between gap-4">
                <a href={`tel:${phone}`} className="text-base font-black text-slate-950 hover:text-emerald-700 transition flex items-center gap-2 truncate">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    {phone}
                </a>
                <div className="flex gap-2 shrink-0">
                    {whatsappHref && (
                        <a href={whatsappHref} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-lg shadow-emerald-500/20">
                            <MessageCircle className="w-5 h-5" />
                        </a>
                    )}
                    <a href={`tel:${phone}`} className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition shadow-lg shadow-slate-900/20">
                        <Phone className="w-5 h-5" />
                    </a>
                </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                        <Image src={`https://i.pravatar.cc/50?u=${listing._id}${i}`} alt="User" fill className="object-cover" />
                    </div>
                ))}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {listing.reviewCount || 0} {language === 'en' ? 'Reviews' : 'Vlerësime'}
            </span>
          </div>
          <Link href={`/listings/${listing.slug}`} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-950 hover:text-brand-700 transition group-hover:gap-4">
            {language === 'en' ? 'Details' : 'Detaje'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
