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
  image?: string;
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
export function addToCart(
  listingSlug: string,
  item: { productId: string; name: string; price?: number; image?: string },
  qty = 1
) {
  if (typeof window === "undefined" || !listingSlug || qty <= 0) return;
  const items = readCart(listingSlug);
  const existing = items.find((line) => line.productId === item.productId);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ productId: item.productId, name: item.name, price: item.price, image: item.image, qty });
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

export type OrderDetails = {
  /** Business address/city shown under its name, e.g. "Bllok, Rr. Brigada e VIII, Tiranë". */
  location?: string;
  /** Human-formatted phone, e.g. "+355 69 123 4567" (falls back to raw digits when absent). */
  phone?: string;
  /** Free-text note from the customer — order instructions or special requests. */
  note?: string;
  isHotel?: boolean;
  checkIn?: string;
  checkOut?: string;
  persons?: number;
  /** Who's ordering/booking — this is what the business needs, not their own name. */
  customerName?: string;
  /** Delivery address for an order, or just contact info for a reservation. */
  customerAddress?: string;
  /** "Kesh në dorë", "Kartë (POS) në dorë", "Transfertë bankare"... */
  paymentMethod?: string;
};

const SEPARATOR = "━".repeat(20);

/**
 * Builds the order text sent to the business's WhatsApp — a plain, receipt-style
 * recap addressed to the business, so it leads with who is ordering and where
 * to deliver (not the business's own name back at itself), then the items,
 * an estimate, any note, and how they intend to pay.
 */
export function buildOrderMessage(
  businessName: string,
  items: CartItem[],
  language: "al" | "en" = "al",
  details: OrderDetails = {}
) {
  const en = language === "en";
  const hasAllPrices = items.every((item) => typeof item.price === "number");
  const total = hasAllPrices ? cartTotal(items) : null;
  const nightSuffix = details.isHotel ? (en ? "/night" : "/natë") : "";

  const parts = [SEPARATOR];
  parts.push(`👤 ${en ? "CUSTOMER" : "KLIENTI"}: ${details.customerName?.trim() || (en ? "Not provided" : "Pa emër")}`);
  if (details.customerAddress?.trim()) {
    parts.push(`📍 ${en ? "ADDRESS" : "ADRESA"}: ${details.customerAddress.trim()}`);
  }
  parts.push(SEPARATOR, "");

  if (details.isHotel) {
    parts.push(`🛏️ ${en ? "RESERVATION" : "REZERVIMI"}:`);
    for (const item of items) {
      const price = typeof item.price === "number" ? ` - ${formatPrice(item.price * item.qty)}${nightSuffix}` : "";
      parts.push(`• ${item.qty}x ${item.name}${price}`);
    }
    if (details.checkIn) parts.push(`• ${en ? "Check-in" : "Check-in"}: ${details.checkIn}`);
    if (details.checkOut) parts.push(`• ${en ? "Check-out" : "Check-out"}: ${details.checkOut}`);
    if (details.persons) parts.push(`• ${en ? "Guests" : "Persona"}: ${details.persons}`);
  } else {
    parts.push(`🛒 ${en ? "ITEMS" : "ARTIKUJT"}:`);
    for (const item of items) {
      const price = typeof item.price === "number" ? ` - ${formatPrice(item.price * item.qty)}` : "";
      parts.push(`• ${item.qty}x ${item.name}${price}`);
    }
  }

  parts.push("");
  parts.push(
    details.isHotel
      ? `⏱️ ${en ? "CONFIRMATION" : "KONFIRMIMI"}: ${en ? "within 24h" : "brenda 24 orësh"}`
      : `⏱️ ${en ? "WAIT" : "PRITJA"}: ~20-30 min`
  );
  if (details.note?.trim()) {
    parts.push(`💬 ${en ? "NOTE" : "SHËNIM"}: ${details.note.trim()}`);
  }

  parts.push(SEPARATOR);
  if (total !== null) parts.push(`💰 ${en ? "TOTAL" : "TOTALI"}: ${formatPrice(total)}`);
  parts.push(`💳 ${en ? "PAYMENT" : "PAGESA"}: ${details.paymentMethod || (en ? "Cash on delivery" : "Kesh në dorë")}`);

  return parts.join("\n");
}

export function buildOrderWhatsappHref(
  phoneDigits: string,
  businessName: string,
  items: CartItem[],
  language: "al" | "en" = "al",
  details: OrderDetails = {}
) {
  if (!phoneDigits || !items.length) return "";
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(buildOrderMessage(businessName, items, language, details))}`;
}
