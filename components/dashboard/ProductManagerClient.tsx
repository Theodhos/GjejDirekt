"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getOfferKind } from "@/lib/business-offer";
import CatalogManager, { MANAGER_COPY, type CatalogProduct } from "@/components/dashboard/CatalogManager";

export default function ProductManagerClient({
  listing,
  products
}: {
  listing: { _id: string; slug: string; title: string; category?: string; subcategory?: string; actions?: string[] | null };
  products: CatalogProduct[];
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const lang = en ? "en" : "sq";
  const kind = getOfferKind(listing);
  const copy = MANAGER_COPY[kind];
  const router = useRouter();
  const searchParams = useSearchParams();
  // Arrived straight from "Add listing" — this is that flow's last step, not a
  // standalone dashboard visit, so the header reads as "finish setting up" rather
  // than "manage" and "Back" would otherwise return into the wizard's history.
  const isOnboarding = searchParams.get("onboarding") === "1";

  return (
    <div style={{ background: "var(--surface-page)" }} className="min-h-screen pb-16">
      <section style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}>
        <div className="page-shell py-8 sm:py-10">
          {isOnboarding ? (
            <div
              className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
              style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
            >
              <BadgeCheck className="h-3.5 w-3.5" />
              {en ? "Last step — your listing is already submitted" : "Hapi i fundit — listimi juaj u dërgua tashmë"}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
              style={{ color: "var(--text-tertiary)" }}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {en ? "Back" : "Kthehu prapa"}
            </button>
          )}
          <p className="eyebrow mb-3">{copy.manage[lang]}</p>
          <h1
            className="font-bold tracking-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
          >
            {listing.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
            {isOnboarding
              ? en
                ? "One more thing: add what you offer here so customers can order it right away. You can always add more later from your dashboard."
                : "Edhe një gjë: shtoni këtu çfarë ofroni që klientët ta porosisin menjëherë. Mund të shtoni e të modifikoni gjithmonë më vonë nga paneli juaj."
              : copy.intro[lang]}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Link
              href={`/listings/${listing.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
              style={{ color: "var(--brand-accent)" }}
            >
              {en ? "View listing" : "Shiko listimin"} →
            </Link>
            {isOnboarding && (
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--brand-accent)" }}
              >
                {en ? "Finish — go to dashboard" : "Përfundo — shko te paneli"}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="page-shell mt-8">
        <CatalogManager listing={listing} initialProducts={products} />
      </div>
    </div>
  );
}
