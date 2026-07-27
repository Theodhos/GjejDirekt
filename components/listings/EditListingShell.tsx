"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BadgeCheck, Eye, Lock } from "lucide-react";
import ListingWizard, { type WizardListing } from "@/components/forms/ListingWizard";
import ListingFormAside from "@/components/listings/ListingFormAside";
import { useLanguage } from "@/context/LanguageContext";
import { getCategoryFormValue } from "@/lib/constants";
import { categoryIcons } from "@/lib/category-icons";

const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
  approved: { bg: "#D1FAE5", color: "#047857", border: "#A7F3D0" },
  pending: { bg: "#FEF3C7", color: "#B45309", border: "#FDE68A" },
  rejected: { bg: "#FEE2E2", color: "#DC2626", border: "#FECACA" }
};

const statusLabels: Record<string, { en: string; al: string }> = {
  approved: { en: "Approved", al: "I miratuar" },
  pending: { en: "Pending", al: "Në pritje" },
  rejected: { en: "Rejected", al: "I refuzuar" }
};

export default function EditListingShell({ listing }: { listing: WizardListing }) {
  const { language, t } = useLanguage();
  const en = language === "en";
  const router = useRouter();

  const categoryValue = getCategoryFormValue(listing.category);
  const categoryLabel =
    t.categories.names[categoryValue as keyof typeof t.categories.names] || listing.category || "";
  const status = listing.status || "pending";
  const statusStyle = statusStyles[status] || statusStyles.pending;
  const statusText = statusLabels[status]?.[language] || status;
  const verified = Boolean(listing.verified);

  return (
    <div style={{ background: "var(--surface-page)" }}>
      {/* ---------- Page header ---------- */}
      <section style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}>
        <div className="page-shell py-8 sm:py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {en ? "Back" : "Kthehu prapa"}
          </button>

          <p className="eyebrow mb-3">{en ? "Edit listing" : "Modifiko listimin"}</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1
                className="font-bold tracking-tight"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
              >
                {listing.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
                {en
                  ? "Update the four steps below. Saved changes go back to an admin for review."
                  : "Përditësoni katër hapat më poshtë. Ndryshimet e ruajtura kalojnë sërish për rishikim te administratori."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categoryLabel && (
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
                  style={{
                    borderColor: "var(--brand-border)",
                    background: "var(--brand-light)",
                    color: "var(--brand-accent)"
                  }}
                >
                  {categoryIcons[categoryValue] ? (
                    <span className="[&>svg]:h-4 [&>svg]:w-4">{categoryIcons[categoryValue]}</span>
                  ) : null}
                  {categoryLabel}
                </span>
              )}

              <span
                className="inline-flex items-center rounded-full border px-3 py-2 text-xs font-bold"
                style={{ background: statusStyle.bg, color: statusStyle.color, borderColor: statusStyle.border }}
              >
                {statusText}
              </span>

              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold"
                style={
                  verified
                    ? { background: "var(--brand-light)", color: "var(--brand-accent)", borderColor: "var(--brand-border)" }
                    : { background: "var(--surface-white)", color: "var(--text-tertiary)", borderColor: "var(--border-soft)" }
                }
              >
                {verified ? <BadgeCheck className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {verified ? "Verified" : en ? "Not verified" : "Pa verifikuar"}
              </span>

              {listing.slug && (
                <Link
                  href={`/listings/${listing.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition-colors"
                  style={{ borderColor: "var(--border-medium)", color: "var(--text-secondary)" }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {en ? "View" : "Shiko"}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-8 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div id="listing-form">
            <ListingWizard listing={listing} />
          </div>
          <ListingFormAside verified={verified} />
        </div>
      </section>
    </div>
  );
}
