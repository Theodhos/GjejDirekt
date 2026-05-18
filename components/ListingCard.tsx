"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, Share2, MapPin, CheckCircle, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import Card from "@/components/ui/Card";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListingCard({ listing }: { listing: any }) {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = listing.images?.length > 0 ? listing.images : (listing.photos?.length > 0 ? listing.photos : (listing.bannerImage ? [listing.bannerImage] : []));
  if (allImages.length === 0) {
    allImages.push("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80");
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const categoryLabel = getCategoryLabel(listing.category);
  const subcategoryLabel = getSubcategoryLabel(listing.category, listing.subcategory);
  const phone = listing.contactInfo?.phone || listing.contactPhone || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappHref = phoneDigits
    ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(`Hello, I am interested in ${listing.title}.`)}`
    : "";

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const baseUrl = typeof window !== "undefined" && !window.location.hostname.includes("localhost")
      ? "https://www.tripshqip.com"
      : "http://localhost:3000";
    const url = `${baseUrl}/listings/${listing.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          url: url,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          // Fallback for older/unsupported browsers
          const textarea = document.createElement("textarea");
          textarea.value = url;
          textarea.style.position = "fixed";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        toast.success(language === 'en' ? 'Link copied to clipboard!' : 'Linku u kopjua!');
      } catch (err) {
        toast.error(language === 'en' ? 'Failed to copy link' : 'Dështoi kopjimi i linkut');
      }
    }
  };


  const isVerified = listing.verified !== false; // Assuming true by default if not set, or you can check a specific property

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-500/10 border border-slate-200">
      {/* Image Section */}
      <Link href={`/listings/${listing.slug}`} className="relative aspect-[4/3] overflow-hidden block shrink-0 rounded-t-3xl">
        <Image 
          src={imageError ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" : allImages[currentImageIndex]}
          alt={listing.title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105" 
          onError={() => setImageError(true)}
        />
        
        {/* Verified Badge - Top Left */}
        {isVerified && (
          <div className="absolute left-3 top-3 z-10">
            <div className="flex items-center gap-1 rounded-lg bg-[#22c55e] px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
              <CheckCircle className="h-3.5 w-3.5" />
              VERIFIED
            </div>
          </div>
        )}

        {/* Price Overlay - Bottom Right (Image 2 style) */}
        <div className="absolute bottom-0 right-0 z-10">
          <div className="rounded-tl-2xl bg-[#0f2e3c] px-4 py-2 text-white shadow-lg">
            {listing.priceFrom ? (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black leading-none">{listing.currency === 'ALL' ? 'L' : '€'}{listing.priceFrom}</span>
                <span className="text-xs font-bold text-slate-300">/{language === 'en' ? 'night' : 'natë'}</span>
              </div>
            ) : (
              <span className="text-sm font-bold">{language === 'en' ? 'Request' : 'Kërkesë'}</span>
            )}
          </div>
        </div>

        {/* Image Slider Controls */}
        {allImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-sm backdrop-blur-sm transition hover:bg-white hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-sm backdrop-blur-sm transition hover:bg-white hover:scale-110"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-3 flex gap-1.5 z-10">
              {allImages.map((_: string, idx: number) => (
                <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/80"}`} />
              ))}
            </div>
          </>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <div className="mb-2">
          <Link href={`/listings/${listing.slug}`} className="group/link block">
            <h3 className="text-[17px] font-black leading-tight text-slate-900 transition group-hover/link:text-brand-600 line-clamp-2">
              {listing.title}
            </h3>
          </Link>
        </div>

        {/* Location */}
        <div className="mb-4 flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{listing.location}{listing.country ? `, ${listing.country}` : ""}</span>
        </div>

        {/* Tags */}
        {(() => {
          const displayTags = [
            ...(listing.tags || []),
            ...(listing.amenities || [])
          ].filter((value, index, self) => self.indexOf(value) === index);
          
          return (
            <div className="mb-4 flex flex-wrap gap-1.5 mt-auto">
              {categoryLabel && (
                <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  <Tag className="h-3 w-3" />
                  {categoryLabel}
                </span>
              )}
              {displayTags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded-md bg-[#e8fbf0] text-[#15803d] border border-[#bbf7d0] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
              {displayTags.length > 2 && (
                <span className="flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                  +{displayTags.length - 2}
                </span>
              )}
            </div>
          );
        })()}

        {/* Contact Section / Bottom Actions */}
        <div className="mt-2 grid grid-cols-3 gap-2 rounded-[1.25rem] bg-[#f8fafc] border border-slate-100 p-2">
          {/* Call */}
          <a
            href={phone ? `tel:${phone}` : "#"}
            onClick={(e) => { e.stopPropagation(); if(!phone) e.preventDefault(); }}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition ${phone ? 'hover:bg-slate-200' : 'opacity-50 cursor-not-allowed'}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-sm transition-transform hover:scale-105">
              <Phone className="h-4 w-4 fill-current" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{language === 'en' ? 'Call' : 'Telefon'}</span>
          </a>
          
          {/* WhatsApp */}
          <a
            href={whatsappHref || "#"}
            target={whatsappHref ? "_blank" : undefined}
            rel="noreferrer"
            onClick={(e) => { e.stopPropagation(); if(!whatsappHref) e.preventDefault(); }}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition ${whatsappHref ? 'hover:bg-slate-200' : 'opacity-50 cursor-not-allowed'}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform hover:scale-105">
              <MessageCircle className="h-5 w-5 fill-current" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#16a34a]">{language === 'en' ? 'WhatsApp' : 'WhatsApp'}</span>
          </a>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition hover:bg-slate-200"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ef4444] text-white shadow-sm transition-transform hover:scale-105">
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{language === 'en' ? 'Share' : 'Shpërnda'}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
