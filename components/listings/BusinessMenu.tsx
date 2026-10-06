"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Beef,
  Cake,
  Coffee,
  CookingPot,
  CupSoda,
  Droplet,
  Egg,
  Fish,
  IceCream,
  Minus,
  Pizza,
  Plus,
  Salad,
  Sandwich,
  Clock,
  Soup,
  Utensils,
  UtensilsCrossed,
  Wheat,
  Wine,
  X,
  type LucideIcon
} from "lucide-react";
import ExpandableText from "@/components/ui/ExpandableText";
import toast from "react-hot-toast";
import SafeImage from "@/components/ui/SafeImage";
import { useLanguage } from "@/context/LanguageContext";
import { OFFER_COPY, getProductAction, type OfferKind } from "@/lib/business-offer";
import { addToCart, onCartChange, readCart, setCartQty } from "@/lib/cart";
import { getCategoryIcon } from "@/lib/category-icons";
import { formatPrice } from "@/lib/pricing";
import { normalizeText } from "@/lib/listing-display";
import type { ListingProduct } from "@/components/listings/ListingProducts";
import CatalogManager, { type CatalogListing } from "@/components/dashboard/CatalogManager";

const UNCATEGORIZED = "__uncategorized__";

/**
 * A small icon for a section, picked from the words in its name. The dish words only
 * mean something on a food menu, so every other category falls back to its own icon
 * (a bed for rooms, a bag for a shop...).
 */
function sectionIcon(label: string, food: boolean, fallback: LucideIcon): LucideIcon {
  if (!food) return fallback;
  const text = normalizeText(label);
  // Matched at the start of a word so "tea" finds "tea time" but not "steak".
  const has = (...words: string[]) => words.some((word) => new RegExp(`\\b${word}`).test(text));
  if (has("burger")) return Beef;
  if (has("hot ?dog", "sandui", "sandwich", "toast", "wrap", "kebab")) return Sandwich;
  if (has("pizza", "pica")) return Pizza;
  if (has("salc", "sauce")) return Droplet;
  if (has("pije", "drink", "lengje", "soke", "juice", "smoothie", "koktej", "cocktail")) return CupSoda;
  if (has("vere", "wine", "birr", "beer")) return Wine;
  if (has("akullore", "ice ?cream", "gelato")) return IceCream;
  if (has("embel", "dessert", "sweet", "torte", "cake", "krep", "crepe", "waffle", "pancake")) return Cake;
  if (has("kafe", "coffee", "caj", "tea", "espresso", "cappuccino")) return Coffee;
  if (has("sallat", "salad")) return Salad;
  if (has("supe", "soup", "gjelle")) return Soup;
  if (has("pjat", "ushqim", "kryesor", "main", "dish", "plate")) return UtensilsCrossed;
  if (has("peshk", "fish", "seafood", "deti")) return Fish;
  if (has("mengjes", "breakfast", "veze", "egg")) return Egg;
  if (has("buke", "bread", "byrek", "furr", "brum", "pastry", "croissant")) return Wheat;
  if (has("skare", "grill", "mish", "meat")) return CookingPot;
  return Utensils;
}

/**
 * The offer tab (Menu, Dhomat, Produktet or Shërbimet): a KATEGORITË sidebar (the sections
 * the owner grouped items into) beside the list for the selected section, each item with an
 * outlined "+ Shto" button that becomes a − 1 + stepper once it is in the basket. The
 * basket itself is the existing per-business cart, so quantities here and in the checkout
 * drawer are always the same numbers.
 */
export default function BusinessMenu({
  listingSlug,
  products,
  kind,
  categoryValue,
  canEdit = false,
  catalogListing
}: {
  listingSlug: string;
  products: ListingProduct[];
  kind: OfferKind;
  /** Canonical category of the business — picks the fallback icon. */
  categoryValue: string;
  /** The owner (or an admin) viewing their own listing — shows the inline "+ Shto" editor. */
  canEdit?: boolean;
  /** Only required when `canEdit` — what CatalogManager needs to save a new item. */
  catalogListing?: CatalogListing;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const lang = en ? "en" : "sq";
  const copy = OFFER_COPY[kind];
  const food = kind === "menu";
  const FallbackIcon = getCategoryIcon(categoryValue);
  const [activeKey, setActiveKey] = useState<string>("");
  const [cartQtyById, setCartQtyById] = useState<Record<string, number>>({});
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    const sync = () => {
      const map: Record<string, number> = {};
      for (const item of readCart(listingSlug)) map[item.productId] = item.qty;
      setCartQtyById(map);
    };
    sync();
    return onCartChange(sync);
  }, [listingSlug]);

  const sections = useMemo(() => {
    const order: string[] = [];
    const groups = new Map<string, ListingProduct[]>();
    for (const product of products) {
      const key = product.menuCategory?.trim() || UNCATEGORIZED;
      if (!groups.has(key)) {
        groups.set(key, []);
        order.push(key);
      }
      groups.get(key)!.push(product);
    }
    return order.map((key) => ({
      key,
      label: key === UNCATEGORIZED ? (en ? "Other" : "Të tjera") : key,
      items: groups.get(key)!
    }));
  }, [products, en]);

  if (!products.length) {
    // The owner lands here with nothing yet — show the add form right away instead
    // of a dead end they'd have to go hunting for.
    if (canEdit && catalogListing) {
      return (
        <div className="px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-xl">
            {/* No initialProducts: this fetches the owner's full catalog itself (hidden
                items included), same as the wizard's embedded step. */}
            <CatalogManager listing={catalogListing} embedded />
          </div>
        </div>
      );
    }
    return (
      <div className="px-6 py-16 text-center">
        <span
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
        >
          <FallbackIcon className="h-6 w-6" />
        </span>
        <p className="mt-4 text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>
          {copy.emptyTitle[lang]}
        </p>
        <p className="mx-auto mt-1 max-w-xs text-[13.5px]" style={{ color: "var(--text-secondary)" }}>
          {copy.emptyText[lang]}
        </p>
      </div>
    );
  }

  // One section means there is nothing to switch between, so the sidebar would be noise —
  // unless the owner needs it anyway, as the one place to reach "+ Shto".
  const hasSidebar = canEdit || sections.length > 1 || (sections.length === 1 && sections[0].key !== UNCATEGORIZED);
  const active = sections.find((section) => section.key === activeKey) || sections[0];

  const handleAdd = (product: ListingProduct, silent = false) => {
    addToCart(listingSlug, { productId: product._id, name: product.name, price: product.price, image: product.image, action: getProductAction(product, kind) }, 1);
    if (!silent) toast.success(en ? `Added ${product.name} to your order` : `${product.name} u shtua në porosinë tuaj`);
  };

  const accent = "var(--brand-accent)";

  return (
    <div className={hasSidebar ? "grid grid-cols-[96px_minmax(0,1fr)] sm:grid-cols-[140px_minmax(0,1fr)]" : ""}>
      {hasSidebar && (
        <aside
          className="sticky top-[calc(var(--header-height)+63px)] max-h-[calc(100vh-var(--header-height)-63px-var(--bottom-nav-height))] self-start overflow-y-auto border-r"
          style={{ borderColor: "var(--border-soft)", background: "var(--surface-page)", scrollbarWidth: "none" }}
        >
          <p className="px-2 pb-2 pt-4 text-center text-[10px] font-bold uppercase tracking-[0.03em] sm:px-3 sm:text-left" style={{ color: "var(--text-tertiary)" }}>
            {en ? "Categories" : "Kategoritë"}
          </p>
          <nav className="pb-24">
            {sections.map((section) => {
              const Icon = sectionIcon(section.label, food, FallbackIcon);
              const isActive = section.key === active.key;
              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => setActiveKey(section.key)}
                  aria-current={isActive}
                  className="flex w-full flex-col items-center gap-1 border-l-[3px] px-1.5 py-3 text-center text-[11px] leading-tight transition-colors sm:flex-row sm:gap-2 sm:px-3 sm:text-left sm:text-[13.5px]"
                  style={{
                    borderColor: isActive ? accent : "transparent",
                    background: isActive ? "var(--brand-light)" : "transparent",
                    color: isActive ? accent : "var(--text-primary)",
                    fontWeight: isActive ? 700 : 500
                  }}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                  <span className="min-w-0 max-w-full break-words leading-tight">{section.label}</span>
                </button>
              );
            })}
            {canEdit && catalogListing && (
              <button
                type="button"
                onClick={() => setAddOpen((value) => !value)}
                aria-pressed={addOpen}
                className="mt-1 flex w-full flex-col items-center gap-1 border-l-[3px] px-1.5 py-3 text-center text-[11px] font-semibold leading-tight transition-colors sm:flex-row sm:gap-2 sm:px-3 sm:text-left sm:text-[13.5px]"
                style={{
                  borderColor: addOpen ? accent : "transparent",
                  background: addOpen ? "var(--brand-light)" : "transparent",
                  color: accent
                }}
              >
                {addOpen ? <X className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} /> : <Plus className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />}
                <span className="min-w-0 max-w-full break-words leading-tight">{en ? "Add" : "Shto"}</span>
              </button>
            )}
          </nav>
        </aside>
      )}

      <div className="min-w-0 px-3 pb-28 pt-4 sm:px-5 lg:px-8">
        {canEdit && addOpen && catalogListing && (
          <div
            className="mb-6 rounded-2xl border p-4 sm:p-5"
            style={{ borderColor: "var(--border-soft)", background: "var(--surface-page)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="!text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>
                {en ? "Add a category & item" : "Shto kategori & artikull"}
              </h2>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
                aria-label={en ? "Close" : "Mbyll"}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-4 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
              {en
                ? "Add a category, then the items under it. Categories can be renamed or deleted at any time."
                : "Shto një kategori, pastaj artikujt poshtë saj. Kategoritë mund të riemërtohen ose fshihen në çdo kohë."}
            </p>
            <CatalogManager listing={catalogListing} embedded />
          </div>
        )}

        {hasSidebar && (
          <h2 className="mb-1 !text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>
            {active.label}
          </h2>
        )}

        <ul className="lg:grid lg:grid-cols-2 lg:gap-x-10">
          {active.items.map((product) => {
            const qty = cartQtyById[product._id] || 0;
            return (
              <li key={product._id} className="flex gap-3 border-b py-3.5 last:border-b-0" style={{ borderColor: "var(--border-soft)" }}>
                <div
                  className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl sm:h-[100px] sm:w-[100px]"
                  style={{ background: "var(--surface-subtle)" }}
                >
                  {product.image ? (
                    <SafeImage src={product.image} alt={product.name} fill sizes="100px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {(() => {
                        const Icon = sectionIcon(active.label, food, FallbackIcon);
                        return <Icon className="h-8 w-8" style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />;
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-[15px] font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
                    {product.name}
                  </p>
                  {product.description && (
                    <div className="mt-0.5">
                      <ExpandableText
                        text={product.description}
                        className="text-[12.5px] leading-[1.4]"
                        style={{ color: "var(--text-secondary)" }}
                      />
                    </div>
                  )}
                  {product.estimatedTime && (
                    <span className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: "var(--text-tertiary)" }}>
                      <Clock className="h-3 w-3" />
                      {product.estimatedTime}
                    </span>
                  )}

                  {/* Wraps on a narrow phone (price above the button) rather than pushing the
                      button past the edge of the screen. */}
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-x-2 gap-y-2 pt-2">
                    {typeof product.price === "number" ? (
                      <span className="text-[14.5px] font-bold leading-tight" style={{ color: accent }}>
                        <span className="whitespace-nowrap">{formatPrice(product.price)}</span>
                        {copy.perNight && (
                          <span className="whitespace-nowrap text-[11.5px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                            {" "}
                            {en ? "/ night" : "/ natë"}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span />
                    )}

                    {qty > 0 ? (
                      <div className="inline-flex h-8 items-center rounded-lg border bg-white" style={{ borderColor: accent }}>
                        <button
                          type="button"
                          onClick={() => setCartQty(listingSlug, product._id, qty - 1)}
                          aria-label={en ? "Decrease quantity" : "Zvogëlo sasinë"}
                          className="flex h-full min-h-0 w-7 items-center justify-center active:scale-90"
                          style={{ color: accent }}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-5 text-center text-[13.5px] font-bold" style={{ color: "var(--text-primary)" }}>
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdd(product, true)}
                          aria-label={en ? "Increase quantity" : "Shto sasinë"}
                          className="flex h-full min-h-0 w-7 items-center justify-center active:scale-90"
                          style={{ color: accent }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(product)}
                        className="inline-flex h-8 min-h-0 shrink-0 items-center gap-1 rounded-lg border bg-white px-3 text-[13px] font-semibold transition-colors active:scale-95 hover:bg-[var(--brand-light)]"
                        style={{ borderColor: accent, color: accent }}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        {copy.add[lang]}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
