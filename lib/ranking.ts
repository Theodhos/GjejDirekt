// Centralized package-purchase ranking logic.
//
// Ranking rules (most important first):
//   1. Verified + Ads Pro listings rank first.
//   2. Verified + Ads listings rank next, above all other listings.
//   3. The remaining paid packages keep their normal order:
//        Ads Pro > Ads > Verified > none.
//   4. Within the SAME package tier, the listing with more contact clicks
//      ranks higher — WhatsApp and phone clicks count together, since both
//      mean a visitor reached out (stronger engagement = higher rank).
//   5. Final tie-breaker: newest listing first.

export type PackageInput = string | null | undefined;

// Lower number = higher priority (ranks earlier).
const TIER_ORDER: Record<string, number> = {
  features: 0,
  trending: 1,
  trading: 1, // stored enum alias for "trending"
  verify: 2,
};

export const NO_PACKAGE_TIER = 3;

// The Listing model enum is ["verify", "trading", "features"], while the
// pricing UI uses the id "trending". Normalize so what we store always
// matches the schema and ranks correctly.
export function normalizePackage(packet: PackageInput): "verify" | "trading" | "features" | null {
  if (!packet) return null;
  const p = String(packet).toLowerCase().trim();
  if (p === "ads-pro" || p === "features") return "features";
  if (p === "ads" || p === "trending" || p === "trading") return "trading";
  if (p === "verified" || p === "verify") return "verify";
  return null;
}

export function packageTier(packet: PackageInput): number {
  if (!packet) return NO_PACKAGE_TIER;
  return TIER_ORDER[String(packet).toLowerCase()] ?? NO_PACKAGE_TIER;
}

type PackageRankable = {
  package?: PackageInput;
  verified?: boolean;
};

// Lower number = higher priority. Verified is stored independently from the
// paid package, so combined states need their own ranking tiers.
export function listingPriority(listing: PackageRankable): number {
  const packageName = normalizePackage(listing.package);
  if (listing.verified && packageName === "features") return 0;
  if (listing.verified && packageName === "trading") return 1;
  if (packageName === "features") return 2;
  if (packageName === "trading") return 3;
  if (listing.verified || packageName === "verify") return 4;
  return 5;
}

// Tier-only ordering for pages that already sort by a user-chosen key
// (newest / popular / rating). Array.sort is stable, so the incoming order
// survives as the tie-breaker inside each package tier.
export function sortByPackageTier<T extends PackageRankable>(listings: T[]): T[] {
  return [...listings].sort((a, b) => listingPriority(a) - listingPriority(b));
}

type Rankable = {
  package?: PackageInput;
  verified?: boolean;
  whatsappClicks?: number;
  phoneClicks?: number;
  createdAt?: string | number | Date;
};

// Both contact buttons signal the same thing — a visitor made contact.
export function contactClicks(listing: Rankable): number {
  return (listing.whatsappClicks ?? 0) + (listing.phoneClicks ?? 0);
}

export function rankListings<T extends Rankable>(listings: T[]): T[] {
  return [...listings].sort((a, b) => {
    const tierA = listingPriority(a);
    const tierB = listingPriority(b);
    if (tierA !== tierB) return tierA - tierB;

    const contactA = contactClicks(a);
    const contactB = contactClicks(b);
    if (contactA !== contactB) return contactB - contactA;

    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });
}
