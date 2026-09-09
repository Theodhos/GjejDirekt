"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { recordOrderContact } from "@/lib/order-history";
import { actionLabels, type ListingAction } from "@/lib/constants";

// Contact buttons for the listing detail page. Client-side so each click can be
// counted — contact clicks rank listings within the same package tier — and so a
// WhatsApp tap lands in the visitor's "Porositë" list.
export default function ListingContactButtons({
  phone,
  whatsappHref,
  whatsappActions,
  listingId,
  listing
}: {
  phone: string;
  /** Kept for callers that only have a single link; ignored when whatsappActions is set. */
  whatsappHref?: string;
  /** One entry per action the business takes — see buildWhatsappActions. */
  whatsappActions?: { action: ListingAction; href: string }[];
  listingId: string;
  /** Minimal listing data used for the local order history. */
  listing?: { slug: string; title: string; images?: string[]; location?: string; category?: string };
}) {
  const { language } = useLanguage();

  const track = (kind: "phone-click" | "whatsapp-click") => {
    if (!listingId) return;
    fetch(`/api/listings/${listingId}/${kind}`, { method: "POST", keepalive: true }).catch(() => {});
  };

  // A business that both sells and books gets a button for each, so the visitor
  // says what they actually want before the chat opens.
  const actions =
    whatsappActions?.length
      ? whatsappActions
      : whatsappHref
        ? [{ action: "porosi" as ListingAction, href: whatsappHref }]
        : [];

  return (
    <>
      {phone && (
        <a
          href={`tel:${phone}`}
          onClick={() => track("phone-click")}
          className="btn-primary w-full !py-3"
        >
          <Phone className="h-4 w-4" />
          {language === "en" ? "Call directly" : "Telefono direkt"}
        </a>
      )}

      {actions.map(({ action, href }) => (
        <a
          key={action}
          href={href}
          target="_blank"
          rel="noreferrer"
          onClick={() => {
            track("whatsapp-click");
            if (listing) recordOrderContact(listing);
          }}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
          style={{ background: "var(--whatsapp-green)", boxShadow: "0 2px 8px rgba(37,211,102,0.22)" }}
        >
          <MessageCircle className="h-4 w-4" />
          {language === "en" ? actionLabels[action].en : actionLabels[action].sq}
        </a>
      ))}
    </>
  );
}
