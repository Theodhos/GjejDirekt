"use client";

import { useEffect, useMemo, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { ChevronDown, ChevronUp, Minus, Plus, UtensilsCrossed, BedDouble, Pizza, Coffee, GlassWater, Hash } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/pricing";
import { addToCart, onCartChange, readCart, setCartQty } from "@/lib/cart";

export type ListingProduct = {
  _id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  /** Menu section the owner grouped this item under, e.g. "Krepë të ëmbël". */
  menuCategory?: string;
};

const ALL_TAB = "__all__";
const UNCATEGORIZED = "__uncategorized__";

/**
 * The business's menu on the public listing page. Items are grouped into
 * collapsible sections by `menuCategory` (with a "Të gjitha" tab to filter to
 * one section), matching how delivery-app menus are browsed. Listings that
 * haven't grouped their items yet just get one flat, unlabeled grid.
 */
export default function ListingProducts({
  listingSlug,
  products,
  isShopping = false
}: {
  listingSlug: string;
  products: ListingProduct[];
  isShopping?: boolean;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [cartQtyById, setCartQtyById] = useState<Record<string, number>>({});

  // Mirrors the cart so items already added show a live -/qty/+ control instead of "+ Shto".
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

  if (!products.length) return null;

  const isGrouped = sections.length > 1 || (sections.length === 1 && sections[0].key !== UNCATEGORIZED);
  const visibleSections = activeTab === ALL_TAB ? sections : sections.filter((s) => s.key === activeTab);

  const handleAdd = (product: ListingProduct, opts?: { silent?: boolean }) => {
    addToCart(listingSlug, { productId: product._id, name: product.name, price: product.price, image: product.image }, 1);
    if (!opts?.silent) {
      toast.success(en ? `Added ${product.name} to your order` : `${product.name} u shtua në porosinë tuaj`);
    }
  };

  const handleDecrement = (product: ListingProduct) => {
    setCartQty(listingSlug, product._id, (cartQtyById[product._id] || 0) - 1);
  };

  const toggleCollapsed = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getSectionIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("dhom") || l.includes("room") || l.includes("suit")) return BedDouble;
    if (l.includes("pije") || l.includes("drink")) return GlassWater;
    if (l.includes("embel") || l.includes("ëmbël") || l.includes("sweet")) return Coffee;
    if (l.includes("krip") || l.includes("savor") || l.includes("pizza") || l.includes("ushqim") || l.includes("food")) return Pizza;
    return Hash;
  };

  return (
    <div className="mt-4">

      {isGrouped && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <button
            type="button"
            onClick={() => setActiveTab(ALL_TAB)}
            className="shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
            style={
              activeTab === ALL_TAB
                ? { background: "var(--brand-accent)", color: "#fff" }
                : { background: "var(--surface-cream)", color: "var(--text-primary)" }
            }
          >
            {en ? "All" : "Të gjitha"}
          </button>
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveTab(section.key)}
              className="shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors"
              style={
                activeTab === section.key
                  ? { background: "var(--brand-accent)", color: "#fff" }
                  : { background: "var(--surface-cream)", color: "var(--text-primary)" }
            }
          >

              {section.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {visibleSections.map((section) => {
          const SectionIcon = getSectionIcon(section.label);
          return (
          <div key={section.key}>
            {isGrouped && (
              <button
                type="button"
                onClick={() => toggleCollapsed(section.key)}
                className="mb-4 flex w-full items-center justify-between gap-2 text-left"
              >
                <span className="flex items-center gap-2.5">
                  <SectionIcon className="h-5 w-5" style={{ color: "var(--text-tertiary)" }} />
                  <span className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                    {section.label}
                  </span>
                </span>
                {collapsed[section.key] ? (
                  <ChevronDown className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                ) : (
                  <ChevronUp className="h-4 w-4" style={{ color: "var(--text-tertiary)" }} />
                )}
              </button>
            )}

            {!collapsed[section.key] && (
              <div className={isShopping ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" : "space-y-2"}>
                {section.items.map((product) => (
                  <div
                    key={product._id}
                    className={isShopping ? "flex min-w-0 flex-col overflow-hidden rounded-xl" : "flex min-h-[96px] items-stretch gap-3 overflow-hidden rounded-xl"}
                    style={{ background: "var(--surface-white)", boxShadow: "var(--shadow-card)" }}
                  >
                    <div className={isShopping ? "relative aspect-[4/3] w-full shrink-0" : "relative my-2 ml-2 h-[80px] w-[86px] shrink-0 overflow-hidden rounded-lg"} style={{ background: "var(--surface-cream)" }}>
                      {product.image ? (
                        <SafeImage src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <SectionIcon className="h-8 w-8" style={{ color: "var(--text-tertiary)" }} />
                        </div>
                      )}
                    </div>

                    <div className={isShopping ? "flex min-w-0 flex-1 flex-col p-2.5" : "flex min-w-0 flex-1 flex-col justify-center py-2.5 pr-2.5"}>
                      <p className="text-[13px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-[1.35]" style={{ color: "var(--text-secondary)" }}>
                          {product.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-2 pt-1.5">
                        {typeof product.price === "number" ? (
                          <span className="text-sm font-bold" style={{ color: "var(--brand-accent)" }}>
                            {formatPrice(product.price)}
                          </span>
                        ) : (
                          <span />
                        )}

                        {cartQtyById[product._id] ? (
                          <div className="flex items-center gap-1 rounded-lg" style={{ background: "var(--surface-cream)" }}>
                            <button
                              type="button"
                              onClick={() => handleDecrement(product)}
                              aria-label={en ? "Decrease quantity" : "Zvogëlo sasinë"}
                              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-200 active:scale-95"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-4 text-center text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
                              {cartQtyById[product._id]}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAdd(product, { silent: true })}
                              aria-label={en ? "Increase quantity" : "Shto sasinë"}
                              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-neutral-200 active:scale-95"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdd(product)}
                            className="flex h-8 items-center gap-1 rounded-lg px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
                            style={{ background: "var(--brand-accent)" }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            {SectionIcon === BedDouble ? (en ? "Add room" : "Shto rezervim") : (en ? "Add" : "Shto")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
