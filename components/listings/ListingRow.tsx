"use client";

import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import OpenStatusLine from "@/components/listings/OpenStatusLine";
import { listingCover } from "@/components/home/BusinessCard";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryByValue, getCategoryLabel, getSubcategoryLabel } from "@/lib/constants";
import { isFoodListing, foodTypeParts } from "@/lib/food";
import { listingAddress, parseHours } from "@/lib/listing-display";
import { formatPrice, fromPriceShort, startingPrice } from "@/lib/pricing";

/**
 * One result in a listing directory: photo with the VERIFIED tag on the left, then
 * name, what kind of business it is, rating, address and — where the owner gave
 * opening hours — whether it is open right now (otherwise the starting price).
 * Full-width rows on a phone; bordered cards from `lg` up, where they sit two to
 * a line.
 *
 * `showCategory` puts the category in front of the type ("Hotele & Akomodim · Vila")
 * for lists that mix categories.
 */
export default function ListingRow({
  listing,
  priority = false,
  showCategory = false
}: {
  listing: any;
  priority?: boolean;
  showCategory?: boolean;
}) {
  const { language, t } = useLanguage();
  const en = language === "en";

  const category = getCategoryByValue(listing.category);
  const categoryValue = category?.value || String(listing.category || "");
  const names = t.categories.names as Record<string, string>;
  const subLabels = (t.categories.subnames as Record<string, Record<string, string>>)[categoryValue] || {};
  const subcategoryLabel = subLabels[listing.subcategory] || getSubcategoryLabel(categoryValue, listing.subcategory) || "";

  const typeParts = isFoodListing(listing)
    ? foodTypeParts(listing, subcategoryLabel, language)
    : [subcategoryLabel];
  if (showCategory) typeParts.unshift(names[categoryValue] || getCategoryLabel(categoryValue));
  const typeLine = typeParts.filter(Boolean).join(" · ");

  const reviews = Number(listing.reviewCount || 0);
  const rating = Number(listing.ratingAverage || 0);
  const address = listingAddress(listing);
  const price = startingPrice(listing);
  const hasHours = Boolean(parseHours(listing.businessHours));

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group flex items-stretch gap-3.5 border-b px-4 py-3.5 transition-colors active:bg-neutral-50 lg:rounded-2xl lg:border lg:bg-white lg:p-3 lg:hover:shadow-[var(--shadow-hover)]"
      style={{ borderColor: "var(--border-soft)" }}
    >
      <div
        className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl sm:h-[124px] sm:w-[124px]"
        style={{ background: "var(--surface-subtle)" }}
      >
        <SafeImage
          src={listingCover(listing)}
          alt={listing.title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 104px, 124px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {listing.verified && (
          <span
            className="absolute left-1.5 top-1.5 rounded-md px-1.5 py-[3px] text-[9.5px] font-bold uppercase leading-none tracking-[0.06em] text-white"
            style={{ background: "var(--brand-accent)" }}
          >
            Verified
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-[3px]">
        <h3 className="truncate !text-[16px] font-bold !leading-tight" style={{ color: "var(--text-primary)" }}>
          {listing.title}
        </h3>

        {typeLine && (
          <p className="truncate text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            {typeLine}
          </p>
        )}

        <p className="flex items-center gap-1 text-[13px]">
          {reviews > 0 ? (
            <>
              <Star className="h-3.5 w-3.5 shrink-0" fill="#F5A524" strokeWidth={0} />
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                {rating.toFixed(1)}
              </span>
              <span style={{ color: "var(--text-tertiary)" }}>({reviews})</span>
            </>
          ) : (
            <>
              <Star className="h-3.5 w-3.5 shrink-0" fill="#D1D5DB" strokeWidth={0} />
              <span style={{ color: "var(--text-tertiary)" }}>{en ? "No reviews yet" : "Pa vlerësime"}</span>
            </>
          )}
        </p>

        {address && (
          <p className="flex items-center gap-1 text-[13px]" style={{ color: "var(--text-secondary)" }}>
            <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
            <span className="truncate">{address}</span>
          </p>
        )}

        {hasHours ? (
          <OpenStatusLine hours={listing.businessHours} variant="row" />
        ) : (
          price !== null && (
            <p className="text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
              {fromPriceShort(language)}{" "}
              <span className="font-bold" style={{ color: "var(--brand-accent)" }}>
                {formatPrice(price)}
              </span>
            </p>
          )
        )}
      </div>
    </Link>
  );
}
