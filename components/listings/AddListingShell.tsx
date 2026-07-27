"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Calendar,
  Camera,
  Car,
  Compass,
  Home,
  MapPin,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed
} from "lucide-react";
import ListingForm from "@/components/forms/ListingForm";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/lib/constants";

const categoryIcons: Record<string, React.ReactNode> = {
  akomodim: <Home className="h-7 w-7" />,
  restorante: <UtensilsCrossed className="h-7 w-7" />,
  atraksione: <Compass className="h-7 w-7" />,
  evente: <Calendar className="h-7 w-7" />,
  "sherbime-turistike": <Briefcase className="h-7 w-7" />,
  "produkte-lokale": <MapPin className="h-7 w-7" />,
  transport: <Car className="h-7 w-7" />
};

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

  const tips = [
    { icon: Camera, title: t.addListing.tip1Title, desc: t.addListing.tip1Desc },
    { icon: Sparkles, title: t.addListing.tip2Title, desc: t.addListing.tip2Desc },
    { icon: MapPin, title: t.addListing.tip3Title, desc: t.addListing.tip3Desc }
  ];

  return (
    <div style={{ background: "var(--surface-page)" }}>
      {/* ---------- Page header ---------- */}
      <section
        style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}
      >
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

          <p className="eyebrow mb-3">{en ? "New listing" : "Listim i ri"}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
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
                className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold"
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

      <section className="page-shell py-8 sm:py-10">
        {categoryDef ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div id="listing-form">
              <ListingForm />
            </div>

            {/* ---------- Helper column ---------- */}
            <aside className="space-y-4 lg:sticky lg:top-28">
              <div
                className="rounded-2xl border bg-white p-5"
                style={{ borderColor: "var(--border-soft)", boxShadow: "var(--shadow-card)" }}
              >
                <p className="eyebrow mb-4">{t.addListing.proTips}</p>
                <ul className="space-y-4">
                  {tips.map((tip) => (
                    <li key={tip.title} className="flex gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
                      >
                        <tip.icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {tip.title}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                          {tip.desc}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-2xl border p-5"
                style={{ borderColor: "var(--brand-border)", background: "var(--brand-light)" }}
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white"
                  style={{ background: "var(--brand-accent)" }}
                >
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <p className="mt-3 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {en ? "Verified profile" : "Profili Verified"}
                </p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {en
                    ? "Website, Book Now, Instagram, Facebook and a gallery of up to 10 photos unlock with the Verified badge."
                    : "Website, Book Now, Instagram, Facebook dhe galeria deri në 10 foto aktivizohen me statusin Verified."}
                </p>
                <Link href="/packet" className="btn-primary mt-4 w-full text-xs">
                  <BadgeCheck className="h-4 w-4" />
                  {en ? "Get Verified" : "Bëhu Verified"}
                </Link>
              </div>
            </aside>
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
