"use client";

import { useRef, useState } from "react";
import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  Globe,
  Heart,
  ImageIcon,
  Info,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Share2,
  Star,
  UtensilsCrossed,
  ClipboardList,
  type LucideIcon
} from "lucide-react";
import toast from "react-hot-toast";
import SafeImage from "@/components/ui/SafeImage";
import Lightbox from "@/components/ui/Lightbox";
import MobileAppBar from "@/components/layout/MobileAppBar";
import BusinessMenu from "@/components/listings/BusinessMenu";
import BusinessReviews from "@/components/listings/BusinessReviews";
import OpenStatusLine from "@/components/listings/OpenStatusLine";
import type { ListingProduct } from "@/components/listings/ListingProducts";
import { useLanguage } from "@/context/LanguageContext";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import { OFFER_COPY, getOfferKind, type OfferKind } from "@/lib/business-offer";
import { getCategoryIcon } from "@/lib/category-icons";
import { buildWhatsappActions, getCategoryByValue, getListingActions, getSubcategoryLabel, whatsappHrefFor } from "@/lib/constants";
import { FOOD_CATEGORY, foodTypeParts } from "@/lib/food";
import { isLinkAddress, listingAddress } from "@/lib/listing-display";
import { formatPrice } from "@/lib/pricing";

type TabKey = "overview" | "menu" | "reviews" | "photos" | "info";

const HEADER_HEIGHT = 56;

/**
 * The business page — one design for every category: cover with the round logo,
 * name + VERIFIED, rating and open state, four quick actions (Telefon, WhatsApp,
 * Si të shkoj, Ruaj), then the Përmbledhje / offer / Vlerësime / Foto / Informacion
 * tabs. The offer tab lists what the business sells in its own sections with a
 * "+ Shto" on each item — Menu for food, Dhomat for hotels, Produktet for shops,
 * Shërbimet for the rest (lib/business-offer.ts) — and only exists for businesses
 * that take orders or bookings from a catalog. The basket bar at the bottom is
 * ListingCart in its "bar" variant, rendered by the page.
 */
export default function BusinessPage({
  listing,
  products,
  phone,
  phoneDigits,
  hasCatalog
}: {
  listing: any;
  products: ListingProduct[];
  phone: string;
  phoneDigits: string;
  hasCatalog: boolean;
}) {
  const { language, t } = useLanguage();
  const en = language === "en";
  const lang = en ? "en" : "sq";

  const [tab, setTab] = useState<TabKey>(hasCatalog && products.length ? "menu" : "overview");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { favorited, toggle: toggleFavorite } = useFavoriteToggle(listing._id);

  const categoryValue = getCategoryByValue(listing.category)?.value || "";
  const isFood = categoryValue === FOOD_CATEGORY;
  const offerKind = getOfferKind(listing, hasCatalog);
  const offer = OFFER_COPY[offerKind];
  const OfferIcon = getCategoryIcon(categoryValue);

  const subLabels = (t.categories.subnames as Record<string, Record<string, string>>)[categoryValue] || {};
  const subcategoryLabel = subLabels[listing.subcategory] || getSubcategoryLabel(categoryValue, listing.subcategory) || "";
  // "Restorant · Burger" for food (the kind of place, then the cuisine); the type alone elsewhere.
  const typeParts = isFood ? foodTypeParts(listing, subcategoryLabel, language) : [subcategoryLabel].filter(Boolean);

  const cover = listing.bannerImage || listing.images?.[1] || listing.photos?.[1] || listing.images?.[0] || listing.photos?.[0];
  const logo = listing.logo || listing.images?.[0] || listing.photos?.[0] || listing.bannerImage;
  const photos: string[] = Array.from(
    new Set([...(listing.images || []), ...(listing.photos || []), listing.bannerImage].filter(Boolean))
  );

  const address = listingAddress(listing);
  const reviews = Number(listing.reviewCount || 0);
  const rating = Number(listing.ratingAverage || 0);

  const whatsappHref = buildWhatsappActions(listing, phoneDigits, lang)[0]?.href || "";
  const canReserve = getListingActions(listing).includes("rezervim");
  const reserveHref = canReserve ? whatsappHrefFor("rezervim", phoneDigits, listing.title, lang) : "";

  const coordinates = listing.coordinates?.lat && listing.coordinates?.lng ? `${listing.coordinates.lat},${listing.coordinates.lng}` : "";
  const streetAddress = isLinkAddress(listing.address) ? "" : listing.address;
  const destination = coordinates || [streetAddress, listing.location, listing.country].filter(Boolean).join(", ") || listing.title;
  const directionsHref =
    listing.googleMapsLink ||
    (isLinkAddress(listing.address) ? String(listing.address).trim() : "") ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

  const track = (kind: "phone-click" | "whatsapp-click") => {
    if (!listing._id) return;
    fetch(`/api/listings/${listing._id}/${kind}`, { method: "POST", keepalive: true }).catch(() => {});
  };

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

  function selectTab(next: TabKey) {
    setTab(next);
    // The tab bar sticks under the header while scrolling; switching tab from far down
    // the page would leave the new content half-way through, so bring its top into view.
    const bar = tabsRef.current;
    if (bar) {
      const top = bar.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
      if (window.scrollY > top) window.scrollTo({ top });
    }
  }

  // The offer tab exists once a catalog business has put something in it; the others (a dentist,
  // a hairdresser...) keep the reservation button instead and open on Përmbledhje.
  const hasOffer = hasCatalog && products.length > 0;
  const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
    { key: "overview", label: en ? "Overview" : "Përmbledhje", icon: ClipboardList },
    ...(hasOffer ? [{ key: "menu" as const, label: offer.tab[en ? "en" : "sq"], icon: OfferIcon }] : []),
    { key: "reviews", label: en ? "Reviews" : "Vlerësime", icon: Star },
    { key: "photos", label: en ? "Photos" : "Foto", icon: ImageIcon },
    { key: "info", label: en ? "Info" : "Informacion", icon: Info }
  ];

  const actionButton =
    "flex h-11 min-w-0 flex-auto items-center justify-center gap-1 rounded-xl border bg-white px-1.5 text-[11.5px] font-semibold transition-colors active:bg-neutral-50 sm:gap-1.5 sm:text-[13px]";

  return (
    <div className="min-h-screen bg-white">
      <MobileAppBar variant="listing" listing={listing} searchHref={categoryValue ? `/listings?category=${categoryValue}` : "/listings"} />

      {/* Cover — edge to edge under the header; everything below lines up with the header's content
          (page-shell: 1200px max, 2rem gutters). */}
      <div className="relative h-[132px] overflow-hidden sm:h-[220px] lg:h-[280px]">
        <SafeImage src={cover} alt={`${listing.title} cover`} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {/* On phones share/save live in the app bar; from lg up there is no app bar. */}
        <div className="absolute inset-x-0 top-3 hidden lg:block">
          <div className="mx-auto flex w-[calc(100%-4rem)] max-w-[1136px] justify-end gap-2">
            <button type="button" onClick={share} aria-label={en ? "Share" : "Ndaj"} className="flex h-9 min-h-0 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white">
              <Share2 className="h-[18px] w-[18px]" style={{ color: "var(--text-primary)" }} />
            </button>
            <button type="button" onClick={toggleFavorite} aria-label={en ? "Save" : "Ruaj"} className="flex h-9 min-h-0 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white">
              <Heart
                className="h-[18px] w-[18px]"
                style={{ color: favorited ? "var(--brand-accent)" : "var(--text-primary)" }}
                fill={favorited ? "var(--brand-accent)" : "none"}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full lg:w-[calc(100%-4rem)] lg:max-w-[1136px]">
        {/* Identity */}
        <div className="flex gap-3 px-4 sm:gap-3.5 lg:px-0">
          <div
            className="relative -mt-9 h-[68px] w-[68px] shrink-0 overflow-hidden rounded-full border-[3px] border-white shadow-md sm:-mt-11 sm:h-[92px] sm:w-[92px]"
            style={{ background: "#16181D" }}
          >
            <SafeImage src={logo} alt={listing.title} fill sizes="92px" className="object-cover" />
          </div>

          <div className="min-w-0 flex-1 pt-2.5">
            <h1 className="flex flex-wrap items-center gap-x-2 gap-y-1 !text-[16px] font-bold !leading-tight sm:!text-[23px]" style={{ color: "var(--text-primary)" }}>
              <span>{listing.title}</span>
              {listing.verified && (
                <span
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[9.5px] font-bold uppercase leading-none tracking-[0.06em] text-white"
                  style={{ background: "var(--verified-blue)" }}
                >
                  Verified
                  <BadgeCheck className="h-3 w-3" />
                </span>
              )}
            </h1>

            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
              <Star className="h-3.5 w-3.5 shrink-0" fill={reviews > 0 ? "#F5A524" : "#D1D5DB"} strokeWidth={0} />
              {reviews > 0 ? (
                <>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>{rating.toFixed(1)}</span>
                  <span style={{ color: "var(--text-tertiary)" }}>({reviews} {en ? (reviews === 1 ? "review" : "reviews") : "vlerësime"})</span>
                </>
              ) : (
                <span style={{ color: "var(--text-tertiary)" }}>{en ? "No reviews yet" : "Pa vlerësime"}</span>
              )}
              {typeParts.map((part) => (
                <span key={part} className="flex items-center gap-1.5">
                  <span aria-hidden style={{ color: "var(--text-tertiary)" }}>·</span>
                  {part}
                </span>
              ))}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
              <OpenStatusLine hours={listing.businessHours} variant="detail" />
              {address && (
                <span className="flex min-w-0 items-center gap-1">
                  {/* On a phone the pin alone separates it, so a wrapped address never starts with a stray dot. */}
                  <span aria-hidden className="hidden sm:inline" style={{ color: "var(--text-tertiary)" }}>·</span>
                  <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
                  <span className="truncate">{address}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 px-4 pb-4 pt-4 lg:max-w-2xl lg:px-0">
          <ContactAction
            className={actionButton}
            href={phone ? `tel:${phone}` : undefined}
            onClick={() => track("phone-click")}
            icon={<Phone className="h-[14px] w-[14px] shrink-0" style={{ color: "var(--brand-accent)" }} />}
            label={en ? "Call" : "Telefon"}
          />
          <ContactAction
            className={actionButton}
            href={whatsappHref || undefined}
            external
            onClick={() => track("whatsapp-click")}
            icon={<MessageCircle className="h-[14px] w-[14px] shrink-0" style={{ color: "var(--whatsapp-green)" }} />}
            label="WhatsApp"
          />
          <ContactAction
            className={actionButton}
            href={directionsHref}
            external
            icon={<Navigation className="h-[14px] w-[14px] shrink-0" style={{ color: "var(--text-primary)" }} />}
            label={en ? "Directions" : "Si të shkoj"}
          />
          <button type="button" onClick={toggleFavorite} aria-pressed={favorited} className={actionButton} style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)" }}>
            <Heart
              className="h-[14px] w-[14px] shrink-0"
              style={{ color: "var(--brand-accent)" }}
              fill={favorited ? "var(--brand-accent)" : "none"}
            />
            <span className="truncate">{en ? "Save" : "Ruaj"}</span>
          </button>
        </div>

        {/* Tabs — stuck under the header while the page scrolls. */}
        <div
          ref={tabsRef}
          role="tablist"
          className="sticky z-30 grid border-y bg-white"
          style={{ top: "var(--header-height)", gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))`, borderColor: "var(--border-soft)" }}
        >
          {tabs.map((item) => {
            const active = tab === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => selectTab(item.key)}
                className="relative flex h-[62px] min-w-0 flex-col items-center justify-center gap-1 px-0.5 transition-colors"
                style={{ color: active ? "var(--brand-accent)" : "var(--text-secondary)" }}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.2 : 1.7} />
                <span className="max-w-full truncate text-[11px] sm:text-[12.5px]" style={{ fontWeight: active ? 700 : 500 }}>
                  {item.label}
                </span>
                {active && <span className="absolute inset-x-2 bottom-[-1px] h-[2.5px] rounded-full" style={{ background: "var(--brand-accent)" }} />}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "menu" && <BusinessMenu listingSlug={listing.slug} products={products} kind={offerKind} categoryValue={categoryValue} />}

        {tab === "overview" && (
          <Overview
            listing={listing}
            products={products}
            offerKind={offerKind}
            showOffer={hasOffer}
            isFood={isFood}
            reserveHref={reserveHref}
            onOpenMenu={() => selectTab("menu")}
          />
        )}

        {tab === "reviews" && <BusinessReviews listingId={listing._id} ratingAverage={rating} reviewCount={reviews} />}

        {tab === "photos" && (
          <div className="px-4 py-5 pb-28 lg:px-0">
            {photos.length ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3">
                {photos.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setLightbox(index)}
                    className="relative aspect-square overflow-hidden rounded-xl"
                    style={{ background: "var(--surface-subtle)" }}
                    aria-label={`${listing.title} — ${index + 1}`}
                  >
                    <SafeImage src={src} alt={`${listing.title} ${index + 1}`} fill sizes="(max-width: 640px) 50vw, 256px" className="object-cover transition-transform duration-300 hover:scale-105" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-[14px]" style={{ color: "var(--text-tertiary)" }}>
                {en ? "No photos yet." : "Ende pa foto."}
              </p>
            )}
          </div>
        )}

        {tab === "info" && (
          <Information
            listing={listing}
            phone={phone}
            address={address}
            directionsHref={directionsHref}
            isFood={isFood}
            reserveHref={reserveHref}
          />
        )}
      </div>

      {lightbox !== null && <Lightbox images={photos} isOpen initialIndex={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/** One of the four buttons under the title; renders disabled when the business has no such contact. */
function ContactAction({
  className,
  href,
  external = false,
  onClick,
  icon,
  label
}: {
  className: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const style = { borderColor: "var(--border-medium)", color: "var(--text-primary)" };
  if (!href) {
    return (
      <span className={`${className} opacity-45`} style={style} aria-disabled>
        {icon}
        <span className="truncate">{label}</span>
      </span>
    );
  }
  return (
    <a
      href={href}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={className}
      style={style}
    >
      {icon}
      <span className="truncate">{label}</span>
    </a>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2.5 !text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>
      {children}
    </h2>
  );
}

function Overview({
  listing,
  products,
  offerKind,
  showOffer,
  isFood,
  reserveHref,
  onOpenMenu
}: {
  listing: any;
  products: ListingProduct[];
  offerKind: OfferKind;
  showOffer: boolean;
  isFood: boolean;
  reserveHref: string;
  onOpenMenu: () => void;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const offer = OFFER_COPY[offerKind];
  const lang = en ? "en" : "sq";

  const chips: string[] = Array.from(
    new Set([...(listing.cuisines || []), ...(listing.priceRange ? [listing.priceRange] : []), ...(listing.tags || [])].map((item: string) => String(item).trim()).filter(Boolean))
  );
  // Dishes with a photo make the better preview — fall back to whatever is first.
  const featured = [...products].sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image))).slice(0, 4);

  return (
    <div className="flex flex-col gap-7 px-4 py-5 pb-28 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 lg:px-0">
      <div className="space-y-7">
        {listing.description && (
          <section>
            <SectionTitle>{en ? "About" : "Rreth nesh"}</SectionTitle>
            <p className="whitespace-pre-line text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {listing.description}
            </p>
          </section>
        )}

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span key={chip} className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold" style={{ background: "var(--surface-page)", color: "var(--text-primary)" }}>
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-7">
        {showOffer && featured.length > 0 && (
          <section>
            <SectionTitle>{offer.preview[lang]}</SectionTitle>
            <div className="grid grid-cols-2 gap-3">
              {featured.map((product) => (
                <button key={product._id} type="button" onClick={onOpenMenu} className="overflow-hidden rounded-xl border text-left" style={{ borderColor: "var(--border-soft)" }}>
                  <div className="relative aspect-[4/3] w-full" style={{ background: "var(--surface-subtle)" }}>
                    {product.image && <SafeImage src={product.image} alt={product.name} fill sizes="(max-width: 768px) 45vw, 340px" className="object-cover" />}
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-[13.5px] font-bold" style={{ color: "var(--text-primary)" }}>{product.name}</p>
                    {typeof product.price === "number" && (
                      <p className="text-[13px] font-bold" style={{ color: "var(--brand-accent)" }}>
                        {formatPrice(product.price)}
                        {offer.perNight && <span className="font-medium" style={{ color: "var(--text-tertiary)" }}> {en ? "/ night" : "/ natë"}</span>}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenMenu}
              className="mt-3 h-11 w-full rounded-xl border text-[14px] font-semibold"
              style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)" }}
            >
              {offer.seeAll[lang]}
            </button>
          </section>
        )}

        {reserveHref && <ReserveLink href={reserveHref} isFood={isFood} />}
      </div>
    </div>
  );
}

function ReserveLink({ href, isFood }: { href: string; isFood: boolean }) {
  const { language } = useLanguage();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14.5px] font-bold text-white"
      style={{ background: "var(--whatsapp-green)" }}
    >
      <CalendarCheck className="h-5 w-5" />
      {isFood
        ? language === "en"
          ? "Book a table on WhatsApp"
          : "Rezervo tavolinë në WhatsApp"
        : language === "en"
        ? "Book on WhatsApp"
        : "Rezervo në WhatsApp"}
    </a>
  );
}

function InfoRow({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3.5 border-b py-3.5 last:border-b-0" style={{ borderColor: "var(--border-soft)" }}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: "var(--text-tertiary)" }}>{label}</p>
        <div className="mt-0.5 break-words text-[14.5px] font-medium" style={{ color: "var(--text-primary)" }}>{children}</div>
      </div>
    </div>
  );
}

function Information({
  listing,
  phone,
  address,
  directionsHref,
  isFood,
  reserveHref
}: {
  listing: any;
  phone: string;
  address: string;
  directionsHref: string;
  isFood: boolean;
  reserveHref: string;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const website: string = listing.website || listing.contactInfo?.website || "";
  // Owners paste either a full link or just a handle; both have to end up as a working href.
  const socialHref = (value: string | undefined, host: string) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    return raw.includes(".") ? `https://${raw}` : `https://${host}/${raw.replace(/^@/, "")}`;
  };
  const social = [
    { label: "Instagram", href: socialHref(listing.socialLinks?.instagram, "instagram.com") },
    { label: "Facebook", href: socialHref(listing.socialLinks?.facebook, "facebook.com") }
  ].filter((item) => item.href);
  const amenities: string[] = Array.from(new Set([...(listing.amenities || []), ...(listing.highlights || [])].filter(Boolean)));
  const link = "font-semibold underline-offset-2 hover:underline";

  return (
    <div className="px-4 pb-28 pt-2 lg:px-0">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
        {address && (
          <InfoRow icon={MapPin} label={en ? "Address" : "Adresa"}>
            <p>{address}</p>
            <a href={directionsHref} target="_blank" rel="noreferrer" className={`${link} text-[13px]`} style={{ color: "var(--brand-accent)" }}>
              {en ? "Open in maps" : "Hape në hartë"}
            </a>
          </InfoRow>
        )}

        {listing.businessHours && (
          <InfoRow icon={Clock} label={en ? "Opening hours" : "Orari"}>
            <p>{listing.businessHours}</p>
            <OpenStatusLine hours={listing.businessHours} variant="detail" />
          </InfoRow>
        )}

        {phone && (
          <InfoRow icon={Phone} label={en ? "Phone" : "Telefon"}>
            <a href={`tel:${phone}`} className={link}>{phone}</a>
          </InfoRow>
        )}

        {website && (
          <InfoRow icon={Globe} label="Website">
            <a href={/^https?:\/\//i.test(website) ? website : `https://${website}`} target="_blank" rel="noreferrer" className={link}>
              {website.replace(/^https?:\/\//i, "")}
            </a>
          </InfoRow>
        )}

        {social.length > 0 && (
          <InfoRow icon={Instagram} label={en ? "Social media" : "Rrjetet sociale"}>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {social.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className={link}>{item.label}</a>
              ))}
            </div>
          </InfoRow>
        )}

        {(listing.checkIn || listing.checkOut) && (
          <InfoRow icon={Clock} label="Check-in / check-out">
            {[listing.checkIn && `Check-in ${listing.checkIn}`, listing.checkOut && `Check-out ${listing.checkOut}`].filter(Boolean).join(" · ")}
          </InfoRow>
        )}

        {listing.cuisines?.length > 0 && (
          <InfoRow icon={UtensilsCrossed} label={en ? "Cuisine" : "Kuzhina"}>
            {listing.cuisines.join(", ")}
          </InfoRow>
        )}

        {amenities.length > 0 && (
          <InfoRow icon={Info} label={en ? "Features" : "Karakteristika"}>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {amenities.map((item) => (
                <span key={item} className="rounded-full px-3 py-1 text-[12.5px] font-semibold" style={{ background: "var(--surface-page)" }}>{item}</span>
              ))}
            </div>
          </InfoRow>
        )}
      </div>

      {reserveHref && (
        <div className="mt-5">
          <ReserveLink href={reserveHref} isFood={isFood} />
        </div>
      )}
    </div>
  );
}
