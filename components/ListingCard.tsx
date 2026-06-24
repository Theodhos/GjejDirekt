"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, Share2, MapPin, CheckCircle, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import Card from "@/components/ui/Card";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import { translations } from "@/lib/dictionary";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ListingCard({ listing }: { listing: any }) {
  const { language } = useLanguage();
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = listing.images?.length > 0
    ? listing.images
    : (listing.photos?.length > 0
      ? listing.photos
      : (listing.bannerImage ? [listing.bannerImage] : []));
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
    const baseUrl =
      typeof window !== "undefined" && !window.location.hostname.includes("localhost")
        ? "https://www.tripshqip.com"
        : "http://localhost:3000";
    const url = `${baseUrl}/listings/${listing.slug}`;
    if (navigator.share) {
      try { await navigator.share({ url }); } catch {}
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = url;
          textarea.style.position = "fixed";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        toast.success(translations[language].listing.linkCopied);
      } catch {
        toast.error(translations[language].listing.linkCopyFailed);
      }
    }
  };

  const isVerified = listing.verified !== false;
  const t = translations[language];

  const priceSuffix =
    listing.category === "akomodim"
      ? `/${t.listing.nightSuffix}`
      : listing.category === "restorante"
      ? `/${t.listing.personSuffix}`
      : "";

  const currencySymbol =
    listing.currency === "ALL" || listing.currency === "LEK"
      ? "L"
      : listing.currency || "€";

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border transition-all duration-250" style={{ borderColor: "var(--border-soft)", borderRadius: "16px", boxShadow: "var(--shadow-card)" }}>
      {/* Image */}
      <Link
        href={`/listings/${listing.slug}`}
        className="relative aspect-[4/3] overflow-hidden block shrink-0"
        style={{ borderRadius: "16px 16px 0 0" }}
      >
        <Image
          src={imageError ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" : allImages[currentImageIndex]}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
        />

        {/* Verified Badge */}
        {isVerified && (
          <div className="absolute left-3 top-3 z-10">
            <div
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
              style={{ background: "rgba(34,153,120,0.88)" }}
            >
              <CheckCircle className="h-3 w-3" />
              {t.listing.verified}
            </div>
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-0 right-0 z-10">
          <div
            className="rounded-tl-xl px-3.5 py-1.5"
            style={{ background: "rgba(15,20,25,0.85)", backdropFilter: "blur(8px)" }}
          >
            {(() => {
              if (listing.priceFrom && listing.price) {
                if (listing.priceFrom === listing.price) {
                  return (
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-lg font-bold text-white leading-none">{currencySymbol}{listing.priceFrom}</span>
                      {priceSuffix && <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{priceSuffix}</span>}
                    </div>
                  );
                }
                return (
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-base font-bold text-white leading-none">{currencySymbol}{listing.priceFrom} – {currencySymbol}{listing.price}</span>
                    {priceSuffix && <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{priceSuffix}</span>}
                  </div>
                );
              }
              if (listing.priceFrom) {
                return (
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold text-white leading-none">{currencySymbol}{listing.priceFrom}</span>
                    {priceSuffix && <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{priceSuffix}</span>}
                  </div>
                );
              }
              if (listing.price) {
                return (
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-bold text-white leading-none">{currencySymbol}{listing.price}</span>
                    {priceSuffix && <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{priceSuffix}</span>}
                  </div>
                );
              }
              return <span className="text-xs font-semibold text-white">{t.listing.request}</span>;
            })()}
          </div>
        </div>

        {/* Image Slider */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-neutral-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:scale-110"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-neutral-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:scale-110"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2.5 left-3 flex gap-1 z-10">
              {allImages.map((_: string, idx: number) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${idx === currentImageIndex ? "w-4 bg-white" : "w-1 bg-white/60"}`}
                />
              ))}
            </div>
          </>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 py-3.5">
        {/* Title */}
        <Link href={`/listings/${listing.slug}`} className="group/link block mb-1">
          <h3
            className="text-[15px] font-semibold leading-snug transition-colors duration-150 line-clamp-2"
            style={{ color: "var(--text-primary)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "var(--brand-accent)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")}
          >
            {listing.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="mb-2.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{listing.location}{listing.country ? `, ${listing.country}` : ""}</span>
        </div>

        {/* Tags */}
        {(() => {
          const displayTags = [
            ...(listing.tags || []),
            ...(listing.amenities || [])
          ].filter((v, i, self) => self.indexOf(v) === i);

          return (
            <div className="mb-3 flex flex-wrap gap-1.5 mt-auto">
              {categoryLabel && (
                <span
                  className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    background: "var(--surface-subtle)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-soft)"
                  }}
                >
                  <Tag className="h-2.5 w-2.5" />
                  {categoryLabel}
                </span>
              )}
              {displayTags.slice(0, 2).map((tag: string, index: number) => (
                <span
                  key={index}
                  className="flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                  style={{
                    background: "rgba(34,153,120,0.08)",
                    color: "var(--brand-accent)",
                    border: "1px solid rgba(34,153,120,0.15)"
                  }}
                >
                  {tag}
                </span>
              ))}
              {displayTags.length > 2 && (
                <span
                  className="flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: "var(--surface-subtle)", color: "var(--text-tertiary)" }}
                >
                  +{displayTags.length - 2}
                </span>
              )}
            </div>
          );
        })()}

        {/* Contact Actions */}
        <div
          className="grid grid-cols-3 gap-1 rounded-xl p-1.5"
          style={{
            background: "var(--surface-cream)",
            border: "1px solid var(--border-soft)"
          }}
        >
          {/* Call */}
          <a
            href={phone ? `tel:${phone}` : "#"}
            onClick={(e) => { e.stopPropagation(); if (!phone) e.preventDefault(); }}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 transition-colors ${phone ? "" : "opacity-40 cursor-not-allowed"}`}
            onMouseEnter={e => phone && ((e.currentTarget as HTMLElement).style.background = "var(--surface-white)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: "#3b82f6" }}
            >
              <Phone className="h-3.5 w-3.5 fill-current" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{t.listing.call}</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappHref || "#"}
            target={whatsappHref ? "_blank" : undefined}
            rel="noreferrer"
            onClick={(e) => { e.stopPropagation(); if (!whatsappHref) e.preventDefault(); }}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg py-2 transition-colors ${whatsappHref ? "" : "opacity-40 cursor-not-allowed"}`}
            onMouseEnter={e => whatsappHref && ((e.currentTarget as HTMLElement).style.background = "var(--surface-white)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: "#25D366" }}
            >
              <MessageCircle className="h-4 w-4 fill-current" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "#16a34a" }}>{t.listing.whatsapp}</span>
          </a>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-1 rounded-lg py-2 transition-colors"
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--surface-white)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: "#6366f1" }}
            >
              <Share2 className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{t.listing.share}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
