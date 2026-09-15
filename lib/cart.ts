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
};

/**
 * Right-aligns a set of {left, right} rows into a receipt-style block by
 * padding every line to the same two column widths (capping the left column
 * so one long item name can't stretch the whole block). Meant to be wrapped
 * in a ``` fenced block — WhatsApp only keeps column alignment on monospace text.
 */
function formatReceiptLines(rows: { left: string; right: string }[]) {
  const leftWidth = Math.min(26, Math.max(...rows.map((r) => r.left.length)));
  const rightWidth = Math.max(1, ...rows.map((r) => r.right.length));
  return rows.map((row) => {
    const left =
      row.left.length > leftWidth ? `${row.left.slice(0, leftWidth - 1)}…` : row.left.padEnd(leftWidth, " ");
    return `${left} ${row.right.padStart(rightWidth, " ")}`;
  });
}

/**
 * Builds the order text sent to the business's WhatsApp: a header with the
 * business's contact details, then a monospace "receipt" block (one row per
 * item, a divider, the total) so it reads as a structured order recap in the
 * chat — WhatsApp text only supports bold, emoji and monospace, not real
 * cards or inline images, so this is the closest a plain wa.me link message can get.
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

  const rows: { left: string; right: string }[] = items.map((item) => ({
    left: `${item.qty}x ${item.name}`,
    right: typeof item.price === "number" ? `${formatPrice(item.price * item.qty)}${nightSuffix}` : ""
  }));

  if (details.isHotel) {
    if (details.checkIn) rows.push({ left: "Check-in", right: details.checkIn });
    if (details.checkOut) rows.push({ left: "Check-out", right: details.checkOut });
    if (details.persons) rows.push({ left: en ? "Guests" : "Persona", right: String(details.persons) });
  }

  const totalRowIndex = rows.length;
  if (total !== null) rows.push({ left: en ? "TOTAL" : "TOTALI", right: formatPrice(total) });

  const receiptLines = formatReceiptLines(rows);
  if (total !== null) {
    const width = receiptLines[0]?.length ?? 0;
    receiptLines.splice(totalRowIndex, 0, "─".repeat(width));
  }

  const parts = [
    details.isHotel
      ? en ? `📋 *RESERVATION FROM GJEJDIREKT.COM*` : `📋 *REZERVIM NGA GJEJDIREKT.COM*`
      : en ? `📋 *ORDER FROM GJEJDIREKT.COM*` : `📋 *POROSI NGA GJEJDIREKT.COM*`,
    "",
    `*${businessName}*`
  ];
  if (details.location) parts.push(`📍 ${details.location}`);
  if (details.phone) parts.push(`📞 ${details.phone}`);

  parts.push(
    "",
    details.isHotel ? (en ? `🛏️ *YOUR RESERVATION*` : `🛏️ *REZERVIMI JUAJ*`) : (en ? `🛒 *YOUR ORDER*` : `🛒 *POROSIA JUAJ*`),
    "```",
    ...receiptLines,
    "```"
  );

  if (details.note?.trim()) {
    const noteLabel = details.isHotel
      ? en ? `📝 *Special request:*` : `📝 *Kërkesë speciale:*`
      : en ? `📝 *Order note:*` : `📝 *Shënim për porosinë:*`;
    parts.push("", noteLabel, details.note.trim());
  }

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
