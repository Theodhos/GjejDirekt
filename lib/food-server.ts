import Product from "@/models/Product";
import { isFoodListing } from "@/lib/food";

/**
 * Attaches the names of each food business's menu items (and the sections they
 * sit in) as `menuTerms`, so the results page can search by dish — "burger" finds
 * the places that serve one even when the name says nothing about it. Call it
 * after connectDB() and before serializing; non-food listings are left alone.
 */
export async function withMenuTerms<T extends object>(listings: T[]): Promise<(T & { menuTerms?: string[] })[]> {
  // Callers hold lean Mongo documents (or the ranking helpers' narrower view of them),
  // so the two fields read here are asserted rather than demanded of every caller.
  const rows = listings as (T & { _id?: unknown; category?: string })[];
  const foodIds = rows.filter(isFoodListing).map((listing) => listing._id);
  if (!foodIds.length) return listings;

  const products = await Product.find({ listing: { $in: foodIds }, available: true })
    .select("listing name menuCategory")
    .lean<any[]>();

  const termsByListing = new Map<string, Set<string>>();
  for (const product of products) {
    const key = String(product.listing);
    const terms = termsByListing.get(key) ?? new Set<string>();
    // A cap keeps the payload sane for businesses with very long menus.
    if (terms.size < 80) {
      if (product.name) terms.add(String(product.name));
      if (product.menuCategory) terms.add(String(product.menuCategory));
    }
    termsByListing.set(key, terms);
  }

  return rows.map((listing) => {
    const terms = termsByListing.get(String(listing._id));
    return terms?.size ? { ...listing, menuTerms: Array.from(terms) } : listing;
  });
}
