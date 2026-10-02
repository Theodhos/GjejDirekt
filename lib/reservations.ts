import { PLATFORM_WHATSAPP_NUMBER } from "@/lib/constants";

/**
 * Client-side helpers for the standalone reservation flow — the businesses that
 * take bookings but have no product catalog to add-to-cart from (a hairdresser,
 * a dentist, a mechanic, a lawyer...). Shares lib/cart.ts's exact message skeleton
 * (separators, 🏪/👤/📅 header, ⏱️ confirmation, 💬 note) so every business type —
 * with or without a catalog — reads the same way in GjejDirekt's shared WhatsApp inbox.
 */

const SEPARATOR = "━".repeat(20);

export type ReservationDetails = {
  businessName: string;
  location?: string;
  itemName?: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time?: string;
  partySize?: number;
  notes?: string;
};

export function buildReservationMessage(details: ReservationDetails, language: "al" | "en" = "al") {
  const en = language === "en";
  const formattedDate = details.date
    ? new Date(details.date).toLocaleDateString(en ? "en-GB" : "sq-AL", { day: "2-digit", month: "long", year: "numeric" })
    : "";
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
  parts.push(`• ${en ? "Date" : "Data"}: ${formattedDate}`);
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
