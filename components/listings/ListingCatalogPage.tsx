"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import SafeImage from "@/components/ui/SafeImage";
import ScrollRail from "@/components/ui/ScrollRail";
import MobileAppBar from "@/components/layout/MobileAppBar";
import OpenStatusLine from "@/components/listings/OpenStatusLine";
import type { ListingProduct } from "@/components/listings/ListingProducts";
import { useLanguage } from "@/context/LanguageContext";
import useFavoriteToggle from "@/hooks/useFavoriteToggle";
import { OFFER_COPY, getOfferKind, getProductAction } from "@/lib/business-offer";
import { getCategoryIcon } from "@/lib/category-icons";
import { getCategoryByValue } from "@/lib/constants";
import { normalizeText } from "@/lib/listing-display";
import { formatPrice } from "@/lib/pricing";
import { addToCart, onCartChange, readCart, setCartQty } from "@/lib/cart";

const ALL_SECTION = "__all__";
const UNCATEGORIZED = "__uncategorized__";
type Sort = "default" | "price-asc" | "price-desc";

/**
 * "Katalogu" — one dedicated page per business listing everything it sells or
 * books in a single search-and-pills catalog, the same layout for every category
 * (a hotel's rooms and a café's menu and services alike). Reached from the
 * business page's "Katalogu" tab; the basket itself is the existing per-listing
 * cart, rendered by the page that hosts this component.
 */
export default function ListingCatalogPage({
  listing,
  products,
  phone,
  phoneDigits
}: {
  listing: any;
  products: ListingProduct[];
  phone: string;
  phoneDigits: string;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const lang = en ? "en" : "sq";
  const { favorited, toggle: toggleFavorite } = useFavoriteToggle(listing._id);

  const categoryValue = getCategoryByValue(listing.category)?.value || "";
  const offerKind = getOfferKind(listing);
  const offer = OFFER_COPY[offerKind];
  const FallbackIcon = getCategoryIcon(categoryValue);
  // Each card's button follows the item's own action — "Rezervo" (red, calendar) for what is
  // booked, "Porosit" (green, chat) for what is ordered — set per item by the owner, with the
  // business's default (rooms/services are booked) when they haven't.
  const isBooked = (product: ListingProduct) => getProductAction(product, offerKind) === "rezervim";

  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState(ALL_SECTION);
  const [sort, setSort] = useState<Sort>("default");
  const [cartQtyById, setCartQtyById] = useState<Record<string, number>>({});

  useEffect(() => {
    const sync = () => {
      const map: Record<string, number> = {};
      for (const item of readCart(listing.slug)) map[item.productId] = item.qty;
      setCartQtyById(map);
    };
    sync();
    return onCartChange(sync);
  }, [listing.slug]);

  const sections = useMemo(() => {
    const order: string[] = [];
    const groups = new Map<string, number>();
    for (const product of products) {
      const key = product.menuCategory?.trim() || UNCATEGORIZED;
      if (!groups.has(key)) {
        groups.set(key, 0);
        order.push(key);
      }
      groups.set(key, groups.get(key)! + 1);
    }
    return order.map((key) => ({ key, label: key === UNCATEGORIZED ? (en ? "Other" : "Të tjera") : key }));
  }, [products, en]);

  const visible = useMemo(() => {
    const q = normalizeText(query.trim());
    let list = products.filter((product) => {
      const key = product.menuCategory?.trim() || UNCATEGORIZED;
      if (activeSection !== ALL_SECTION && key !== activeSection) return false;
      if (!q) return true;
      return normalizeText(product.name).includes(q) || normalizeText(product.description || "").includes(q);
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    if (sort === "price-desc") list = [...list].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    return list;
  }, [products, activeSection, query, sort]);

  const handleAdd = (product: ListingProduct, opts?: { silent?: boolean }) => {
    addToCart(
      listing.slug,
      { productId: product._id, name: product.name, price: product.price, image: product.image, action: getProductAction(product, offerKind) },
      1
    );
    if (!opts?.silent) {
      toast.success(
        isBooked(product)
          ? en
            ? `${product.name} added to your booking`
            : `${product.name} u shtua te rezervimi juaj`
          : en
          ? `Added ${product.name} to your order`
          : `${product.name} u shtua në porosinë tuaj`
      );
    }
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

  const iconButton =
    "flex h-9 min-h-0 w-9 items-center justify-center rounded-full border transition-colors hover:bg-neutral-50 active:bg-neutral-100";

  return (
    <div className="min-h-screen bg-white">
      <MobileAppBar
        variant="catalog"
        listing={listing}
        backHref={`/listings/${listing.slug}`}
        searchHref={categoryValue ? `/listings?category=${categoryValue}` : "/listings"}
      />

      <div
        className="mx-auto w-full lg:w-[calc(100%-4rem)] lg:max-w-[1136px]"
        style={{ paddingTop: "var(--header-height)" }}
      >
        {/* Desktop-only header — the fixed MobileAppBar above is phone-only. */}
        <div className="hidden items-center justify-between gap-3 border-b py-4 lg:flex" style={{ borderColor: "var(--border-soft)" }}>
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={`/listings/${listing.slug}`}
              aria-label={en ? "Back" : "Kthehu"}
              className={iconButton}
              style={{ borderColor: "var(--border-medium)" }}
            >
              <ArrowLeft className="h-[18px] w-[18px]" style={{ color: "var(--text-primary)" }} />
            </Link>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full" style={{ background: "#16181D" }}>
              <SafeImage
                src={listing.logo || listing.images?.[0] || listing.photos?.[0] || listing.bannerImage}
                alt={listing.title}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>
                {listing.title}
              </p>
              <OpenStatusLine hours={listing.businessHours} variant="detail" />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" onClick={share} aria-label={en ? "Share" : "Ndaj"} className={iconButton} style={{ borderColor: "var(--border-medium)" }}>
              <Share2 className="h-[18px] w-[18px]" style={{ color: "var(--text-primary)" }} />
            </button>
            <button
              type="button"
              onClick={toggleFavorite}
              aria-pressed={favorited}
              aria-label={en ? "Save" : "Ruaj"}
              className={iconButton}
              style={{ borderColor: "var(--border-medium)" }}
            >
              <Heart className="h-[18px] w-[18px]" style={{ color: favorited ? "var(--brand-accent)" : "var(--text-primary)" }} fill={favorited ? "var(--brand-accent)" : "none"} />
            </button>
          </div>
        </div>

        {/* Search + sort */}
        <div className="flex items-center gap-2 px-4 pt-4 lg:px-0">
          <div
            className="flex h-11 flex-1 items-center gap-2 rounded-xl border px-3.5"
            style={{ borderColor: "var(--border-medium)", background: "var(--surface-white)" }}
          >
            <Search className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-secondary)" }} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              enterKeyHint="search"
              placeholder={en ? "Search the catalog" : "Kërko në katalog"}
              aria-label={en ? "Search the catalog" : "Kërko në katalog"}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:font-normal"
              style={{ color: "var(--text-primary)" }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={en ? "Clear" : "Pastro"}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: "#9CA3AF" }}
              >
                <X className="h-3 w-3" strokeWidth={3} />
              </button>
            )}
          </div>

          <label
            className="relative inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border px-3.5 text-[13.5px] font-semibold"
            style={{ borderColor: "var(--border-medium)", color: "var(--text-primary)", background: "var(--surface-white)" }}
          >
            <SlidersHorizontal className="h-[18px] w-[18px]" />
            <span>{en ? "Filters" : "Filtra"}</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              aria-label={en ? "Sort" : "Rendit"}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            >
              <option value="default">{en ? "Default order" : "Si në katalog"}</option>
              <option value="price-asc">{en ? "Price: low to high" : "Çmimi: nga më i ulëti"}</option>
              <option value="price-desc">{en ? "Price: high to low" : "Çmimi: nga më i larti"}</option>
            </select>
          </label>
        </div>

        {/* Section pills */}
        {sections.length > 1 && (
          <ScrollRail label={en ? "Sections" : "Seksionet"} focusKey={activeSection} railClassName="gap-2 px-4 py-4 lg:px-0">
            <button
              type="button"
              aria-pressed={activeSection === ALL_SECTION}
              onClick={() => setActiveSection(ALL_SECTION)}
              className="gd-quick-pill"
              style={activeSection === ALL_SECTION ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" } : undefined}
            >
              {en ? "All" : "Të gjitha"}
            </button>
            {sections.map((section) => (
              <button
                key={section.key}
                type="button"
                aria-pressed={activeSection === section.key}
                onClick={() => setActiveSection(section.key)}
                className="gd-quick-pill"
                style={activeSection === section.key ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" } : undefined}
              >
                {section.label}
              </button>
            ))}
          </ScrollRail>
        )}

        {/* Grid */}
        <div className="px-4 pb-28 pt-2 lg:px-0">
          {!products.length ? (
            <div className="px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}>
                <FallbackIcon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>
                {offer.emptyTitle[lang]}
              </p>
              <p className="mx-auto mt-1 max-w-xs text-[13.5px]" style={{ color: "var(--text-secondary)" }}>
                {offer.emptyText[lang]}
              </p>
            </div>
          ) : !visible.length ? (
            <p className="py-16 text-center text-[14px]" style={{ color: "var(--text-tertiary)" }}>
              {en ? `No results for "${query}"` : `Asnjë rezultat për "${query}"`}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => {
                const qty = cartQtyById[product._id] || 0;
                const booked = isBooked(product);
                const ActionIcon = booked ? CalendarCheck : MessageCircle;
                return (
                  <div
                    key={product._id}
                    className="flex min-w-0 flex-col overflow-hidden rounded-2xl"
                    style={{ background: "var(--surface-white)", boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="relative aspect-[4/3] w-full shrink-0" style={{ background: "var(--surface-cream)" }}>
                      {product.image ? (
                        <SafeImage src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FallbackIcon className="h-8 w-8" style={{ color: "var(--text-tertiary)" }} />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col p-3">
                      <p className="text-[14px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-[1.35]" style={{ color: "var(--text-secondary)" }}>
                          {product.description}
                        </p>
                      )}

                      {typeof product.price === "number" && (
                        <p className="mt-1.5 text-[14.5px] font-bold" style={{ color: "var(--text-primary)" }}>
                          {formatPrice(product.price)}
                          {offer.perNight && <span className="text-[12px] font-medium" style={{ color: "var(--text-tertiary)" }}> {en ? "/ night" : "/ natë"}</span>}
                        </p>
                      )}

                      <div className="mt-2.5">
                        {qty > 0 ? (
                          <div className="flex h-9 items-center justify-between rounded-full" style={{ background: "var(--surface-cream)" }}>
                            <button
                              type="button"
                              onClick={() => setCartQty(listing.slug, product._id, qty - 1)}
                              aria-label={en ? "Decrease quantity" : "Zvogëlo sasinë"}
                              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-200 active:scale-95"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-[13.5px] font-bold" style={{ color: "var(--text-primary)" }}>{qty}</span>
                            <button
                              type="button"
                              onClick={() => handleAdd(product, { silent: true })}
                              aria-label={en ? "Increase quantity" : "Shto sasinë"}
                              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-neutral-200 active:scale-95"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdd(product)}
                            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-[12.5px] font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
                            style={{ background: booked ? "var(--brand-accent)" : "var(--whatsapp-green)" }}
                          >
                            <ActionIcon className="h-[15px] w-[15px]" />
                            {booked ? (en ? "Book" : "Rezervo") : en ? "Order" : "Porosit"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
