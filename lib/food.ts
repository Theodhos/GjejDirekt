import { getCategoryByValue } from "@/lib/constants";
import { normalizeText } from "@/lib/listing-display";

/**
 * Helpers for the Ushqim & Pije vertical — every food subcategory (restaurants,
 * crêperies, fast food, pizza, cafés, bakeries, catering...) shares one business
 * page, so what only food needs lives here. The generic listing helpers (search,
 * opening hours, address) are in lib/listing-display.ts.
 */

export const FOOD_CATEGORY = "ushqim-pije";

/** True for the canonical value and every legacy alias ("restorante", "food", ...). */
export function isFoodCategory(value?: string) {
  return getCategoryByValue(value)?.value === FOOD_CATEGORY;
}

export function isFoodListing(listing?: { category?: string }) {
  return isFoodCategory(listing?.category);
}

/**
 * "Restorant · Burger": the kind of place, then the cuisine when the owner filled
 * one in. The taxonomy stores "Restorante" (plural, it names the subcategory), so
 * that one is singularised here to read as a description of a single business.
 */
export function foodTypeParts(
  listing: { subcategory?: string; cuisines?: string[] },
  subcategoryLabel: string,
  language: string
) {
  const single = /^restorante?$/i.test(subcategoryLabel.trim())
    ? language === "en"
      ? "Restaurant"
      : "Restorant"
    : subcategoryLabel;
  const cuisine = (listing.cuisines || []).map((item) => String(item).trim()).find(Boolean);
  return [single, cuisine && normalizeText(cuisine) !== normalizeText(single) ? cuisine : ""].filter(Boolean);
}

/**
 * Whether the business does more than a plain walk-in menu: catering, delivery,
 * take-away or table booking. Only explicit signals count — every food listing
 * inherits "rezervim" from its category by default, so that alone says nothing.
 */
export function offersFoodServices(listing: { subcategory?: string; tags?: string[]; actions?: string[] }) {
  if (normalizeText(listing.subcategory).includes("catering") || normalizeText(listing.subcategory).includes("katering")) return true;
  if ((listing.actions || []).includes("rezervim")) return true;
  return (listing.tags || []).some((tag) => /d[eë]rges|delivery|merr me vete|takeaway|rezerv|catering|katering/i.test(String(tag)));
}
