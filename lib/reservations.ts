/**
 * Client-side helpers for the standalone reservation flow — the businesses that
 * take bookings but have no product catalog to add-to-cart from (a hairdresser,
 * a dentist, a mechanic, a lawyer...). Mirrors lib/cart.ts's WhatsApp message
 * builder so both flows read the same way in a business's WhatsApp inbox.
 */

export type ReservationDetails = {
  businessName: string;
  location?: string;
  phone?: string;
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

  const parts = [en ? `📋 *RESERVATION FROM GJEJDIREKT.COM*` : `📋 *REZERVIM NGA GJEJDIREKT.COM*`, "", `*${details.businessName}*`];
  if (details.location) parts.push(`📍 ${details.location}`);
  if (details.phone) parts.push(`📞 ${details.phone}`);

  const rows: string[] = [];
  if (details.itemName) rows.push(`${en ? "Service" : "Shërbimi"}: ${details.itemName}`);
  rows.push(`${en ? "Date" : "Data"}: ${formattedDate}`);
  if (details.time) rows.push(`${en ? "Time" : "Ora"}: ${details.time}`);
  if (details.partySize) rows.push(`${en ? "People" : "Persona"}: ${details.partySize}`);
  rows.push(`${en ? "Name" : "Emri"}: ${details.customerName}`);
  rows.push(`${en ? "Phone" : "Telefoni"}: ${details.customerPhone}`);

  parts.push("", en ? `🗓️ *RESERVATION DETAILS*` : `🗓️ *DETAJET E REZERVIMIT*`, "```", ...rows, "```");

  if (details.notes?.trim()) {
    parts.push("", en ? `📝 *Note:*` : `📝 *Shënim:*`, details.notes.trim());
  }

  return parts.join("\n");
}

export function buildReservationWhatsappHref(phoneDigits: string, details: ReservationDetails, language: "al" | "en" = "al") {
  if (!phoneDigits) return "";
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(buildReservationMessage(details, language))}`;
}
