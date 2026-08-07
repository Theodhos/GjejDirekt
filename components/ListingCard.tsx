"use client";

import Link from "next/link";
import { MessageCircle, Phone, MapPin, Share2, CheckCircle, ChevronLeft, ChevronRight, Tag, Crown } from "lucide-react";
import Card from "@/components/ui/Card";
import SafeImage from "@/components/ui/SafeImage";
import { FALLBACK_IMAGE } from "@/lib/images";
import { getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import { PRICE_CURRENCY, fromPriceShort, startingPrice } from "@/lib/pricing";
import { translations } from "@/lib/dictionary";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useRef, useLayoutEffect } from "react";
import toast from "react-hot-toast";

const TAG_GAP = 4;

function tagChipStyle(kind: "cat" | "tag"): React.CSSProperties {
  return kind === "cat"
    ? { background: "var(--surface-subtle)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)" }
    : { background: "var(--brand-light)", color: "var(--brand-accent)", border: "1px solid var(--brand-border)" };
}

/**
 * Single-line tag row. A hidden measurement row (always holding every chip) gives
 * stable widths; a layout effect picks how many chips fit and folds the rest into a
 * "+N" pill — so a chip is never sliced mid-word. Refits on container resize.
 */
function CardTags({ category, tags }: { category?: string; tags: string[] }) {
  const viewRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  const items: { kind: "cat" | "tag"; label: string }[] = [
    ...(category ? [{ kind: "cat" as const, label: category }] : []),
    ...tags.map((t) => ({ kind: "tag" as const, label: t }))
  ];
  const total = items.length;
  const key = `${category || ""}|${tags.join("|")}`;

  useLayoutEffect(() => {
    const view = viewRef.current;
    const measure = measureRef.current;
    if (!view || !measure) return;

    const compute = () => {
      const max = view.clientWidth;
      if (max === 0) return;
      const widths = Array.from(measure.querySelectorAll<HTMLElement>("[data-mchip]")).map((e) => e.offsetWidth);
      if (widths.length === 0) return;
      const plusEl = measure.querySelector<HTMLElement>("[data-mplus]");
      const plusW = plusEl ? plusEl.offsetWidth : 32;
      const widthUpTo = (count: number, reservePlus: boolean) => {
        let w = 0;
        for (let i = 0; i < count; i++) w += widths[i] + (i > 0 ? TAG_GAP : 0);
        if (reservePlus) w += TAG_GAP + plusW;
        return w;
      };
      let n = widths.length;
      if (widthUpTo(n, false) > max) {
        while (n > 1 && widthUpTo(n, true) > max) n--;
      }
      setVisibleCount(n);
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(view);
    return () => ro.disconnect();
  }, [key]);

  if (total === 0) return <div className="mb-3 h-[22px]" />;

  const hiddenCount = total - visibleCount;

  const Chip = ({ it, attr }: { it: { kind: "cat" | "tag"; label: string }; attr?: Record<string, string> }) => (
    <span
      {...attr}
      className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
      style={tagChipStyle(it.kind)}
    >
      {it.kind === "cat" && <Tag className="h-2.5 w-2.5" />}
      {it.label}
    </span>
  );

  const Plus = ({ n, attr }: { n: number; attr?: Record<string, string> }) => (
    <span
      {...attr}
      className="flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: "var(--surface-subtle)", color: "var(--text-tertiary)" }}
    >
      +{n}
    </span>
  );

  return (
    <div className="relative mb-3 h-[22px]">
      {/* Visible row */}
      <div ref={viewRef} className="flex h-[22px] flex-nowrap items-center gap-1 overflow-hidden">
        {items.slice(0, visibleCount).map((it, i) => (
          <Chip key={`v-${it.kind}-${i}`} it={it} />
        ))}
        {hiddenCount > 0 && <Plus n={hiddenCount} />}
      </div>
      {/* Hidden measurement row — always holds every chip so widths stay available */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 flex flex-nowrap items-center gap-1"
        style={{ visibility: "hidden" }}
      >
        {items.map((it, i) => (
          <Chip key={`m-${it.kind}-${i}`} it={it} attr={{ "data-mchip": "" }} />
        ))}
        <Plus n={total} attr={{ "data-mplus": "" }} />
      </div>
    </div>
  );
}

export default function ListingCard({ listing }: { listing: any }) {
  const { language } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = listing.images?.length > 0
    ? listing.images
    : (listing.photos?.length > 0
      ? listing.photos
      : (listing.bannerImage ? [listing.bannerImage] : []));
  if (allImages.length === 0) {
    allImages.push(FALLBACK_IMAGE);
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

  const isVerified = listing.verified === true;
  const t = translations[language];

  // Verified remains visible even when Ads or Ads Pro is also assigned.
  const showVerifiedBadge = isVerified;
  // Ads only affects ranking. The visual border is reserved for Ads Pro.
  const isAdsProPackage = listing.package === "features";

  // Prices are always announced as a starting price in euro.
  const priceValue = startingPrice(listing);

  return (
    <Card 
      className={`travel-card group relative flex h-full flex-col transition-all duration-300 ${
        listing.package === "features" ? "z-10" : "hover:shadow-lg"
      }`}
      style={isAdsProPackage ? {
        border: "3px solid transparent",
        backgroundImage: "linear-gradient(var(--surface-white), var(--surface-white)), linear-gradient(135deg, var(--brand-accent) 0%, #2aa889 50%, #176b59 100%)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        boxShadow: "0 12px 35px rgba(31, 138, 112, 0.28)",
        ...(listing.package === "features" ? { transform: "translateY(-4px)" } : {})
      } : undefined}
    >
      {/* Whole-card link overlay → navigates to the listing. Interactive controls sit above it (z-20). */}
      <Link
        href={`/listings/${listing.slug}`}
        aria-label={listing.title}
        className="absolute inset-0 z-10"
      />

      {/* Image */}
      <div
        className="relative aspect-[4/3] overflow-hidden block shrink-0"
        style={{ borderRadius: "16px 16px 0 0" }}
      >
        <SafeImage
          src={allImages[currentImageIndex]}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Package Badge — Verified */}
        {showVerifiedBadge && (
          <div className="pointer-events-none absolute left-3 top-3 z-20">
            <div
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
              style={{ background: "rgba(22,163,74,0.92)" }}
            >
              <CheckCircle className="h-3 w-3" />
              {t.listing.verified}
            </div>
          </div>
        )}



        {/* Price Badge */}
        <div className="pointer-events-none absolute bottom-0 right-0 z-20">
          <div
            className="rounded-tl-xl px-3.5 py-1.5"
            style={{ background: "rgba(15,20,25,0.85)", backdropFilter: "blur(8px)" }}
          >
            {priceValue !== null ? (
              <div className="flex items-baseline gap-1">
                <span className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {fromPriceShort(language)}
                </span>
                <span className="text-lg font-bold text-white leading-none">
                  {PRICE_CURRENCY}
                  {priceValue}
                </span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-white">{t.listing.request}</span>
            )}
          </div>
        </div>

        {/* Image Slider */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-neutral-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:scale-110"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-neutral-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:scale-110"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2.5 left-3 flex gap-2 z-10">
              {allImages.map((_: string, idx: number) => (
                <div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? "w-6 bg-white" : "w-2 bg-white/70"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col px-4 pb-2.5 pt-2.5">
        {/* Title — capped at 2 lines; no reserved height so short titles sit tight */}
        <h3
          className="mb-0.5 line-clamp-2 text-[15px] font-semibold leading-snug transition-colors duration-150 group-hover:text-brand-600"
          style={{ color: "var(--text-primary)" }}
        >
          {listing.title}
        </h3>

        {/* Location */}
        <div className="mb-1.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-tertiary)" }}>
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{listing.location}{listing.country ? `, ${listing.country}` : ""}</span>
        </div>

        {/* Tags — single fixed-height row; overflow collapses into a clean "+N" (never clips a chip) */}
        <CardTags
          category={categoryLabel}
          tags={[
            ...(listing.tags || []),
            ...(listing.amenities || [])
          ].filter((v, i, self) => v && self.indexOf(v) === i)}
        />

        {/* Contact Actions — flat brand-green icons, pinned to bottom, sit above the card link overlay */}
        <div className="relative z-20 mt-auto grid grid-cols-3 gap-1.5 pt-0.5">
          {/* Call */}
          <a
            href={phone ? `tel:${phone}` : "#"}
            onClick={(e) => {
              e.stopPropagation();
              if (!phone) { e.preventDefault(); return; }
              if (listing._id) {
                fetch(`/api/listings/${listing._id}/phone-click`, { method: "POST", keepalive: true }).catch(() => {});
              }
            }}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg py-1 ${phone ? "" : "pointer-events-none opacity-40"}`}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: "var(--brand-accent)" }}
            >
              <Phone className="h-4 w-4 fill-current" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{t.listing.call}</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappHref || "#"}
            target={whatsappHref ? "_blank" : undefined}
            rel="noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              if (!whatsappHref) { e.preventDefault(); return; }
              if (listing._id) {
                fetch(`/api/listings/${listing._id}/whatsapp-click`, { method: "POST", keepalive: true }).catch(() => {});
              }
            }}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg py-1 ${whatsappHref ? "" : "pointer-events-none opacity-40"}`}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: "var(--brand-accent)" }}
            >
              <MessageCircle className="h-4 w-4 fill-current" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{t.listing.whatsapp}</span>
          </a>

          {/* Share */}
          <button
            type="button"
            onClick={async (e) => {
              e.stopPropagation();
              e.preventDefault();
              const url = `${window.location.origin}/listings/${listing.slug}`;
              if (navigator.share) {
                try {
                  await navigator.share({ title: listing.title, url });
                } catch {
                  // user cancelled the share sheet — ignore
                }
              } else {
                try {
                  await navigator.clipboard.writeText(url);
                  toast.success(language === "en" ? "Link copied" : "Linku u kopjua");
                } catch {
                  toast.error(language === "en" ? "Could not copy link" : "Linku nuk u kopjua");
                }
              }
            }}
            className="flex flex-col items-center justify-center gap-1 rounded-lg py-1"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105"
              style={{ background: "var(--brand-accent)" }}
            >
              <Share2 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>{t.listing.share}</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
