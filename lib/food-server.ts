import Product from "@/models/Product";

/** One product/service/room/dish of a business, as much of it as a search result needs. */
export type MenuItem = {
  /** Product id — what the catalog page is asked to show. */
  id: string;
  /** Title. */
  n: string;
  /** Description, shortened. */
  d?: string;
  /** The section it sits in ("Krepë të ëmbël", "Veshje Burrash"...). */
  s?: string;
  /** Price. */
  p?: number;
  /** Photo. */
  i?: string;
  /** "porosi" (ordered) or "rezervim" (booked) when the owner set it per item. */
  a?: "porosi" | "rezervim";
  /** Prep time or appointment length ("15 min"). */
  t?: string;
};

const MAX_ITEMS_PER_LISTING = 60;
const MAX_DESCRIPTION = 200;

/**
 * Attaches what each business offers — every product, dish, room or service with its
 * title, description, section, price, photo and action — as `menuItems`, so a search for
 * "burger" or "dhomë dyshe" finds the business even when its own name and text say
 * nothing about it, and can show the matching item itself as a result. Works for every
 * category (only businesses that have products get the field). Call it after connectDB()
 * and before serializing.
 */
export async function withMenuTerms<T extends object>(listings: T[]): Promise<(T & { menuItems?: MenuItem[] })[]> {
  // Callers hold lean Mongo documents (or the ranking helpers' narrower view of them),
  // so the one field read here is asserted rather than demanded of every caller.
  const rows = listings as (T & { _id?: unknown })[];
  const ids = rows.map((listing) => listing._id).filter(Boolean);
  if (!ids.length) return listings;

  const products = await Product.find({ listing: { $in: ids }, available: true })
    .sort({ order: 1, createdAt: 1 })
    .select("listing name description menuCategory price image action estimatedTime")
    .lean<any[]>();

  const itemsByListing = new Map<string, MenuItem[]>();
  for (const product of products) {
    if (!product.name) continue;
    const key = String(product.listing);
    const items = itemsByListing.get(key) ?? [];
    // A cap keeps the payload sane for businesses with very long menus.
    if (items.length < MAX_ITEMS_PER_LISTING) {
      const description = String(product.description || "").trim().slice(0, MAX_DESCRIPTION);
      const section = String(product.menuCategory || "").trim();
      const price = Number(product.price);
      const image = String(product.image || "").trim();
      const action = product.action === "porosi" || product.action === "rezervim" ? product.action : undefined;
      const time = String(product.estimatedTime || "").trim();
      items.push({
        id: String(product._id),
        n: String(product.name),
        ...(description && { d: description }),
        ...(section && { s: section }),
        ...(Number.isFinite(price) && price > 0 && { p: price }),
        ...(image && { i: image }),
        ...(action && { a: action }),
        ...(time && { t: time })
      });
    }
    itemsByListing.set(key, items);
  }

  return rows.map((listing) => {
    const items = itemsByListing.get(String(listing._id));
    return items?.length ? { ...listing, menuItems: items } : listing;
  });
}
