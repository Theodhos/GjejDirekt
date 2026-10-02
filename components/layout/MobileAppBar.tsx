"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Search, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "@/components/layout/Logo";
import SafeImage from "@/components/ui/SafeImage";
import OpenStatusLine from "@/components/listings/OpenStatusLine";
import { useLanguage } from "@/context/LanguageContext";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";

type CatalogListing = {
  _id: string;
  title: string;
  description?: string;
  logo?: string;
  images?: string[];
  photos?: string[];
  bannerImage?: string;
  businessHours?: string;
};

/**
 * The phone app bar the directory and business screens are designed around. Below
 * `lg` it sits over the site header (same height, so the page offset still lines
 * up); from `lg` up the regular site header is used and this bar disappears.
 *
 * "results": back arrow + logo. "listing": logo on the left, search / share /
 * heart on the right. "catalog": back arrow + the business's own logo, name and
 * open status (a sub-page of one business, e.g. its Katalogu), search / share /
 * heart on the right.
 */
export default function MobileAppBar(
  props:
    | { variant: "results"; /** Where "back" goes when the page was opened directly. */ backHref?: string }
    | {
        variant: "listing";
        listing: { _id: string; title: string; description?: string };
        /** Where the search icon leads. */
        searchHref?: string;
      }
    | {
        variant: "catalog";
        listing: CatalogListing;
        /** Where "back" goes when the page was opened directly. */
        backHref?: string;
        /** Where the search icon leads. */
        searchHref?: string;
      }
) {
  const router = useRouter();
  const { language } = useLanguage();
  const en = language === "en";

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between gap-2 border-b bg-white px-3 lg:hidden"
      style={{ height: "var(--header-height)", borderColor: "var(--border-soft)" }}
    >
      {props.variant === "results" ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            // history.length is 1 for a page opened directly (shared link, new tab) —
            // going "back" would leave the site, so land somewhere useful instead.
            onClick={() => (window.history.length > 1 ? router.back() : router.push(props.backHref || "/"))}
            className="flex h-9 min-h-0 w-9 items-center justify-center rounded-full transition-colors active:bg-neutral-100"
            aria-label={en ? "Back" : "Kthehu"}
          >
            <ArrowLeft className="h-[22px] w-[22px]" style={{ color: "var(--text-primary)" }} />
          </button>
          <Link href="/" aria-label="GjejDirekt" className="flex items-center">
            <Logo className="text-[20px]" />
          </Link>
        </div>
      ) : props.variant === "listing" ? (
        <>
          <Link href="/" aria-label="GjejDirekt" className="flex items-center">
            <Logo className="text-[20px]" />
          </Link>
          <ListingActions listing={props.listing} searchHref={props.searchHref || "/listings"} />
        </>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => (window.history.length > 1 ? router.back() : router.push(props.backHref || "/"))}
              className="flex h-9 min-h-0 w-9 shrink-0 items-center justify-center rounded-full transition-colors active:bg-neutral-100"
              aria-label={en ? "Back" : "Kthehu"}
            >
              <ArrowLeft className="h-[22px] w-[22px]" style={{ color: "var(--text-primary)" }} />
            </button>
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full" style={{ background: "#16181D" }}>
              <SafeImage
                src={props.listing.logo || props.listing.images?.[0] || props.listing.photos?.[0] || props.listing.bannerImage}
                alt={props.listing.title}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                {props.listing.title}
              </p>
              <OpenStatusLine hours={props.listing.businessHours} variant="row" />
            </div>
          </div>
          <ListingActions listing={props.listing} searchHref={props.searchHref || "/listings"} />
        </>
      )}
    </div>
  );
}

function ListingActions({ listing, searchHref }: { listing: { _id: string; title: string; description?: string }; searchHref: string }) {
  const { language } = useLanguage();
  const en = language === "en";
  const { favorited, toggle } = useFavoriteToggle(listing._id);

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, text: listing.description || "", url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(en ? "Link copied to clipboard!" : "Linku u kopjua!");
      }
    } catch {
      // Dismissing the share sheet rejects the promise — nothing to report.
    }
  }

  const iconButton = "flex h-9 min-h-0 w-9 items-center justify-center rounded-full transition-colors active:bg-neutral-100";

  return (
    <div className="flex items-center gap-0.5">
      <Link href={searchHref} className={iconButton} aria-label={en ? "Search" : "Kërko"}>
        <Search className="h-[22px] w-[22px]" style={{ color: "var(--text-primary)" }} />
      </Link>
      <button type="button" onClick={share} className={iconButton} aria-label={en ? "Share" : "Ndaj"}>
        <Share2 className="h-[21px] w-[21px]" style={{ color: "var(--text-primary)" }} />
      </button>
      <button type="button" onClick={toggle} className={iconButton} aria-label={en ? "Save" : "Ruaj"} aria-pressed={favorited}>
        <Heart
          className="h-[22px] w-[22px]"
          style={{ color: favorited ? "var(--brand-accent)" : "var(--text-primary)" }}
          fill={favorited ? "var(--brand-accent)" : "none"}
        />
      </button>
    </div>
  );
}
