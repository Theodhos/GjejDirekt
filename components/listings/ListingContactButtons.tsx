"use client";

import { MessageCircle, Phone } from "lucide-react";

// Contact buttons for the listing detail page. Client-side so each click can be
// counted — contact clicks rank listings within the same package tier.
export default function ListingContactButtons({
  phone,
  whatsappHref,
  listingId
}: {
  phone: string;
  whatsappHref: string;
  listingId: string;
}) {
  const track = (kind: "phone-click" | "whatsapp-click") => {
    if (!listingId) return;
    fetch(`/api/listings/${listingId}/${kind}`, { method: "POST", keepalive: true }).catch(() => {});
  };

  return (
    <>
      {phone && (
        <a
          href={`tel:${phone}`}
          onClick={() => track("phone-click")}
          className="flex items-center justify-center gap-2.5 w-full rounded-full py-3 font-semibold text-sm text-white transition-opacity hover:opacity-90 active:scale-95"
          style={{ background: "var(--brand-accent)", boxShadow: "0 2px 8px rgba(34,153,120,0.22)" }}
        >
          <Phone className="w-4 h-4" />
          Call Directly
        </a>
      )}

      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("whatsapp-click")}
          className="flex items-center justify-center gap-2.5 w-full rounded-full py-3 font-semibold text-sm text-white transition-opacity hover:opacity-90 active:scale-95"
          style={{ background: "#25D366", boxShadow: "0 2px 8px rgba(37,211,102,0.18)" }}
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
      )}
    </>
  );
}
