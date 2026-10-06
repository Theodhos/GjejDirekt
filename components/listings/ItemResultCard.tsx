"use client";

import Link from "next/link";
import { BadgeCheck, CalendarCheck, Clock, Heart, MapPin, MessageCircle, Tag } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { listingCover } from "@/components/home/BusinessCard";
import { useLanguage } from "@/context/LanguageContext";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import { getOfferKind, getProductAction } from "@/lib/business-offer";
import type { MenuItem } from "@/lib/food-server";
import { formatPrice } from "@/lib/pricing";

/**
 * One product, dish, room or service as a search result: its photo (the business's
 * when it has none) with the availability tag, its name, the business that offers it
 * with the verified mark, the city, its section and time, the price, and the button
 * that orders or books it — straight into the business's catalog, opened on this
 * item. Same shape as a business row (ListingRow) so the two mix in one list.
 */
export default function ItemResultCard({
  listing,
  item,
  priority = false
}: {
  listing: any;
  item: MenuItem;
  priority?: boolean;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const { favorited, toggle } = useFavoriteToggle(listing._id?.toString?.() || listing._id);

  const offerKind = getOfferKind(listing);
  const booked = getProductAction({ action: item.a }, offerKind) === "rezervim";
  const perNight = offerKind === "rooms";
  const href = `/listings/${listing.slug}/katalogu?q=${encodeURIComponent(item.n)}`;

  return (
    <div
      className="group relative flex items-stretch gap-3.5 border-b px-4 py-3.5 transition-colors active:bg-neutral-50 lg:rounded-2xl lg:border lg:bg-white lg:p-3 lg:hover:shadow-[var(--shadow-hover)]"
      style={{ borderColor: "var(--border-soft)" }}
    >
      {/* The whole card opens the item in the catalog; the heart and the button sit above this overlay. */}
      <Link href={href} aria-label={`${item.n} – ${listing.title}`} className="absolute inset-0 z-0 rounded-2xl" />

      <div
        className="relative h-[136px] w-[120px] shrink-0 overflow-hidden rounded-xl sm:h-[150px] sm:w-[150px]"
        style={{ background: "var(--surface-subtle)" }}
      >
        <SafeImage
          src={item.i || listingCover(listing)}
          alt={item.n}
          fill
          priority={priority}
          sizes="(max-width: 640px) 120px, 150px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggle();
          }}
          aria-label={favorited ? (en ? "Remove from favorites" : "Hiq nga të preferuarat") : en ? "Save" : "Ruaj"}
          aria-pressed={favorited}
          className="absolute right-1.5 top-1.5 z-10 flex h-7 w-7 min-h-0 items-center justify-center rounded-full bg-white/95 shadow-sm"
        >
          <Heart
            className="h-[15px] w-[15px]"
            style={{ color: favorited ? "#E11D48" : "var(--text-primary)" }}
            fill={favorited ? "#E11D48" : "none"}
          />
        </button>
        <span
          className="absolute bottom-1.5 left-1.5 rounded-md px-1.5 py-[3px] text-[10px] font-semibold leading-none text-white"
          style={{ background: "#16A34A" }}
        >
          {en ? "Available" : "I disponueshëm"}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 !text-[16px] font-bold !leading-tight" style={{ color: "var(--brand-accent)" }}>
            {item.n}
          </h3>
          {item.p !== undefined && (
            <p className="shrink-0 text-right leading-tight">
              <span className="block text-[17px] font-bold" style={{ color: "var(--text-primary)" }}>
                {formatPrice(item.p)}
              </span>
              {perNight && (
                <span className="block text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>
                  / {en ? "night" : "natë"}
                </span>
              )}
            </p>
          )}
        </div>

        <p className="flex items-center gap-1 text-[13.5px] font-semibold" style={{ color: "var(--text-primary)" }}>
          <span className="truncate">{listing.title}</span>
          {listing.verified && <BadgeCheck className="h-4 w-4 shrink-0" fill="#F5A524" stroke="#fff" />}
        </p>

        {listing.location && (
          <p className="flex items-center gap-1 text-[13px]" style={{ color: "var(--text-secondary)" }}>
            <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
            <span className="truncate">{listing.location}</span>
          </p>
        )}

        {(item.s || item.t) && (
          <p className="flex items-center gap-3 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
            {item.s && (
              <span className="flex min-w-0 items-center gap-1">
                <Tag className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
                <span className="truncate">{item.s}</span>
              </span>
            )}
            {item.t && (
              <span className="flex shrink-0 items-center gap-1">
                <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
                {item.t}
              </span>
            )}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          {item.d ? (
            <p className="line-clamp-1 min-w-0 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
              {item.d}
            </p>
          ) : (
            <span />
          )}
          <Link
            href={href}
            className="relative z-10 inline-flex h-8 min-h-0 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[12.5px] font-bold transition-opacity hover:opacity-90 active:scale-95"
            style={
              booked
                ? { borderColor: "var(--brand-accent)", color: "var(--brand-accent)", background: "var(--surface-white)" }
                : { borderColor: "var(--whatsapp-green)", color: "#fff", background: "var(--whatsapp-green)" }
            }
          >
            {booked ? <CalendarCheck className="h-[14px] w-[14px]" /> : <MessageCircle className="h-[14px] w-[14px]" />}
            {booked ? (en ? "Book" : "Rezervo") : en ? "Order" : "Porosit"}
          </Link>
        </div>
      </div>
    </div>
  );
}
