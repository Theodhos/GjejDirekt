/**
 * Approximate town-centre coordinates, keyed by the same slug the city catalogue
 * and listings use. They exist so the "Pranë meje" pill can turn a browser
 * geolocation fix into a city page — GjejDirekt has no per-listing coordinates,
 * so the nearest town is the closest thing to "near me" the data supports.
 */
export const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  tirane: { lat: 41.3275, lng: 19.8187 },
  durres: { lat: 41.3231, lng: 19.4414 },
  vlore: { lat: 40.4667, lng: 19.4897 },
  sarande: { lat: 39.8756, lng: 20.0053 },
  shkoder: { lat: 42.0693, lng: 19.5033 },
  korce: { lat: 40.6186, lng: 20.7808 },
  berat: { lat: 40.7058, lng: 19.9522 },
  gjirokaster: { lat: 40.0757, lng: 20.1389 },
  elbasan: { lat: 41.1125, lng: 20.0822 },
  fier: { lat: 40.7239, lng: 19.5567 },
  lezhe: { lat: 41.7836, lng: 19.6436 },
  pogradec: { lat: 40.9025, lng: 20.6525 },
  kukes: { lat: 42.0769, lng: 20.4219 },
  kruje: { lat: 41.5094, lng: 19.7928 },
  lushnje: { lat: 40.9419, lng: 19.705 },
  himare: { lat: 40.1017, lng: 19.7447 },
  ksamil: { lat: 39.7683, lng: 20.0011 },
  kavaje: { lat: 41.1856, lng: 19.5569 },
  peshkopi: { lat: 41.6858, lng: 20.4289 },
  dhermi: { lat: 40.1497, lng: 19.6431 },
  divjake: { lat: 40.9953, lng: 19.5297 },
  kucove: { lat: 40.8017, lng: 19.9139 },
  permet: { lat: 40.2342, lng: 20.3517 },
  tepelene: { lat: 40.2969, lng: 20.0189 },
  burrel: { lat: 41.6103, lng: 20.0089 }
};

/** Great-circle distance in kilometres. */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

/**
 * Closest known city slug to a position, restricted to `allowed` when the caller
 * knows which cities actually have listings. Returns null when nothing is in range
 * — someone opening the site from abroad should not be sent to a random town.
 */
export function nearestCity(
  position: { lat: number; lng: number },
  allowed?: string[],
  maxDistanceKm = 120
): string | null {
  const candidates = Object.entries(cityCoordinates).filter(
    ([slug]) => !allowed?.length || allowed.includes(slug)
  );

  let best: { slug: string; distance: number } | null = null;
  for (const [slug, coords] of candidates) {
    const distance = distanceKm(position, coords);
    if (!best || distance < best.distance) best = { slug, distance };
  }

  return best && best.distance <= maxDistanceKm ? best.slug : null;
}
