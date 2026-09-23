"use client";

import Link from "next/link";
import { BadgeCheck, MapPin, Heart } from "lucide-react";
import toast from "react-hot-toast";
import SafeImage from "@/components/ui/SafeImage";
import { getCategoryLabel, getListingActions } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";
import useFavorites from "@/hooks/useFavorites";

/** First usable photo on a listing, whichever field it happens to live in. */
export function listingCover(listing: any): string | undefined {
  return (
    listing?.images?.[0] ||
    listing?.photos?.[0] ||
    listing?.bannerImage ||
    listing?.coverImage ||
    undefined
  );
}

/**
 * Compact business card for the home rails and any grid that follows them:
 * photo, VERIFIED ribbon, name, category, city. Deliberately smaller than the
 * full ListingCard — these rows are for scanning, not for acting.
 */
export default function BusinessCard({ listing, className = "" }: { listing: any; className?: string }) {
  const { language } = useLanguage();
  const categoryLabel = getCategoryLabel(listing.category);
  const actions = getListingActions(listing);
  const listingId = listing._id || listing.id;
  const { isFavorited, refresh } = useFavorites();
  const favorited = isFavorited(listingId);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId })
      });
      const data = await response.json();

      if (response.status === 401) {
        toast.error(language === "en" ? "You must be logged in to save favorites!" : "Duhet të identifikoheni për të shtuar në të preferuarat!");
        return;
      }

      if (!response.ok) {
        toast.error(data.error || "Could not update favorites");
        return;
      }

      await refresh();
      toast.success(
        data.favorited
          ? (language === "en" ? "Saved to favorites" : "U ruajt te të preferuarat")
          : (language === "en" ? "Removed from favorites" : "U hoq nga të preferuarat")
      );
    } catch (error) {
      toast.error("Network error");
    }
  };

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className={`gd-card group flex flex-col ${className}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <SafeImage
          src={listingCover(listing)}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1280px) 24vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* VERIFIED badge — blue pill top-left exactly like the mockup */}
        {listing.verified && (
          <span
            className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white"
            style={{ background: "var(--verified-blue)" }}
          >
            <BadgeCheck className="h-3 w-3" />
            Verified
          </span>
        )}

        {/* Heart favourite button — top-right corner */}
        <button
          onClick={toggleFavorite}
          className="absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50 active:scale-95"
          aria-label="Toggle favorite"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${favorited ? "fill-[var(--brand-accent)] text-[var(--brand-accent)]" : "text-white"}`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3
          className="line-clamp-1 text-[14.5px] font-bold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {listing.title}
        </h3>
        <p className="line-clamp-1 text-[12.5px]" style={{ color: "var(--text-tertiary)" }}>
          {categoryLabel}
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "#F5A524" }}>★</span>{Number(listing.ratingAverage || 0).toFixed(1)} <span className="font-normal" style={{ color: "var(--text-tertiary)" }}>({listing.reviewCount || 0})</span>
          </span>
          <span className="rounded-full px-2.5 py-1 text-[10.5px] font-bold" style={{ background: actions.includes("rezervim") ? "#FFF7ED" : "var(--brand-light)", color: actions.includes("rezervim") ? "#C2410C" : "var(--brand-accent)" }}>
            {actions.includes("rezervim") ? "Rezervim" : "Porosi"}
          </span>
        </div>
        <p
          className="mt-auto flex items-center gap-1 pt-1.5 text-[12px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{listing.location}</span>
        </p>
      </div>
    </Link>
  );
}
