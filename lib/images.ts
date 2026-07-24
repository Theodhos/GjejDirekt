/**
 * Image URL guards.
 *
 * Listing/city/blog images are pasted by hand into the dashboard, so the value that
 * reaches `next/image` can be anything: an empty string, a Google share link, a page
 * URL. `next/image` throws at render time for a host that is not in
 * `next.config.mjs` -> `images.remotePatterns`, which crashes the whole page.
 * Everything here exists so a bad URL degrades into the placeholder instead.
 */

export const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80";

/** Keep in sync with `images.remotePatterns` in next.config.mjs. */
const OPTIMIZED_HOSTS = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "lh3.googleusercontent.com",
  "i.pravatar.cc",
  "www.paypalobjects.com",
  "encrypted-tbn0.gstatic.com",
  "www.gstatic.com"
];

/** Shorteners and share links — they resolve to an HTML page, never to an image. */
const NON_IMAGE_HOSTS = [
  "share.google",
  "goo.gl",
  "maps.app.goo.gl",
  "g.co",
  "g.page",
  "google.com",
  "www.google.com",
  "maps.google.com",
  "bit.ly",
  "tinyurl.com",
  "t.co"
];

function parse(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

/** True when the value can actually be rendered as an image by `next/image`. */
export function isUsableImageSrc(src?: string | null): src is string {
  if (typeof src !== "string") return false;
  const value = src.trim();
  if (!value) return false;
  // Local asset, inline data or an in-browser preview — always fine.
  if (value.startsWith("/") || value.startsWith("data:") || value.startsWith("blob:")) return true;

  const url = parse(value);
  if (!url) return false;
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  return !NON_IMAGE_HOSTS.includes(url.hostname.toLowerCase());
}

/** Returns a src that is safe to hand to `next/image`, or the fallback. */
export function resolveImageSrc(src?: string | null, fallback: string = FALLBACK_IMAGE): string {
  return isUsableImageSrc(src) ? src.trim() : fallback;
}

/**
 * Validation message for the "image URL" fields in the dashboard, so a pasted share
 * link is caught while typing instead of silently turning into the placeholder.
 * Empty is allowed — it just means "use the default image".
 */
export function imageUrlError(value: string | null | undefined, english: boolean): string | undefined {
  const raw = (value ?? "").trim();
  if (!raw || isUsableImageSrc(raw)) return undefined;
  return english
    ? "Not a direct image link. Open the image, right-click → “Copy image address”, then paste that URL."
    : "Nuk është link i drejtpërdrejtë i imazhit. Hap imazhin, klik i djathtë → “Kopjo adresën e imazhit”, pastaj ngjite atë link.";
}

/**
 * Only hosts declared in next.config.mjs may go through the optimizer; anything else
 * has to be rendered `unoptimized`, otherwise `next/image` throws "Invalid src prop".
 */
export function isOptimizableImageSrc(src: string): boolean {
  if (src.startsWith("/")) return true;
  const url = parse(src);
  if (!url || url.protocol !== "https:") return false;
  return OPTIMIZED_HOSTS.includes(url.hostname.toLowerCase());
}
