"use client";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { Phone, MessageCircle } from "lucide-react";

interface ListingStickyBottomProps {
  phone: string;
  whatsappHref: string;
  priceFrom?: number;
  currency?: string;
  categoryLabel?: string;
}

export default function ListingStickyBottom({
  phone,
  whatsappHref,
  priceFrom,
  currency = "€",
  categoryLabel
}: ListingStickyBottomProps) {
  const { language } = useLanguage();
  const t = translations[language];

  if (!phone && !whatsappHref) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-3.5 pb-[calc(14px+env(safe-area-inset-bottom,0px))] shadow-[0_-10px_40px_rgba(0,0,0,0.06)] md:hidden">
      <div className={`grid gap-3 w-full ${whatsappHref && phone ? "grid-cols-2" : "grid-cols-1"}`}>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 h-12 w-full bg-[#25D366] text-white rounded-2xl font-black text-xs hover:scale-102 active:scale-98 transition-all shadow-md shadow-emerald-500/10"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-current" />
            <span>WhatsApp</span>
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-center gap-2 h-12 w-full bg-brand-500 text-slate-950 rounded-2xl font-black text-xs hover:scale-102 active:scale-98 transition-all shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span>{t.listing.call}</span>
          </a>
        )}
      </div>
    </div>
  );
}
