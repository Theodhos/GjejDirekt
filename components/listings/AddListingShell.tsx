"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import ListingWizard from "@/components/forms/ListingWizard";
import ListingFormAside from "@/components/listings/ListingFormAside";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/lib/constants";
import { categoryIcons } from "@/lib/category-icons";

export default function AddListingShell() {
  const { language, t } = useLanguage();
  const en = language === "en";
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryParam = searchParams.get("category");
  const categoryDef = categories.find((item) => item.value === categoryParam);
  const categoryLabel = categoryDef
    ? t.categories.names[categoryDef.value as keyof typeof t.categories.names] || categoryDef.label
    : null;

  return (
    <div style={{ background: "var(--surface-page)" }}>
      {/* ---------- Page header ---------- */}
      <section style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}>
        {/* On phones only the category chip survives — every other line is dropped
            so the form starts as high up the screen as possible. */}
        <div className="page-shell py-3 sm:py-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 hidden items-center gap-1.5 text-xs font-semibold transition-colors sm:inline-flex"
            style={{ color: "var(--text-tertiary)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {en ? "Back" : "Kthehu prapa"}
          </button>

          <p className="eyebrow mb-3 hidden sm:block">{en ? "New listing" : "Listim i ri"}</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between sm:gap-4">
            <div className="hidden max-w-2xl sm:block">
              <h1
                className="font-bold tracking-tight"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
              >
                {t.addListing.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed sm:text-base" style={{ color: "var(--text-secondary)" }}>
                {t.addListing.subtitle}
              </p>
            </div>

            {categoryLabel && (
              <span
                className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2 sm:text-sm"
                style={{
                  borderColor: "var(--brand-border)",
                  background: "var(--brand-light)",
                  color: "var(--brand-accent)"
                }}
              >
                {categoryIcons[categoryDef!.value] ? (
                  <span className="[&>svg]:h-4 [&>svg]:w-4">{categoryIcons[categoryDef!.value]}</span>
                ) : null}
                {categoryLabel}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="page-shell pb-8 pt-4 sm:py-10">
        {categoryDef ? (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-6">
            <div id="listing-form">
              <ListingWizard />
            </div>
            <ListingFormAside />
          </div>
        ) : (
          /* ---------- No (or invalid) ?category= — pick one first ---------- */
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold sm:text-2xl" style={{ color: "var(--text-primary)" }}>
                {en ? "Choose the service category" : "Zgjidhni kategorinë e shërbimit"}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {en
                  ? "The form adapts to the category you pick."
                  : "Formulari përshtatet sipas kategorisë që zgjidhni."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => router.replace(`/listings/add?category=${category.value}`)}
                  className="group flex flex-col items-center gap-3 rounded-2xl border bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{ borderColor: "var(--border-soft)", boxShadow: "var(--shadow-card)" }}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full transition-colors"
                    style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
                  >
                    {categoryIcons[category.value] || <MapPin className="h-7 w-7" />}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {t.categories.names[category.value as keyof typeof t.categories.names] || category.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
