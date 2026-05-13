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

  const image = listing.bannerImage || listing.images?.[0] || listing.photos?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";
  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);
  const phone = listing.contactInfo?.phone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappHref = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello, I am interested in ${listing.title}.`)}`
    : "";

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-[2rem] border-2 border-transparent bg-white shadow-soft transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-brand-500/30 hover:shadow-2xl hover:shadow-brand-500/10">
      {/* Absolute Link for entire card */}
      <Link href={`/listings/${listing.slug}`} className="absolute inset-0 z-0" aria-label={`View ${listing.title}`} />

      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden pointer-events-none">
        <Image 
            src={image} 
            alt={listing.title} 
            fill 
            className="object-cover transition duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute left-4 top-4 flex flex-wrap gap-2 z-10">
          {listing.featured && (
            <div className="flex items-center gap-1 rounded-full bg-brand-500 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
              <Sparkles className="h-2.5 w-2.5" />
              {language === 'en' ? 'Featured' : 'E rekomanduar'}
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white">
            {categoryLabel}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2 py-1 text-[9px] font-black text-slate-950">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-current" />
            {Number(listing.ratingAverage || 0).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-grow flex-col p-5 relative z-10 pointer-events-none">
        <div className="mb-2">
            <h3 className="block text-xl font-black leading-tight text-slate-950 group-hover:text-brand-700 transition line-clamp-1">
              {listing.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <MapPin className="h-3 w-3 text-brand-500 shrink-0" />
                <span className="truncate">{listing.location}{listing.country ? `, ${listing.country}` : ""}</span>
            </div>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 mb-4 flex-grow font-medium">
            {listing.description}
        </p>

        {phone && (
          <div className="mb-4 flex items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-100 transition-colors pointer-events-auto">
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contact</span>
              <span className="text-xs font-black text-slate-950 truncate">{phone}</span>
            </div>
            <div className="flex gap-1.5 shrink-0 relative z-20">
                {whatsappHref && (
                    <a href={whatsappHref} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:scale-110 transition shadow-md">
                        <MessageCircle className="w-4 h-4" />
                    </a>
                )}
                <a href={`tel:${phone}`} className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-white hover:scale-110 transition shadow-md">
                    <Phone className="w-4 h-4" />
                </a>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-sm font-black text-slate-950">
            {listing.priceFrom ? (
              <>
                <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">From</span>
                {listing.currency || "EUR"} {listing.priceFrom}
              </>
            ) : (
              <span className="text-[10px] text-slate-400 font-bold uppercase">Price on request</span>
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-950 hover:text-brand-700 transition group-hover:gap-3">
            {language === 'en' ? 'Details' : 'Detaje'}
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Card>
  );
}
