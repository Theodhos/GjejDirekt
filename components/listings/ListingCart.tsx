"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingCart, Trash2, X, MessageCircle, Lock, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatPrice } from "@/lib/pricing";
import SafeImage from "@/components/ui/SafeImage";
import {
  type CartItem,
  readCart,
  setCartQty,
  removeFromCart,
  clearCart,
  cartCount,
  cartTotal,
  onCartChange,
  buildOrderWhatsappHref
} from "@/lib/cart";
import { recordOrderContact } from "@/lib/order-history";
import { getCategoryByValue } from "@/lib/constants";

export default function ListingCart({
  listingSlug,
  listingId,
  businessName,
  phoneDigits,
  phone,
  listing,
  isReservation = false,
  variant = "floating"
}: {
  listingSlug: string;
  listingId?: string;
  businessName: string;
  phoneDigits: string;
  /** Human-formatted phone shown in the WhatsApp message header (falls back to phoneDigits). */
  phone?: string;
  listing?: { slug: string; title: string; images?: string[]; location?: string; category?: string };
  isReservation?: boolean;
  /**
   * "floating" is the rounded pill used by shops and hotels. "bar" is the full-width
   * basket bar of the food pages — cart icon, `3 Produkte • 1.950 Lekë` and a
   * "Shko te porosia" button — which stays put while several dishes are added.
   */
  variant?: "floating" | "bar";
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // Booking states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [persons, setPersons] = useState(2);
  const [specialRequest, setSpecialRequest] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(en ? "Cash on delivery" : "Kesh në dorë");

  // Order note (non-hotel flow) — revealed by the "Add order note" button
  const [noteOpen, setNoteOpen] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  // null until the first sync so a cart that already has items when this page
  // loads doesn't pop the drawer open uninvited — only a live increase (an
  // actual "add" while the visitor is here) should reveal it.
  const previousCountRef = useRef<number | null>(null);

  // Lets the sitewide chat button step up out of the way of the basket bar (see globals.css).
  useEffect(() => {
    if (variant !== "bar" || !items.length) return;
    document.documentElement.dataset.cartBar = "1";
    return () => {
      delete document.documentElement.dataset.cartBar;
    };
  }, [variant, items.length]);

  useEffect(() => {
    const syncItems = () => {
      const next = readCart(listingSlug);
      setItems(next);
      const nextCount = cartCount(next);
      if (previousCountRef.current !== null && nextCount > previousCountRef.current) {
        // The bar already shows the running total, so on a phone it must not throw the
        // sheet over the menu after every dish; the right-hand drawer (sm and up) still opens.
        if (variant !== "bar" || window.matchMedia("(min-width: 640px)").matches) setOpen(true);
      }
      previousCountRef.current = nextCount;
    };
    syncItems();
    return onCartChange(syncItems);
  }, [listingSlug, variant]);

  if (!items.length) return null;

  const count = cartCount(items);
  const total = cartTotal(items);
  const hasAllPrices = items.every((item) => typeof item.price === "number");
  
  // Resolved through the category taxonomy (canonical value + every legacy alias:
  // "akomodim", "hotel", "hotels", "resort", ...) rather than a raw string match,
  // so any listing that actually belongs to Hotele & Akomodim is recognized. The
  // item-name check stays as a fallback for listings still missing a category.
  const isBooking = isReservation || getCategoryByValue(listing?.category)?.value === "hotele" || items.some(i => i.name.toLowerCase().includes("dhom"));

  const whatsappHref = buildOrderWhatsappHref(phoneDigits, businessName, items, language, {
    location: listing?.location,
    phone: phone || phoneDigits,
    note: isBooking ? specialRequest : orderNote,
    isHotel: isBooking,
    checkIn: isBooking ? checkIn : undefined,
    checkOut: isBooking ? checkOut : undefined,
    persons: isBooking ? persons : undefined,
    customerName,
    customerAddress: isBooking ? undefined : customerAddress,
    paymentMethod
  });

  const handleSend = () => {
    if (listingId) {
      fetch(`/api/listings/${listingId}/whatsapp-click`, { method: "POST", keepalive: true }).catch(() => {});
    }
    if (listing) recordOrderContact(listing);

    // Booking (a hotel room, a table) is also a real reservation — persist it
    // server-side so the business can see and confirm it from the dashboard,
    // not only from the WhatsApp message this same click sends.
    if (isBooking && listingId && checkIn && customerName.trim() && customerPhone.trim()) {
      fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          date: checkIn,
          endDate: checkOut || undefined,
          partySize: persons,
          notes: specialRequest || undefined,
          productId: items[0]?.productId,
          itemName: items.map((item) => item.name).join(", ")
        }),
        keepalive: true
      }).catch(() => {});
    }

    clearCart(listingSlug);
    setOrderNote("");
    setNoteOpen(false);
    setOpen(false);
  };

  return (
    <>
      {variant === "bar" ? (
        <div
          className="fixed inset-x-0 z-40 border-t bg-white lg:inset-x-auto lg:left-1/2 lg:mb-6 lg:w-[calc(100%-4rem)] lg:max-w-[1136px] lg:-translate-x-1/2 lg:rounded-2xl lg:border"
          style={{
            borderColor: "var(--border-soft)",
            boxShadow: "0 -4px 20px rgba(15,20,25,0.08)",
            // Rests on top of the phone tab bar; the variable is 0 from lg up.
            bottom: "var(--bottom-nav-height)"
          }}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-3.5 py-2.5 lg:max-w-none lg:px-5">
            <button type="button" onClick={() => setOpen(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label={isBooking ? (en ? "View booking" : "Shiko rezervimin") : en ? "View order" : "Shiko porosinë"}>
              <span
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: "var(--brand-accent)" }}
              >
                <ShoppingCart className="h-6 w-6" strokeWidth={2} />
                <span
                  className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-white bg-white px-1 text-[11px] font-black"
                  style={{ color: "var(--brand-accent)", boxShadow: "0 0 0 1px var(--brand-accent)" }}
                >
                  {count}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block whitespace-nowrap text-[13.5px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {count}{" "}
                  {isBooking
                    ? en
                      ? count === 1
                        ? "Booking"
                        : "Bookings"
                      : count === 1
                      ? "Rezervim"
                      : "Rezervime"
                    : en
                    ? count === 1
                      ? "Item"
                      : "Items"
                    : count === 1
                    ? "Produkt"
                    : "Produkte"}
                  {hasAllPrices ? ` • ${formatPrice(total)}` : ""}
                </span>
                <span className="flex items-center gap-0.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  {isBooking ? (en ? "View booking" : "Shko te rezervimi") : en ? "View order" : "Shko te porosia"}
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="h-11 shrink-0 whitespace-nowrap rounded-xl px-3.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.97] sm:px-7 sm:text-[14.5px]"
              style={{ background: "var(--brand-accent)" }}
            >
              {isBooking ? (en ? "Go to booking" : "Shko te rezervimi") : en ? "Go to order" : "Shko te porosia"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-[1.5rem] px-5 py-3 text-left shadow-lg transition-transform active:scale-[0.98]"
          style={{
            background: "var(--surface-white)",
            border: "1px solid var(--border-soft)",
            boxShadow: "0 8px 32px rgba(15,20,25,0.12)",
            // Sits centered above the phone tab bar rather than under/behind it —
            // `--bottom-nav-height` is 0 from lg up, where the tab bar is hidden anyway.
            bottom: "calc(var(--bottom-nav-height) + 1rem)"
          }}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
              {isBooking ? (
                <Calendar className="h-7 w-7 text-red-500" />
              ) : (
                <ShoppingCart className="h-7 w-7 text-red-500 fill-red-50" />
              )}
              <span
                className="absolute -top-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px] font-black text-white"
                style={{ background: "var(--brand-accent)" }}
              >
                {count}
              </span>
            </span>
            <span className="truncate text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
              {count} {isBooking ? (count === 1 ? (en ? "reservation" : "rezervim") : (en ? "reservations" : "rezervime")) : (count === 1 ? (en ? "item" : "artikull") : (en ? "items" : "artikuj"))}
              {hasAllPrices ? ` • ${formatPrice(total)}` : ""}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-bold" style={{ color: "var(--brand-accent)" }}>
            {isBooking ? (en ? "View reservation" : "Shiko rezervimin") : (en ? "View order" : "Shiko kërkesën")}
            <ChevronRight className="h-4 w-4" />
          </span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-stretch sm:justify-end"
          style={{ background: "rgba(15,23,42,0.55)" }}
          onClick={() => setOpen(false)}
        >
          {/* Bottom sheet on phones (unchanged); a right-anchored, full-height
              drawer from `sm` up — checkout stays visible next to the page
              instead of covering it as a centered modal. */}
          <div
            className="flex w-full max-w-md max-h-[90vh] flex-col overflow-hidden rounded-t-3xl animate-in fade-in slide-in-from-bottom-4 duration-300 sm:h-full sm:max-h-full sm:max-w-[420px] sm:rounded-none sm:rounded-l-3xl sm:slide-in-from-right sm:slide-in-from-bottom-0"
            style={{ background: "var(--surface-white)", boxShadow: "var(--shadow-card)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: "1px solid var(--border-soft)" }}
            >
              <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {isBooking ? (en ? "Your reservation" : "Rezervimi juaj") : (en ? "Your order" : "Kërkesa juaj")}
              </h3>
              <button type="button" onClick={() => setOpen(false)} style={{ color: "var(--text-primary)" }} className="p-1 hover:bg-neutral-100 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2 shrink-0">
              <span className="inline-flex rounded-full bg-red-50 text-red-600 px-3 py-1 text-xs font-bold">
                {isBooking ? (en ? "Reservation" : "Rezervim") : (en ? "Order" : "Porosi")}
              </span>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 overflow-y-auto px-5 py-2 flex-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-start gap-3 pb-4" style={isBooking ? {} : { borderBottom: "1px solid var(--border-soft)" }}>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                    <SafeImage src={item.image ?? null} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-[14px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
                        {item.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(listingSlug, item.productId)}
                        className="text-red-500 hover:bg-red-50 p-1.5 -mr-1.5 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {typeof item.price === "number" && (
                      <p className="text-[12px] font-medium mt-1" style={{ color: "var(--text-secondary)" }}>
                        {formatPrice(item.price)} {isBooking ? "/ natë" : ""}
                      </p>
                    )}

                    {!isBooking && (
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => setCartQty(listingSlug, item.productId, item.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center transition-colors text-neutral-400 hover:text-neutral-600"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-4 text-center text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCartQty(listingSlug, item.productId, item.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center transition-colors text-neutral-400 hover:text-neutral-600"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        {typeof item.price === "number" && (
                          <span className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
                            {formatPrice(item.price * item.qty)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isBooking && (
                <div className="space-y-5 pt-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-bold mb-2 text-neutral-700">
                        {en ? "Your name" : "Emri juaj"}
                      </label>
                      <input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-red-500"
                        placeholder={en ? "Full name" : "Emri e mbiemri"}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-bold mb-2 text-neutral-700">
                        {en ? "Phone number" : "Numri i telefonit"}
                      </label>
                      <input
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-red-500"
                        placeholder="+355 6X XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-bold mb-2 text-neutral-700">
                        <Calendar className="w-4 h-4" /> {en ? "Check-in date" : "Data e hyrjes"}
                      </label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-red-500" 
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-[13px] font-bold mb-2 text-neutral-700">
                        <Calendar className="w-4 h-4" /> {en ? "Check-out date" : "Data e daljes"}
                      </label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-red-500" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] font-bold mb-2 block text-neutral-700 flex items-center gap-2">
                      <span className="w-4 h-4 flex items-center justify-center border border-current rounded-full text-[10px]">8</span> {en ? "Number of persons" : "Numri i personave"}
                    </label>
                    <div className="flex items-center gap-4">
                      <button type="button" onClick={() => setPersons(p => Math.max(1, p-1))} className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"><Minus className="w-4 h-4" /></button>
                      <span className="text-[16px] font-bold w-4 text-center">{persons}</span>
                      <button type="button" onClick={() => setPersons(p => p+1)} className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600 hover:bg-neutral-200"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold mb-2 text-neutral-700">
                      <MessageCircle className="w-4 h-4" /> {en ? "Special requests (optional)" : "Kërkesa speciale (opsionale)"}
                    </label>
                    <textarea 
                      className="w-full border border-neutral-200 rounded-xl p-3 text-[14px] outline-none focus:border-red-500 min-h-[80px]" 
                      placeholder={en ? "Write your request..." : "Shkruaj kërkesën tënde..."}
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                    />
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
                    <p className="font-bold text-[14px] mb-2">{en ? "Summary" : "Përmbledhje"}</p>
                    <div className="flex justify-between text-[13px] text-neutral-600">
                      <span>{formatPrice(total)} × 1 {en ? "night" : "natë"}</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                    <div className="flex justify-between text-[13px] text-neutral-600">
                      <span>{en ? "Persons" : "Persona"}</span>
                      <span>{persons}</span>
                    </div>
                  </div>
                </div>
              )}

              {!isBooking && (
                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold mb-2 text-neutral-700">
                      {en ? "Your name" : "Emri juaj"}
                    </label>
                    <input
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-red-500"
                      placeholder={en ? "Full name" : "Emri e mbiemri"}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[13px] font-bold mb-2 text-neutral-700">
                      {en ? "Delivery address" : "Adresa e dorëzimit"}
                    </label>
                    <input
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-red-500"
                      placeholder={en ? "Street, city..." : "Rruga, qyteti..."}
                    />
                  </div>
                </div>
              )}

              {!isBooking && (
                noteOpen ? (
                  <div className="mt-2">
                    <label className="flex items-center gap-2 text-[13px] font-bold mb-2 text-neutral-700">
                      <MessageCircle className="w-4 h-4" /> {en ? "Order note" : "Shënim për porosinë"}
                    </label>
                    <textarea
                      autoFocus
                      className="w-full border border-neutral-200 rounded-xl p-3 text-[14px] outline-none focus:border-red-500 min-h-[70px]"
                      placeholder={en ? "e.g. no onions, ring the bell..." : "p.sh. pa qepë, bjeri ziles..."}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setNoteOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl border border-red-100 bg-red-50/50 text-red-600 font-bold text-[13px] transition-colors hover:bg-red-50"
                  >
                    <Plus className="w-4 h-4" /> {en ? "Add order note" : "Shto shënim për porosinë"}
                  </button>
                )
              )}

              <div>
                <label className="flex items-center gap-2 text-[13px] font-bold mb-2 mt-2 text-neutral-700">
                  <Lock className="w-4 h-4" /> {en ? "Payment method" : "Mënyra e pagesës"}
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-red-500 bg-white"
                >
                  {(en
                    ? ["Cash on delivery", "Card on delivery", "Bank transfer"]
                    : ["Kesh në dorë", "Kartë (POS) në dorë", "Transfertë bankare"]
                  ).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 pb-6 pt-4 shrink-0 bg-white" style={{ borderTop: "1px solid var(--border-soft)" }}>
              {hasAllPrices && (
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                    {en ? "Total" : "Totali"}
                  </span>
                  <span className="text-[18px] font-black text-red-600">
                    {formatPrice(total)}
                  </span>
                </div>
              )}

              {isBooking && (
                <div className="flex gap-2 items-start bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-[12px] font-medium leading-tight">
                   <div className="w-4 h-4 shrink-0 border border-current rounded-full flex items-center justify-center text-[10px] font-bold">!</div>
                   {en ? "Reservation will be confirmed by business via WhatsApp." : "Rezervimi do të konfirmohet nga biznesi përmes WhatsApp."}
                </div>
              )}

              {phoneDigits ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleSend}
                  className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "var(--whatsapp-green)", boxShadow: "0 4px 14px rgba(37,211,102,0.3)" }}
                >
                  <MessageCircle className="h-5 w-5" />
                  {isBooking ? (en ? "Send reservation on WhatsApp" : "Dërgo rezervimin në WhatsApp") : (en ? "Send order on WhatsApp" : "Dërgo porosinë në WhatsApp")}
                </a>
              ) : (
                <p className="text-center text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {en ? "This business has no WhatsApp number." : "Ky biznes nuk ka numër WhatsApp."}
                </p>
              )}

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
