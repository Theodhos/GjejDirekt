/**
 * Local record of the businesses a visitor has messaged.
 *
 * GjejDirekt hands the order off to WhatsApp, so the platform never sees the
 * conversation and there is nothing server-side to list under "Porositë". Keeping
 * the tap in localStorage gives people a usable history today; when real orders
 * exist, this becomes the offline fallback rather than the only source.
 */

const STORAGE_KEY = "gjejdirekt:order-history";
const MAX_ENTRIES = 40;

export type OrderHistoryEntry = {
  slug: string;
  title: string;
  image?: string;
  location?: string;
  category?: string;
  /** Epoch millis of the most recent contact. */
  at: number;
};

export function readOrderHistory(): OrderHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry): entry is OrderHistoryEntry => Boolean(entry?.slug && entry?.title))
      .sort((a, b) => b.at - a.at);
  } catch {
    return [];
  }
}

/** Records a contact, collapsing repeat taps on the same business into one entry. */
export function recordOrderContact(listing: any) {
  if (typeof window === "undefined" || !listing?.slug) return;
  try {
    const entry: OrderHistoryEntry = {
      slug: String(listing.slug),
      title: String(listing.title || listing.slug),
      image: listing.images?.[0] || listing.photos?.[0] || listing.bannerImage || undefined,
      location: listing.location || undefined,
      category: listing.category || undefined,
      at: Date.now()
    };
    const next = [entry, ...readOrderHistory().filter((item) => item.slug !== entry.slug)].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("order-history-changed"));
  } catch {
    // Private mode or a full quota — the history is a convenience, never a blocker.
  }
}

export function clearOrderHistory() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("order-history-changed"));
  } catch {}
}
