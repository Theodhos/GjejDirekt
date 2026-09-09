"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { Phone, MessageCircle } from "lucide-react";
import { recordOrderContact } from "@/lib/order-history";
import { actionLabels, type ListingAction } from "@/lib/constants";

interface ListingStickyBottomProps {
  phone: string;
  /** Kept for callers that only have a single link; ignored when whatsappActions is set. */
  whatsappHref?: string;
  /** One entry per action the business takes — see buildWhatsappActions. */
  whatsappActions?: { action: ListingAction; href: string }[];
  listingId?: string;
  /** Minimal listing data used for the local order history. */
  listing?: { slug: string; title: string; images?: string[]; location?: string; category?: string };
}

export default function ListingStickyBottom({
  phone,
  whatsappHref,
  whatsappActions,
  listingId,
  listing
}: ListingStickyBottomProps) {
  const { language } = useLanguage();
  const t = translations[language];

  const actions =
    whatsappActions?.length
      ? whatsappActions
      : whatsappHref
        ? [{ action: "porosi" as ListingAction, href: whatsappHref }]
        : [];

  if (!phone && !actions.length) return null;

  const trackWhatsapp = () => {
    if (listing) recordOrderContact(listing);
    if (listingId) {
      fetch(`/api/listings/${listingId}/whatsapp-click`, { method: "POST", keepalive: true }).catch(() => {});
    }
  };

  const trackPhone = () => {
    if (listingId) {
      fetch(`/api/listings/${listingId}/phone-click`, { method: "POST", keepalive: true }).catch(() => {});
    }
  };

  return (
    // Sits directly above the phone tab bar rather than over it — `--bottom-nav-height`
    // is 0 from lg up, where this bar is hidden anyway.
    <div
      className="fixed inset-x-0 z-40 border-t bg-white/95 px-4 py-3 backdrop-blur-md md:hidden"
      style={{
        bottom: "var(--bottom-nav-height)",
        borderColor: "var(--border-soft)",
        boxShadow: "0 -8px 30px rgba(15,20,25,0.07)"
      }}
    >
      <div
        className="grid w-full gap-2.5"
        style={{ gridTemplateColumns: `repeat(${actions.length + (phone ? 1 : 0)}, minmax(0, 1fr))` }}
      >
        {actions.map(({ action, href }) => (
          <a
            key={action}
            href={href}
            target="_blank"
            rel="noreferrer"
            onClick={trackWhatsapp}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-bold text-white transition-transform active:scale-95"
            style={{ background: "var(--whatsapp-green)" }}
          >
            <MessageCircle className="h-[18px] w-[18px] fill-current" />
            <span>{language === "en" ? actionLabels[action].enShort : actionLabels[action].sqShort}</span>
          </a>
        ))}
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={trackPhone}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[13px] font-bold text-white transition-transform active:scale-95"
            style={{ background: "var(--brand-accent)" }}
          >
            <Phone className="h-4 w-4 fill-current" />
            <span>{t.listing.call}</span>
          </a>
        )}
      </div>
    </div>
  );
}
