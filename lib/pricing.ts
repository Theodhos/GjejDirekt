import type { Language } from "@/lib/dictionary";

/** Every listing on the platform is priced in euro — no other currency is offered. */
export const PRICE_CURRENCY = "€";

export type PriceUnit = "person" | "night" | "kg";

/** Stays are sold per night, local products per kilogram, everything else per person. */
const CATEGORY_PRICE_UNIT: Record<string, PriceUnit> = {
  akomodim: "night",
  "produkte-lokale": "kg"
};

const UNIT_LABEL: Record<Language, Record<PriceUnit, string>> = {
  al: { person: "person", night: "natë", kg: "kg" },
  en: { person: "person", night: "night", kg: "kg" }
};

/** Label used wherever a price is announced — listings only ever show a starting price. */
const FROM_LABEL: Record<Language, string> = { al: "Nga çmimi", en: "From price" };
const FROM_SHORT: Record<Language, string> = { al: "Nga", en: "From" };

export function getPriceUnit(category?: string | null): PriceUnit {
  return CATEGORY_PRICE_UNIT[category || ""] || "person";
}

/** "person" · "natë" · "kg" */
export function priceUnitLabel(category: string | undefined | null, language: Language) {
  return UNIT_LABEL[language][getPriceUnit(category)];
}

/** "€/person" — the unit shown next to every price and price field. */
export function priceUnitSuffix(category: string | undefined | null, language: Language) {
  return `${PRICE_CURRENCY}/${priceUnitLabel(category, language)}`;
}

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

/** "€50/natë" */
export function formatStartingPrice(
  value: number,
  category: string | undefined | null,
  language: Language
) {
  return `${PRICE_CURRENCY}${value}/${priceUnitLabel(category, language)}`;
}
