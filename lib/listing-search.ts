import type { MenuItem } from "./food-server";
import { hasToken, listingSearchFields, normalizeText, queryTokens } from "./listing-display";

/**
 * Free-text search over businesses AND what they sell, shared by every entry point
 * (the results page, the category pages, /api/listings) so they all find the same
 * things for the same words.
 *
 * Every word typed is a keyword. A result is the most specific thing the words fit:
 *
 * - the business itself, when its own text (name, city, category/subcategory and
 *   their aliases, description, tags) contains every word — "krepa", "hotel
 *   ambassador", "pizza tirane";
 * - otherwise each of its items whose title/description/section, together with the
 *   business's name and city, contains every word — "dhomë dyshe", "krepa me
 *   nutella", "dhoma dyshe pogradec" — shown as the item, with its price and button.
 *
 * Those are the full matches and come first, best match (words in the name) first,
 * otherwise in the order the list came in (paid tiers first). After them, so a search
 * never comes up empty when one word is off, come the near matches: anything that
 * contains at least half the words, as long as one of them says what the business
 * or item is and not only where it is (a word that hits just the city is never
 * enough on its own, or "pizza tirane" would list every business in Tiranë).
 */

export type BusinessHit = {
  kind: "business";
  listing: any;
  /** Every word matched. */
  full: boolean;
  /** Titles of the items that also contain the words — printed under the row. */
  matchedItems: string[];
};

export type ItemHit = {
  kind: "item";
  listing: any;
  item: MenuItem;
  full: boolean;
};

export type SearchHit = BusinessHit | ItemHit;

/** At most this many items of one business are shown as their own results. */
const MAX_ITEMS_PER_BUSINESS = 3;

export function itemSearchText(item: MenuItem) {
  return `${item.n} ${item.d || ""} ${item.s || ""}`;
}

function countTokens(normalizedText: string, tokens: string[]) {
  return tokens.filter((token) => hasToken(normalizedText, token)).length;
}

type Scored = { hit: SearchHit; matched: number; nameHits: number; index: number };

export function searchListings(listings: any[], query: string): SearchHit[] {
  const tokens = queryTokens(query);
  if (!tokens.length) {
    return listings.map((listing) => ({ kind: "business", listing, full: true, matchedItems: [] }));
  }

  const needed = tokens.length;
  const nearMin = Math.ceil(needed / 2);
  const scored: Scored[] = [];

  listings.forEach((listing, index) => {
    const { about, place } = listingSearchFields(listing);
    const aboutText = normalizeText(about);
    const placeText = normalizeText(place);
    const nameText = normalizeText(listing.title);
    const items: MenuItem[] = listing.menuItems || [];

    const businessAbout = tokens.filter((token) => hasToken(aboutText, token));
    const businessAny = tokens.filter((token) => businessAbout.includes(token) || hasToken(placeText, token));
    const businessFull = businessAny.length === needed;

    // The business itself fits every word: it is the result, and its matching items
    // are listed under it rather than repeated as results of their own.
    if (businessFull) {
      const matchedItems = items
        .map((item, position) => ({ item, position, score: countTokens(normalizeText(itemSearchText(item)), tokens) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || a.position - b.position)
        .slice(0, 2)
        .map((entry) => entry.item.n);
      scored.push({
        hit: { kind: "business", listing, full: true, matchedItems },
        matched: needed,
        nameHits: countTokens(nameText, tokens),
        index
      });
      return;
    }

    // Its items: each one is searched together with the business's name and city, so
    // "dhoma dyshe pogradec" finds the room of a hotel in Pogradec.
    const itemHits: Scored[] = [];
    items.forEach((item, position) => {
      const itemText = normalizeText(itemSearchText(item));
      const own = countTokens(itemText, tokens);
      if (!own) return;
      const matched = tokens.filter(
        (token) => hasToken(itemText, token) || hasToken(nameText, token) || hasToken(placeText, token)
      ).length;
      if (matched < nearMin) return;
      itemHits.push({
        hit: { kind: "item", listing, item, full: matched === needed },
        matched,
        nameHits: countTokens(normalizeText(item.n), tokens),
        index: index + position / 1000
      });
    });
    itemHits.sort(compareScored);
    const shownItems = itemHits.slice(0, MAX_ITEMS_PER_BUSINESS);
    scored.push(...shownItems);

    // A near match of the business itself — unless an item already fits every word,
    // in which case the item is the better answer and the row would only repeat it.
    const itemFull = shownItems.some((entry) => entry.hit.full);
    if (!itemFull && businessAbout.length > 0 && businessAny.length >= nearMin) {
      scored.push({
        hit: { kind: "business", listing, full: false, matchedItems: [] },
        matched: businessAny.length,
        nameHits: countTokens(nameText, tokens),
        index
      });
    }
  });

  return scored.sort(compareScored).map((entry) => entry.hit);
}

/** Full matches first, then more words matched, then the name, then the list's own order. */
function compareScored(a: Scored, b: Scored) {
  return (
    Number(b.hit.full) - Number(a.hit.full) ||
    b.matched - a.matched ||
    b.nameHits - a.nameHits ||
    a.index - b.index
  );
}

/**
 * The businesses a search finds, in result order and without repeats — for callers
 * that list businesses only (the API). A business whose item matched counts too.
 */
export function searchBusinesses(listings: any[], query: string): any[] {
  const seen = new Set<string>();
  const result: any[] = [];
  for (const hit of searchListings(listings, query)) {
    const key = String(hit.listing._id ?? hit.listing.slug);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(hit.listing);
  }
  return result;
}
