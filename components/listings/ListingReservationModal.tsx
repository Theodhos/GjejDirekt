"use client";

import { useState } from "react";
import { Calendar, Clock, Minus, Plus, MessageCircle, Lock, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";
import { recordOrderContact } from "@/lib/order-history";
import { buildReservationWhatsappHref } from "@/lib/reservations";

/**
 * Standalone "Rezervo" entry point for businesses that take bookings but have
 * no product/service catalog to add-to-cart from first (a hairdresser, a
 * dentist, a mechanic...). ListingCart already covers the catalog+booking
 * case (a hotel picking a room, a restaurant table); this covers everything
 * else — a floating CTA, always visible, independent of any cart state.
 */
export default function ListingReservationModal({
  listingId,
  businessName,
  phoneDigits,
  phone,
  listing
}: {
  listingId?: string;
  businessName: string;
  phoneDigits: string;
  /** Human-formatted phone shown in the WhatsApp message header (falls back to phoneDigits). */
  phone?: string;
  listing?: { slug: string; title: string; images?: string[]; location?: string; category?: string };
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const reset = () => {
    setDate("");
    setTime("");
    setPartySize(1);
    setNotes("");
    setCustomerName("");
    setCustomerPhone("");
  };

  const handleSubmit = async () => {
    if (!date || !customerName.trim() || !customerPhone.trim()) {
      toast.error(en ? "Please fill in the required fields." : "Plotësoni fushat e detyrueshme.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          date,
          time: time || undefined,
          partySize,
          notes: notes.trim() || undefined
        })
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || (en ? "Could not send the reservation." : "Rezervimi nuk u dërgua."));
        return;
      }

      if (listing) recordOrderContact(listing);
      if (listingId) {
        fetch(`/api/listings/${listingId}/whatsapp-click`, { method: "POST", keepalive: true }).catch(() => {});
      }

      const whatsappHref = buildReservationWhatsappHref(
        phoneDigits,
        {
          businessName,
          location: listing?.location,
          phone: phone || phoneDigits,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          date,
          time: time || undefined,
          partySize,
          notes: notes.trim() || undefined
        },
        en ? "en" : "al"
      );
      if (whatsappHref) window.open(whatsappHref, "_blank", "noreferrer");

      toast.success(en ? "Reservation request sent!" : "Kërkesa për rezervim u dërgua!");
      reset();
      setOpen(false);
    } catch {
      toast.error(en ? "Network error" : "Gabim në rrjet");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-center gap-2.5 rounded-[1.5rem] px-5 py-3.5 text-[15px] font-bold text-white shadow-lg transition-transform active:scale-[0.98]"
        style={{
          background: "var(--brand-accent)",
          boxShadow: "0 8px 32px rgba(225,29,46,0.28)",
          bottom: "calc(var(--bottom-nav-height) + 1rem)"
        }}
      >
        <Calendar className="h-5 w-5" />
        {en ? "Book now" : "Rezervo tani"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          style={{ background: "rgba(15,23,42,0.55)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl sm:rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden flex flex-col"
            style={{ background: "var(--surface-white)", boxShadow: "var(--shadow-card)", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border-soft)" }}>
              <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {en ? "Book a reservation" : "Bëj një rezervim"}
              </h3>
              <button type="button" onClick={() => setOpen(false)} style={{ color: "var(--text-primary)" }} className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto px-5 py-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-[13px] font-bold text-neutral-700">
                  <span className="mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {en ? "Date" : "Data"} *
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[14px] outline-none focus:border-red-500"
                  />
                </label>
                <label className="block text-[13px] font-bold text-neutral-700">
                  <span className="mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {en ? "Time" : "Ora"}
                  </span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[14px] outline-none focus:border-red-500"
                  />
                </label>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-[13px] font-bold text-neutral-700">
                  <Users className="w-4 h-4" />
                  {en ? "People" : "Numri i personave"}
                </p>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setPartySize((p) => Math.max(1, p - 1))} className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-4 text-center text-[16px] font-bold">{partySize}</span>
                  <button type="button" onClick={() => setPartySize((p) => p + 1)} className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="block text-[13px] font-bold text-neutral-700">
                  {en ? "Your name" : "Emri juaj"} *
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[14px] outline-none focus:border-red-500"
                    placeholder={en ? "Full name" : "Emri e mbiemri"}
                  />
                </label>
                <label className="block text-[13px] font-bold text-neutral-700">
                  {en ? "Phone number" : "Numri i telefonit"} *
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-[14px] outline-none focus:border-red-500"
                    placeholder="+355 6X XXX XXXX"
                  />
                </label>
              </div>

              <label className="block text-[13px] font-bold text-neutral-700">
                {en ? "Notes (optional)" : "Shënime (opsionale)"}
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2 w-full min-h-[70px] rounded-xl border border-neutral-200 p-3 text-[14px] outline-none focus:border-red-500"
                  placeholder={en ? "Anything the business should know..." : "Çdo gjë që biznesi duhet ta dijë..."}
                />
              </label>
            </div>

            <div className="px-5 pb-6 pt-4 shrink-0 bg-white" style={{ borderTop: "1px solid var(--border-soft)" }}>
              <div className="flex gap-2 items-start bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-[12px] font-medium leading-tight">
                <div className="w-4 h-4 shrink-0 border border-current rounded-full flex items-center justify-center text-[10px] font-bold">!</div>
                {en ? "The business will confirm your reservation via WhatsApp." : "Biznesi do ta konfirmojë rezervimin përmes WhatsApp."}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                style={{ background: "var(--whatsapp-green)", boxShadow: "0 4px 14px rgba(37,211,102,0.3)" }}
              >
                <MessageCircle className="h-5 w-5" />
                {submitting ? (en ? "Sending..." : "Duke dërguar...") : (en ? "Send reservation on WhatsApp" : "Dërgo rezervimin në WhatsApp")}
              </button>

              <p className="flex items-center justify-center gap-1.5 mt-4 text-[11px] font-medium text-neutral-400">
                <Lock className="w-3 h-3" /> {en ? "No online payment required" : "Nuk kërkohet pagesë online"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
