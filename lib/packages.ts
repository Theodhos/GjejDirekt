/**
 * Single source of truth for the growth packages sold on /packet.
 *
 * The admin panel stores what a business actually owns on the listing itself
 * (`listing.verified` + `listing.package`), while `Payment` documents hold the
 * transaction history. Both sides are normalised through the helpers below so
 * the dashboard shows exactly the same package names and prices as /packet.
 */

export type PackageKey = "free" | "verified" | "ads" | "ads-pro";
export type PackageBilling = "free" | "one-time" | "monthly";

export type PackageDefinition = {
  key: PackageKey;
  label: { al: string; en: string };
  price: number;
  currency: string;
  billing: PackageBilling;
};

export const PACKAGE_CATALOG: Record<PackageKey, PackageDefinition> = {
  free: { key: "free", label: { al: "Falas", en: "Free" }, price: 0, currency: "EUR", billing: "free" },
  verified: { key: "verified", label: { al: "Verified", en: "Verified" }, price: 50, currency: "EUR", billing: "one-time" },
  ads: { key: "ads", label: { al: "Ads", en: "Ads" }, price: 10, currency: "EUR", billing: "monthly" },
  "ads-pro": { key: "ads-pro", label: { al: "Ads Pro", en: "Ads Pro" }, price: 15, currency: "EUR", billing: "monthly" }
};

/** Accepts every spelling used across the app: "verify", "trading", "features", "Ads Pro"... */
export function normalizePackageKey(value?: string | null): PackageKey | null {
  const key = String(value || "").trim().toLowerCase();
  if (!key) return null;
  if (key === "free" || key === "falas") return "free";
  if (key === "verify" || key === "verified") return "verified";
  if (key === "features" || key === "ads-pro" || key === "adspro" || key.includes("ads pro")) return "ads-pro";
  if (key === "trading" || key === "ads") return "ads";
  return null;
}

export function getPackageDefinition(value?: string | null): PackageDefinition | null {
  const key = normalizePackageKey(value);
  return key ? PACKAGE_CATALOG[key] : null;
}

export function getPackageLabel(value: string | null | undefined, language: "al" | "en") {
  return getPackageDefinition(value)?.label[language] || "";
}

/** Packages an admin has actually granted to a listing. */
export function listingActivePackages(listing: { verified?: boolean; package?: string | null }): PackageKey[] {
  const keys: PackageKey[] = [];
  if (listing.verified) keys.push("verified");
  const paid = normalizePackageKey(listing.package);
  if (paid === "ads" || paid === "ads-pro") keys.push(paid);
  return keys;
}

export function currencySymbol(code?: string | null) {
  const value = String(code || "EUR").trim().toUpperCase();
  if (value === "EUR" || value === "€") return "€";
  if (value === "USD" || value === "$") return "$";
  if (value === "ALL" || value === "LEK") return "L";
  return value;
}

export function formatPackagePrice(
  amount: number,
  billing: PackageBilling,
  language: "al" | "en",
  currency = "EUR"
) {
  const symbol = currencySymbol(currency);
  if (billing === "free" || amount === 0) return language === "en" ? "Free" : "Falas";
  if (billing === "monthly") return `${symbol}${amount} ${language === "en" ? "/ month" : "/ muaj"}`;
  return `${symbol}${amount} ${language === "en" ? "one-time" : "një herë"}`;
}
