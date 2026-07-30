/**
 * Ranks cities by how many listings point at them.
 *
 * Pure helpers only (no DB import) so the same logic runs on the server — where
 * the home page is rendered — and on the client, keeping both in the same order.
 */

/** "Tiranë", "TIRANE" and the slug "tirane" all collapse to the same key. */
export function cityKey(value: unknown) {
  return (
    String(value || "")
      .toLowerCase()
      // NFD splits "ë" into "e" + combining mark, which the filter below drops.
      .normalize("NFD")
      .replace(/[^a-z0-9]/g, "")
  );
}

/** Counts listing locations; "Voskopoje, Korce" counts once for each city. */
export function countListingsByCity(locations: Array<string | undefined | null>) {
  const counts = new Map<string, number>();
  locations.forEach((location) => {
    const raw = String(location || "");
    const keys = new Set([cityKey(raw), ...raw.split(/[\s,/|-]+/).map(cityKey)]);
    keys.forEach((key) => {
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  return counts;
}

export function listingCountForCity(city: { label?: string; value?: string }, counts: Map<string, number>) {
  const keys = new Set([cityKey(city.label), cityKey(city.value)]);
  let total = 0;
  keys.forEach((key) => {
    if (key) total += counts.get(key) || 0;
  });
  return total;
}

/** Most listings first; the alphabet only breaks ties. */
export function rankCitiesByListings<T extends { label?: string; value?: string }>(
  cities: T[],
  counts: Map<string, number>
): Array<T & { listingCount: number }> {
  return cities
    .map((city) => ({ ...city, listingCount: listingCountForCity(city, counts) }))
    .sort((a, b) => b.listingCount - a.listingCount || String(a.label).localeCompare(String(b.label)));
}
