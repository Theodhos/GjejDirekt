"use client";

import Link from "next/link";
import { BadgeCheck, Camera, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/** Helper column shared by the add and the edit listing pages. */
export default function ListingFormAside({ verified = false }: { verified?: boolean }) {
  const { language, t } = useLanguage();
  const en = language === "en";

  const tips = [
    { icon: Camera, title: t.addListing.tip1Title, desc: t.addListing.tip1Desc },
    { icon: Sparkles, title: t.addListing.tip2Title, desc: t.addListing.tip2Desc },
    { icon: MapPin, title: t.addListing.tip3Title, desc: t.addListing.tip3Desc }
  ];

  return (
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
          {verified ? <BadgeCheck className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
        </span>
        <p className="mt-3 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          {verified
            ? en
              ? "Verified listing"
              : "Listim Verified"
            : en
              ? "Verified profile"
              : "Profili Verified"}
        </p>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {verified
            ? en
              ? "Website, Book Now, Instagram, Facebook and the 10-photo gallery are active in step 4."
              : "Website, Book Now, Instagram, Facebook dhe galeria me 10 foto janë aktive te hapi 4."
            : en
              ? "Website, Book Now, Instagram, Facebook and a gallery of up to 10 photos unlock with the Verified badge."
              : "Website, Book Now, Instagram, Facebook dhe galeria deri në 10 foto aktivizohen me statusin Verified."}
        </p>
        {!verified && (
          <Link href="/packet" className="btn-primary mt-4 w-full text-xs">
            <BadgeCheck className="h-4 w-4" />
            {en ? "Get Verified" : "Bëhu Verified"}
          </Link>
        )}
      </div>
    </aside>
  );
}
