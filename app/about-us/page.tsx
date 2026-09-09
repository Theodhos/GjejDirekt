"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const categories = [
  { icon: "🏨", title_en: "Accommodations", title_al: "Akomodime", desc_en: "Boutique hotels, villas, and local guesthouses.", desc_al: "Hotele boutique, vila dhe shtëpi pritëse lokale." },
  { icon: "🍽️", title_en: "Restaurants", title_al: "Restorante", desc_en: "Enjoy authentic Albanian cuisine and modern dining.", desc_al: "Shijoni kuzhinën autentike shqiptare dhe ushqimin modern." },
  { icon: "🏔️", title_en: "Attractions", title_al: "Atraksione", desc_en: "Explore castles, canyons, and stunning beaches.", desc_al: "Eksploroni kështjellat, kanionet dhe plazhet mahnitëse." },
  { icon: "🎉", title_en: "Events & Activities", title_al: "Evente & Aktivitete", desc_en: "Festivals, concerts, and exciting outdoor tours.", desc_al: "Festivale, koncerte dhe ture të jashtëzakonshme." },
  { icon: "🚤", title_en: "Tour Guides", title_al: "Guida Turistike", desc_en: "Professional guides revealing hidden Albanian gems.", desc_al: "Guida profesionale që zbulojnë perlat e fshehura." },
  { icon: "🧀", title_en: "Local Products", title_al: "Produkte Lokale", desc_en: "Artisan crafts, organic foods, and local wines.", desc_al: "Punime artizanale, ushqime organike dhe verëra lokale." },
  { icon: "🚕", title_en: "Transport", title_al: "Transport", desc_en: "Rentals, direct taxi lines, airport transfers.", desc_al: "Makina me qira, linja taksi direkte, transferta aeroporti." },
  { icon: "✨", title_en: "Tourism Services", title_al: "Shërbime Turistike", desc_en: "Everything you need to secure your journey.", desc_al: "Gjithçka që ju nevojitet për të siguruar udhëtimin tuaj." }
];

const missionPoints = [
  { en: "Easily find places and businesses.", al: "Gjetur lehtë vende dhe biznese." },
  { en: "Contact hosts and business owners directly.", al: "Kontaktuar direkt me pronarët e bizneseve." },
  { en: "Organize your holidays faster without middlemen.", al: "Organizuar pushimet më shpejt pa ndërmjetës." }
];

const supports = [
  { en: "Local Businesses", al: "Bizneset lokale" },
  { en: "Authentic Tourism", al: "Turizmin autentik" },
  { en: "Real Albanian Experiences", al: "Eksperiencat reale shqiptare" }
];

export default function AboutUsPage() {
  const { language } = useLanguage();

  return (
    <div style={{ background: "var(--surface-page)", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section
        style={{
          background: "var(--surface-cream)",
          borderBottom: "1px solid var(--border-soft)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute", top: "-80px", right: "-80px",
            width: "500px", height: "500px", borderRadius: "50%",
            background: "rgba(225,29,46,0.05)", filter: "blur(110px)",
            pointerEvents: "none"
          }}
        />
        <div className="page-shell" style={{ position: "relative", zIndex: 10, paddingTop: "2rem", paddingBottom: "2rem" }}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8" style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-tertiary)" }}>
            <Link href="/" style={{ color: "var(--text-tertiary)" }} className="hover:text-brand-600 transition-colors">
              {language === "en" ? "Home" : "Kreu"}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>
              {language === "en" ? "About Us" : "Rreth Nesh"}
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-center">
            <div>
              <p className="eyebrow mb-4">
                {language === "en" ? "Welcome to GjejDirekt" : "Mirësevini në GjejDirekt"}
              </p>
              <h1
                className="font-bold tracking-tight mb-5 leading-tight"
                style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}
              >
                {language === "en" ? "Welcome to GjejDirekt 🇦🇱" : "Mirësevini në GjejDirekt 🇦🇱"}
              </h1>
              <p
                className="text-base leading-relaxed mb-7 max-w-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                {language === "en"
                  ? "GjejDirekt is a modern tourism platform that helps tourists discover Albania more easily and local businesses get found faster."
                  : "GjejDirekt është një platformë moderne turistike që ndihmon turistët të zbulojnë Shqipërinë më lehtë dhe bizneset lokale të gjenden më shpejt."}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: "var(--brand-accent)", boxShadow: "0 2px 10px rgba(225,29,46,0.22)" }}
                >
                  {language === "en" ? "Explore Services" : "Eksploro Shërbimet"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/create-listing"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-neutral-100"
                  style={{ background: "var(--surface-white)", border: "1px solid var(--border-medium)", color: "var(--text-primary)" }}
                >
                  {language === "en" ? "Become a Host" : "Bëhu një Host"}
                </Link>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                borderRadius: "16px",
                height: "380px",
                border: "1px solid var(--border-soft)",
                boxShadow: "var(--shadow-panel)",
                overflow: "hidden"
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"
                alt="Beautiful Albania Landscape"
                fill
                className="object-cover"
                sizes="400px"
                priority
              />
              <div
                style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(10,12,16,0.6) 0%, transparent 60%)"
                }}
              />
              <div
                style={{
                  position: "absolute", bottom: "1.25rem", left: "1.25rem", right: "1.25rem",
                  padding: "1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)"
                }}
              >
                <p className="eyebrow mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {language === "en" ? "Explore Albania" : "Eksploro Shqipërinë"}
                </p>
                <p className="text-sm font-semibold text-white">
                  {language === "en" ? "Stays, Food & Authentic Culture" : "Qëndrimet, Ushqimi & Kultura Autentike"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR GOAL ── */}
      <section style={{ background: "var(--surface-white)", borderBottom: "1px solid var(--border-soft)" }}>
        <div className="page-shell" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
          <p className="eyebrow mb-4">{language === "en" ? "Our Goal" : "Qëllimi Ynë"}</p>
          <h2
            className="font-bold tracking-tight max-w-2xl"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", color: "var(--text-primary)" }}
          >
            {language === "en"
              ? "Promoting Albanian tourism and authentic family experiences."
              : "Promovimi i turizmit shqiptar dhe eksperiencave autentike familjare."}
          </h2>
          <p
            className="mt-5 text-base leading-relaxed max-w-2xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {language === "en"
              ? "Our goal is to promote Albanian tourism, authentic experiences, and the family businesses that make Albania unique."
              : "Qëllimi ynë është të promovojmë turizmin shqiptar, eksperiencat autentike dhe bizneset familjare që e bëjnë Shqipërinë unike."}
          </p>
        </div>
      </section>

      {/* ── BROWSE BY COLLECTION ── */}
      <section style={{ borderBottom: "1px solid var(--border-soft)" }}>
        <div className="page-shell" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
            <div>
              <p className="eyebrow mb-2">{language === "en" ? "Discovery Hub" : "Qendra e Zbulimit"}</p>
              <h2
                className="font-bold tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", color: "var(--text-primary)" }}
              >
                {language === "en" ? "On GjejDirekt You Can Find:" : "Në GjejDirekt Mund Të Gjeni:"}
              </h2>
            </div>
            <Link
              href="/services"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--brand-accent)" }}
            >
              {language === "en" ? "Explore all →" : "Shiko të gjitha →"}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href="/services"
                className="group flex flex-col items-center text-center rounded-2xl px-4 py-6 transition-all duration-300 hover:border-brand-300"
                style={{
                  background: "var(--surface-cream)",
                  border: "1px solid var(--border-soft)"
                }}
              >
                <span className="text-3xl mb-3 block">{cat.icon}</span>
                <span className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                  {language === "en" ? cat.title_en : cat.title_al}
                </span>
                <span className="text-xs mt-1 leading-snug" style={{ color: "var(--text-tertiary)" }}>
                  {language === "en" ? cat.desc_en : cat.desc_al}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BELIEF + MISSION ── */}
      <section style={{ background: "var(--surface-white)", borderBottom: "1px solid var(--border-soft)" }}>
        <div className="page-shell grid gap-6 lg:grid-cols-2" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
          {/* Belief */}
          <div
            className="relative overflow-hidden rounded-2xl p-8 flex flex-col justify-between"
            style={{ background: "var(--text-primary)", minHeight: "280px" }}
          >
            <div
              style={{
                position: "absolute", top: 0, left: 0,
                width: "192px", height: "192px", borderRadius: "50%",
                background: "rgba(225,29,46,0.12)", filter: "blur(60px)",
                pointerEvents: "none"
              }}
            />
            <div style={{ position: "relative", zIndex: 10 }}>
              <p className="eyebrow mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                {language === "en" ? "Our Belief" : "Besimi Ynë"}
              </p>
              <p
                className="font-semibold text-white leading-relaxed"
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.375rem)" }}
              >
                {language === "en"
                  ? "\u201CWe believe every journey is important and should be simple, authentic, and direct.\u201D"
                  : "\u201CNe besojmë se çdo udhëtim është i rëndësishëm dhe duhet të jetë: i thjeshtë, autentik dhe direkt.\u201D"}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6" style={{ position: "relative", zIndex: 10 }}>
              <Heart className="w-4 h-4 animate-pulse" style={{ color: "var(--brand-accent)", fill: "var(--brand-accent)" }} />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,0.5)" }}>
                {language === "en" ? "GjejDirekt Philosophy" : "Filozofia e GjejDirekt"}
              </span>
            </div>
          </div>

          {/* Mission */}
          <div
            className="rounded-2xl p-8"
            style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", boxShadow: "var(--shadow-card)" }}
          >
            <p className="eyebrow mb-2">{language === "en" ? "Our Mission" : "Misioni Ynë"}</p>
            <h3
              className="font-bold tracking-tight mb-5"
              style={{ fontSize: "1.375rem", color: "var(--text-primary)" }}
            >
              {language === "en" ? "Built For Discovery" : "Të Ndërtuar Për Zbulim"}
            </h3>
            <div className="space-y-3">
              {missionPoints.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-3"
                  style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                >
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--brand-accent)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {language === "en" ? item.en : item.al}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPORTS ── */}
      <section style={{ background: "var(--surface-cream)", borderBottom: "1px solid var(--border-soft)" }}>
        <div className="page-shell" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-center">
            <div>
              <p className="eyebrow mb-4">{language === "en" ? "Community Support" : "Mbështetja e Komunitetit"}</p>
              <h2
                className="font-bold tracking-tight mb-6"
                style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", color: "var(--text-primary)" }}
              >
                {language === "en" ? "GjejDirekt Supports:" : "GjejDirekt Mbështet:"}
              </h2>
              <div className="space-y-3 mb-6">
                {supports.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)" }}
                  >
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--brand-accent)" }} />
                    <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {language === "en" ? s.en : s.al}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-base leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
                {language === "en"
                  ? "We aim to create the largest and most organized tourism database in Albania, connecting travelers with local gems."
                  : "Ne synojmë të krijojmë databazën turistike më të madhe dhe më të organizuar në Shqipëri, duke lidhur udhëtarët me thesaret lokale."}
              </p>
            </div>
            <div
              style={{
                position: "relative",
                borderRadius: "16px",
                height: "280px",
                border: "1px solid var(--border-soft)",
                boxShadow: "var(--shadow-card)",
                overflow: "hidden"
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
                alt="Local products"
                fill
                className="object-cover"
                sizes="360px"
              />
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
