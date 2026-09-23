/**
 * Small helpers shared by every screen that lists businesses (the search directory,
 * the category pages, the business pages): matching what a visitor typed, working
 * out whether a business is open right now, and printing its address.
 */

/* ------------------------------------------------------------------ search */

/** Lower-cased with diacritics stripped, so "tirane" finds "Tiranë" and "krepe" finds "Krepë". */
export function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** The words of a search, normalised. */
export function queryTokens(query: string) {
  return normalizeText(query).split(/\s+/).filter(Boolean);
}

/**
 * Words of five letters or more also match without their last letter, which is what
 * lets "tirana" find "Tiranë" and "burgers" find "burger".
 */
function hasToken(normalizedText: string, token: string) {
  return normalizedText.includes(token) || (token.length >= 5 && normalizedText.includes(token.slice(0, -1)));
}

/**
 * Every word of the query has to show up somewhere in the text ("burger tirane"
 * finds a burger place in Tiranë, not only a name containing that exact phrase).
 */
export function matchesQuery(haystack: string, query: string) {
  const tokens = queryTokens(query);
  if (!tokens.length) return true;
  const text = normalizeText(haystack);
  return tokens.every((token) => hasToken(text, token));
}

/** How many of the query's words this text contains — used to pick the best-matching items. */
export function matchScore(haystack: string, query: string) {
  const text = normalizeText(haystack);
  return queryTokens(query).filter((token) => hasToken(text, token)).length;
}

/* ------------------------------------------------------------ opening hours */

export type OpenStatus =
  | { kind: "unknown" }
  | { kind: "open"; closesAt: string; allDay: boolean }
  | { kind: "closed"; opensAt: string };

const pad = (value: number) => String(value).padStart(2, "0");
const toClock = (minutes: number) => `${pad(Math.floor(minutes / 60) % 24)}:${pad(minutes % 60)}`;

/**
 * Pulls the opening and closing time out of `businessHours`. The wizard stores
 * "08:00 - 22:00", but older listings hold free text ("Çdo ditë 9:00–23:00"), so
 * the first two clock times found are used and anything else reads as unknown.
 */
export function parseHours(value?: string): { open: number; close: number } | null {
  const times = Array.from(String(value || "").matchAll(/(\d{1,2})[:.](\d{2})/g)).map(
    (match) => Number(match[1]) * 60 + Number(match[2])
  );
  if (times.length < 2 || times.some((minutes) => minutes > 24 * 60)) return null;
  return { open: times[0], close: times[1] };
}

/** Minutes since midnight in Albania, whatever timezone the visitor's device is in. */
function tiranaMinutes(now: Date) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Tirane",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(now);
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);
    if (Number.isFinite(hour) && Number.isFinite(minute)) return hour * 60 + minute;
  } catch {
    // Fall through to the device clock.
  }
  return now.getHours() * 60 + now.getMinutes();
}

export function getOpenStatus(hours?: string, now: Date = new Date()): OpenStatus {
  const range = parseHours(hours);
  if (!range) return { kind: "unknown" };

  const current = tiranaMinutes(now);
  const { open, close } = range;

  if (open === close) return { kind: "open", closesAt: "", allDay: true };

  // A closing time earlier than the opening time means the place runs past midnight.
  const isOpen = open < close ? current >= open && current < close : current >= open || current < close;
  return isOpen ? { kind: "open", closesAt: toClock(close), allDay: false } : { kind: "closed", opensAt: toClock(open) };
}

/* ----------------------------------------------------------------- address */

/** Some owners pasted a maps link into the address field — that is a link, not a street. */
export function isLinkAddress(value?: string) {
  return /^https?:\/\//i.test(String(value || "").trim());
}

/** Street and city on one line without repeating the city when the address already has it. */
export function listingAddress(listing: { address?: string; location?: string }) {
  const address = isLinkAddress(listing.address) ? "" : String(listing.address || "").trim();
  const location = String(listing.location || "").trim();
  if (!address) return location;
  if (!location || normalizeText(address).includes(normalizeText(location))) return address;
  return `${address}, ${location}`;
}
