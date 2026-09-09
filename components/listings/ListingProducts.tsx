"use client";

import { useMemo, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { ChevronDown, ChevronUp, Plus, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/pricing";
import { addToCart } from "@/lib/cart";

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
  products
}: {
  listingSlug: string;
  products: ListingProduct[];
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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

  const handleAdd = (product: ListingProduct) => {
    addToCart(listingSlug, { productId: product._id, name: product.name, price: product.price }, 1);
    toast.success(en ? `Added ${product.name} to your order` : `${product.name} u shtua në porosinë tuaj`);
  };

  const toggleCollapsed = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}>
      <div className="mb-4 flex items-center gap-2.5">
        <UtensilsCrossed className="h-5 w-5" style={{ color: "var(--brand-accent)" }} />
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          {en ? "Menu" : "Menuja"}
        </h2>
      </div>

      {isGrouped && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <button
            type="button"
            onClick={() => setActiveTab(ALL_TAB)}
            className="shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors"
            style={
              activeTab === ALL_TAB
                ? { background: "var(--brand-accent)", color: "#fff" }
                : { background: "var(--surface-cream)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)" }
            }
          >
            {en ? "All" : "Të gjitha"}
          </button>
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveTab(section.key)}
              className="shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors"
              style={
                activeTab === section.key
                  ? { background: "var(--brand-accent)", color: "#fff" }
                  : { background: "var(--surface-cream)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)" }
              }
            >
              {section.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6">
        {visibleSections.map((section) => (
          <div key={section.key}>
            {isGrouped && (
              <button
                type="button"
                onClick={() => toggleCollapsed(section.key)}
                className="mb-3 flex w-full items-center justify-between gap-2 text-left"
              >
                <span className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" style={{ color: "var(--brand-accent)" }} />
                  <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
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
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {section.items.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col overflow-hidden rounded-xl"
                    style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)" }}
                  >
                    <div className="relative aspect-[4/3] w-full shrink-0" style={{ background: "var(--surface-cream)" }}>
                      {product.image ? (
                        <SafeImage src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <UtensilsCrossed className="h-7 w-7" style={{ color: "var(--text-tertiary)" }} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-3">
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {product.description}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
                        {typeof product.price === "number" ? (
                          <span className="text-sm font-bold" style={{ color: "var(--brand-accent)" }}>
                            {formatPrice(product.price)}
                          </span>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          onClick={() => handleAdd(product)}
                          className="flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11px] font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
                          style={{ background: "var(--brand-accent)" }}
                        >
                          <Plus className="h-3 w-3" />
                          {en ? "Add" : "Shto"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
