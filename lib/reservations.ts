import { PLATFORM_WHATSAPP_NUMBER } from "@/lib/constants";

/**
 * Client-side helpers for the standalone reservation flow — the businesses that
 * take bookings but have no product catalog to add-to-cart from (a hairdresser,
 * a dentist, a mechanic, a lawyer...). Shares lib/cart.ts's exact message skeleton
 * (separators, 🏪/👤/📅 header, ⏱️ confirmation, 💬 note) so every business type —
 * with or without a catalog — reads the same way in GjejDirekt's shared WhatsApp inbox.
 */

const SEPARATOR = "━".repeat(20);

const DAY_MS = 24 * 60 * 60 * 1000;

function dayStamp(value: string | Date): number | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * How many days (nights, for a stay) a "from this date to that date" booking covers —
 * the number every per-day price is multiplied by. `2026-10-10` → `2026-10-12` is 2,
 * the same way a hotel counts nights and a car rental counts days. Without an end
 * date, or with one that isn't after the start, the booking is a single day: 1.
 */
export function countBookingDays(start?: string | Date | null, end?: string | Date | null): number {
  if (!start || !end) return 1;
  const from = dayStamp(start);
  const to = dayStamp(end);
  if (from === null || to === null) return 1;
  const diff = Math.round((to - from) / DAY_MS);
  return diff > 0 ? diff : 1;
}

/** True when the booking really spans more than one day (an end date after the start). */
export function isDateRange(start?: string | Date | null, end?: string | Date | null): boolean {
  if (!start || !end) return false;
  const from = dayStamp(start);
  const to = dayStamp(end);
  return from !== null && to !== null && to > from;
}

/** "2 netë" / "3 ditë" — the unit word a customer reads next to a day count. */
export function formatBookingDays(days: number, kind: "stay" | "service", language: "al" | "en" = "al"): string {
  const en = language === "en";
  const unit =
    kind === "stay"
      ? en
        ? days === 1 ? "night" : "nights"
        : days === 1 ? "natë" : "netë"
      : en
        ? days === 1 ? "day" : "days"
        : "ditë";
  return `${days} ${unit}`;
}

export type ReservationDetails = {
  businessName: string;
  location?: string;
  itemName?: string;
  customerName: string;
  customerPhone: string;
  date: string;
  /** Last day of a multi-day booking (a rental, a stay); omitted for a single slot. */
  endDate?: string;
  time?: string;
  partySize?: number;
  notes?: string;
};

export function buildReservationMessage(details: ReservationDetails, language: "al" | "en" = "al") {
  const en = language === "en";
  const formatDay = (value: string) =>
    new Date(value).toLocaleDateString(en ? "en-GB" : "sq-AL", { day: "2-digit", month: "long", year: "numeric" });
  const formattedDate = details.date ? formatDay(details.date) : "";
  const ranged = isDateRange(details.date, details.endDate);
  const businessLine = details.location?.trim()
    ? `${details.businessName} — ${details.location.trim()}`
    : details.businessName;

  const parts = [SEPARATOR];
  parts.push(`🏪 ${en ? "BUSINESS" : "BIZNESI"}: ${businessLine}`);
  parts.push(`👤 ${en ? "CUSTOMER" : "KLIENTI"}: ${details.customerName}`);
  parts.push(`📞 ${en ? "PHONE" : "TELEFONI"}: ${details.customerPhone}`);
  parts.push(SEPARATOR, "");

  parts.push(`📅 ${en ? "RESERVATION" : "REZERVIMI"}:`);
  if (details.itemName) parts.push(`• ${details.itemName}`);
  if (ranged && details.endDate) {
    parts.push(`• ${en ? "From" : "Nga"}: ${formattedDate}`);
    parts.push(`• ${en ? "To" : "Deri më"}: ${formatDay(details.endDate)}`);
    parts.push(`• ${en ? "Days" : "Ditë"}: ${countBookingDays(details.date, details.endDate)}`);
  } else {
    parts.push(`• ${en ? "Date" : "Data"}: ${formattedDate}`);
  }
  if (details.time) parts.push(`• ${en ? "Time" : "Ora"}: ${details.time}`);
  if (details.partySize) parts.push(`• ${en ? "People" : "Persona"}: ${details.partySize}`);

  parts.push("");
  parts.push(`⏱️ ${en ? "CONFIRMATION" : "KONFIRMIMI"}: ${en ? "within 24h" : "brenda 24 orësh"}`);
  if (details.notes?.trim()) {
    parts.push(`💬 ${en ? "NOTE" : "SHËNIM"}: ${details.notes.trim()}`);
  }

  parts.push(SEPARATOR);

  return parts.join("\n");
}

export function buildReservationWhatsappHref(phoneDigits: string, details: ReservationDetails, language: "al" | "en" = "al") {
  if (!phoneDigits) return "";
  return `https://wa.me/${PLATFORM_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildReservationMessage(details, language))}`;
}
