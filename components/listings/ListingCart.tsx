"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingBag, Trash2, X, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/pricing";
import {
  type CartItem,
  readCart,
  setCartQty,
  removeFromCart,
  clearCart,
  cartCount,
  cartTotal,
  onCartChange,
  buildOrderWhatsappHref
} from "@/lib/cart";
import { recordOrderContact } from "@/lib/order-history";

/**
 * The floating order basket for a business's menu (see ListingProducts). Every
 * add-to-cart tap anywhere on the page lands here; "Send order" hands the whole
 * basket to WhatsApp as one message, then clears it — WhatsApp is the checkout,
 * there is no server-side order.
 */
export default function ListingCart({
  listingSlug,
  listingId,
  businessName,
  phoneDigits,
  listing
}: {
  listingSlug: string;
  listingId?: string;
  businessName: string;
  phoneDigits: string;
  listing?: { slug: string; title: string; images?: string[]; location?: string; category?: string };
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setItems(readCart(listingSlug));
    return onCartChange(() => setItems(readCart(listingSlug)));
  }, [listingSlug]);

  if (!items.length) return null;

  const count = cartCount(items);
  const total = cartTotal(items);
  const hasAllPrices = items.every((item) => typeof item.price === "number");
  const whatsappHref = buildOrderWhatsappHref(phoneDigits, businessName, items, language);

  const handleSend = () => {
    if (listingId) {
      fetch(`/api/listings/${listingId}/whatsapp-click`, { method: "POST", keepalive: true }).catch(() => {});
    }
    if (listing) recordOrderContact(listing);
    clearCart(listingSlug);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed inset-x-4 z-40 flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left shadow-lg transition-transform active:scale-[0.98] bottom-[calc(var(--bottom-nav-height)+84px)] sm:inset-x-auto sm:right-6 sm:w-[22rem] lg:bottom-6"
        style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={{ background: "var(--brand-light)" }}
          >
            <ShoppingBag className="h-5 w-5" style={{ color: "var(--brand-accent)" }} />
            <span
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white"
              style={{ background: "var(--brand-accent)" }}
            >
              {count}
            </span>
          </span>
          <span className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {count} {en ? "items" : "artikuj"}
            {hasAllPrices ? ` • ${formatPrice(total)}` : ""}
          </span>
        </span>

        <span className="flex shrink-0 items-center gap-0.5 text-sm font-bold" style={{ color: "var(--brand-accent)" }}>
          {en ? "View order" : "Shiko kërkesën"}
          <ChevronRight className="h-4 w-4" />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          // Leaves room for the fixed mobile tab bar so the "Send order" button
          // at the bottom of the card doesn't end up rendered underneath it.
          style={{ background: "rgba(15,23,42,0.55)", paddingBottom: "var(--bottom-nav-height)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl sm:rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ background: "var(--surface-white)", boxShadow: "var(--shadow-card)", maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid var(--border-soft)" }}
            >
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {en ? "Your order" : "Porosia juaj"}
              </h3>
              <button type="button" onClick={() => setOpen(false)} style={{ color: "var(--text-tertiary)" }}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto px-5 py-4" style={{ maxHeight: "50vh" }}>
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.name}
                    </p>
                    {typeof item.price === "number" && (
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        {formatPrice(item.price)} × {item.qty}
                      </p>
                    )}
                  </div>

                  <div
                    className="flex items-center rounded-lg"
                    style={{ border: "1px solid var(--border-medium)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setCartQty(listingSlug, item.productId, item.qty - 1)}
                      className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-neutral-100"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCartQty(listingSlug, item.productId, item.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-neutral-100"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(listingSlug, item.productId)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
                    style={{ color: "var(--text-tertiary)" }}
                    aria-label={en ? "Remove" : "Hiq"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-5 pb-5 pt-3" style={{ borderTop: "1px solid var(--border-soft)" }}>
              {hasAllPrices && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {en ? "Total" : "Totali"}
                  </span>
                  <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    {formatPrice(total)}
                  </span>
                </div>
              )}

              {phoneDigits ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleSend}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
                  style={{ background: "var(--whatsapp-green)", boxShadow: "0 2px 8px rgba(37,211,102,0.22)" }}
                >
                  <MessageCircle className="h-4 w-4" />
                  {en ? "Send order on WhatsApp" : "Dërgo porosinë në WhatsApp"}
                </a>
              ) : (
                <p className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {en ? "This business has no WhatsApp number." : "Ky biznes nuk ka numër WhatsApp."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
