import type { Language } from "@/lib/dictionary";

/** Every listing on the platform is priced in euro — no other currency is offered. */
export const PRICE_CURRENCY = "€";

/** Label used wherever a price is announced — listings only ever show a starting price. */
const FROM_LABEL: Record<Language, string> = { al: "Nga çmimi", en: "From price" };
const FROM_SHORT: Record<Language, string> = { al: "Nga", en: "From" };

export function fromPriceLabel(language: Language) {
  return FROM_LABEL[language];
}

export function fromPriceShort(language: Language) {
  return FROM_SHORT[language];
}

/**
 * A listing advertises one number: the lowest price its owner entered. Older listings
 * may still carry a min/max pair, so the smaller of the two wins.
 */
export function startingPrice(listing: { priceFrom?: unknown; price?: unknown }): number | null {
  const values = [listing.priceFrom, listing.price]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);
  return values.length ? Math.min(...values) : null;
}

/** "€50" */
export function formatStartingPrice(value: number) {
  return `${PRICE_CURRENCY}${value}`;
}
