import { getCategoryLabel } from "@/lib/constants";
import { startingPrice } from "@/lib/pricing";

/**
 * What a product card needs to render. Products do not have their own collection
 * yet — see `productsFromListings` — so this type is the contract that lets the UI
 * be built now and the storage be added later without touching the components.
 */
export type ProductCardData = {
  id: string;
  name: string;
  /** Business the product belongs to, shown under the name. */
  businessName: string;
  /** Where the card links to — the business page for now. */
  href: string;
  price: number;
  image?: string;
};

/**
 * Derives product cards from listings that advertise a price.
 *
 * Businesses cannot publish individual products yet, so the priced listing itself
 * *is* the offer: its title is the product and its category tells people what kind
 * of business is selling it. When the Product collection lands, only this function
 * changes — every consumer keeps working against `ProductCardData`.
 */
export function productsFromListings(listings: any[], limit = 12): ProductCardData[] {
  return listings
    .map((listing): ProductCardData | null => {
      const price = startingPrice(listing);
      if (price === null) return null;
      return {
        id: String(listing._id || listing.id || listing.slug),
        name: listing.title,
        businessName: getCategoryLabel(listing.category) || listing.location || "",
        href: `/listings/${listing.slug}`,
        price,
        image: listing.images?.[0] || listing.photos?.[0] || listing.bannerImage || undefined
      };
    })
    .filter((product): product is ProductCardData => product !== null)
    .slice(0, limit);
}
