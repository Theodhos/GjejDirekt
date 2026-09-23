import Product from "@/models/Product";

/** One product/service/room/dish of a business, as much of it as a search needs. */
export type MenuItem = {
  /** Title. */
  n: string;
  /** Description, shortened. */
  d?: string;
  /** The section it sits in ("Krepë të ëmbël", "Veshje Burrash"...). */
  s?: string;
};

const MAX_ITEMS_PER_LISTING = 60;
const MAX_DESCRIPTION = 200;

/**
 * Attaches what each business offers — the title and description of every product,
 * dish, room or service, and the section it sits in — as `menuItems`, so a search for
 * "burger" or "kemishe pambuku" finds the business even when its own name and text say
 * nothing about it. Works for every category (only businesses that have products get
 * the field). Call it after connectDB() and before serializing.
 */
export async function withMenuTerms<T extends object>(listings: T[]): Promise<(T & { menuItems?: MenuItem[] })[]> {
  // Callers hold lean Mongo documents (or the ranking helpers' narrower view of them),
  // so the one field read here is asserted rather than demanded of every caller.
  const rows = listings as (T & { _id?: unknown })[];
  const ids = rows.map((listing) => listing._id).filter(Boolean);
  if (!ids.length) return listings;

  const products = await Product.find({ listing: { $in: ids }, available: true })
    .sort({ order: 1, createdAt: 1 })
    .select("listing name description menuCategory")
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
      items.push({ n: String(product.name), ...(description && { d: description }), ...(section && { s: section }) });
    }
    itemsByListing.set(key, items);
  }

  return rows.map((listing) => {
    const items = itemsByListing.get(String(listing._id));
    return items?.length ? { ...listing, menuItems: items } : listing;
  });
}
