"use client";

import { Euro } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { formatStartingPrice, fromPriceLabel } from "@/lib/pricing";

/**
 * Price tile inside the listing "Details" grid. The label and the unit follow the
 * language, so the tile lives in a client component while the page stays server-rendered.
 */
export default function ListingPriceTile({
  price,
  category
}: {
  price: number;
  category?: string;
}) {
  const { language } = useLanguage();

  return (
    <div
      className="flex items-start gap-3 rounded-xl p-4"
      style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
    >
      <Euro className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-accent)" }} />
      <div>
        <p className="eyebrow mb-0.5">{fromPriceLabel(language)}</p>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {formatStartingPrice(price, category, language)}
        </p>
      </div>
    </div>
  );
}
