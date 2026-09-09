import { formatPrice } from "@/lib/pricing";

/**
 * The food-ordering cart, scoped per business.
 *
 * A visitor only ever orders from one restaurant/creperi at a time — the whole
 * flow ends in a single WhatsApp chat with that business's number — so the cart
 * is keyed by listing slug rather than being one global basket. Persisted in
 * localStorage: there is no server-side order, WhatsApp *is* the checkout.
 */

const STORAGE_PREFIX = "gjejdirekt:cart:";
const CART_EVENT = "cart-changed";

export type CartItem = {
  productId: string;
  name: string;
  price?: number;
  qty: number;
};

function storageKey(listingSlug: string) {
  return `${STORAGE_PREFIX}${listingSlug}`;
}

export function readCart(listingSlug: string): CartItem[] {
  if (typeof window === "undefined" || !listingSlug) return [];
  try {
    const raw = window.localStorage.getItem(storageKey(listingSlug));
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is CartItem => Boolean(item?.productId && item?.name && item?.qty > 0));
  } catch {
    return [];
  }
}

function writeCart(listingSlug: string, items: CartItem[]) {
  try {
    if (items.length) {
      window.localStorage.setItem(storageKey(listingSlug), JSON.stringify(items));
    } else {
      window.localStorage.removeItem(storageKey(listingSlug));
    }
    window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: { listingSlug } }));
  } catch {
    // Private mode or a full quota — the cart is a convenience, never a blocker.
  }
}

/** Adds `qty` of a product to the cart, merging into any existing line for it. */
export function addToCart(listingSlug: string, item: { productId: string; name: string; price?: number }, qty = 1) {
  if (typeof window === "undefined" || !listingSlug || qty <= 0) return;
  const items = readCart(listingSlug);
  const existing = items.find((line) => line.productId === item.productId);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ productId: item.productId, name: item.name, price: item.price, qty });
  }
  writeCart(listingSlug, items);
}

export function setCartQty(listingSlug: string, productId: string, qty: number) {
  if (typeof window === "undefined" || !listingSlug) return;
  const items = readCart(listingSlug);
  const next = qty <= 0
    ? items.filter((line) => line.productId !== productId)
    : items.map((line) => (line.productId === productId ? { ...line, qty } : line));
  writeCart(listingSlug, next);
}

export function removeFromCart(listingSlug: string, productId: string) {
  setCartQty(listingSlug, productId, 0);
}

export function clearCart(listingSlug: string) {
  if (typeof window === "undefined" || !listingSlug) return;
  writeCart(listingSlug, []);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0);
}

/** Subscribe to cart changes (this tab's writes and other tabs' via `storage`). */
export function onCartChange(listener: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => listener();
  window.addEventListener(CART_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CART_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/**
 * Builds the order text sent to the business's WhatsApp: one line per item with
 * quantity and price, plus a total when every line carries a price.
 */
export function buildOrderMessage(businessName: string, items: CartItem[], language: "al" | "en" = "al") {
  const lines = items.map((item) => {
    const priceText = item.price ? ` – ${formatPrice(item.price * item.qty)}` : "";
    return `• ${item.qty}x ${item.name}${priceText}`;
  });

  const hasAllPrices = items.every((item) => typeof item.price === "number");
  const total = hasAllPrices ? cartTotal(items) : null;

  if (language === "en") {
    const parts = [`Hello, I would like to order from ${businessName} (GjejDirekt):`, "", ...lines];
    if (total !== null) parts.push("", `Total: ${formatPrice(total)}`);
    return parts.join("\n");
  }

  const parts = [`Përshëndetje, dua të porosis nga ${businessName} (GjejDirekt):`, "", ...lines];
  if (total !== null) parts.push("", `Totali: ${formatPrice(total)}`);
  return parts.join("\n");
}

export function buildOrderWhatsappHref(phoneDigits: string, businessName: string, items: CartItem[], language: "al" | "en" = "al") {
  if (!phoneDigits || !items.length) return "";
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(buildOrderMessage(businessName, items, language))}`;
}
