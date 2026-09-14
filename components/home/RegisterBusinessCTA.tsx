"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Acquisition banner that closes the home page: the free-Verified offer is the
 * single reason a business signs up, so it gets its own red-tinted panel rather
 * than another row of cards.
 */
export default function RegisterBusinessCTA() {
  const { language } = useLanguage();

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border p-3.5 sm:gap-4 sm:p-5"
      style={{ background: "var(--brand-light)", borderColor: "var(--brand-border)" }}
    >
      {/* Red star circle icon */}
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white sm:h-12 sm:w-12"
        style={{ background: "var(--brand-accent)", boxShadow: "0 4px 12px rgba(225,29,46,0.35)" }}
      >
        <Star className="h-5 w-5 sm:h-6 sm:w-6" fill="white" strokeWidth={0} />
      </span>

      {/* Text block */}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold leading-tight sm:text-[14.5px]" style={{ color: "var(--text-primary)" }}>
          {language === "en"
            ? "List your business on GjejDirekt"
            : "Regjistro biznesin tënd në GjejDirekt"}
        </p>
        <p className="mt-0.5 text-[11px] sm:text-[12px]" style={{ color: "var(--text-secondary)" }}>
          {language === "en" ? "Verified free for 12 months!" : "Verified falas për 12 muaj!"}
        </p>
      </div>

      {/* CTA button */}
      <Link
        href="/create-listing"
        className="shrink-0 rounded-xl px-3.5 py-2 text-[12px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 sm:px-5 sm:py-2.5 sm:text-[13px]"
        style={{ background: "var(--brand-accent)", boxShadow: "0 2px 8px rgba(225,29,46,0.3)", whiteSpace: "nowrap" }}
      >
        {language === "en" ? "Register now" : "Regjistro tani"}
      </Link>
    </div>
  );
}
