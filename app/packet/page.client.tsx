"use client";

import { Check, ArrowRight, Shield, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function PacketPageClient() {
  const { language } = useLanguage();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setIsAuthenticated(!!data.user))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handlePackageClick = (e: React.MouseEvent, href: string) => {
    if (isAuthenticated === false) {
      e.preventDefault();
      router.push(`/login?callback=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  };

  const packages = [
    {
      id: "verify",
      name: "Verify",
      icon: Shield,
      price: "5",
      accent: "#3B82F6",
      accentLight: "rgba(59,130,246,0.08)",
      accentBorder: "rgba(59,130,246,0.18)",
      features: [
        language === "en" ? "Verified Badge on your listing" : "Distinktivi i verifikuar në listimin tuaj",
        language === "en" ? "Basic priority in search results" : "Prioritet bazë në rezultatet e kërkimit",
        language === "en" ? "Direct WhatsApp & Phone contact" : "Kontakt direkt me WhatsApp & Telefon",
        language === "en" ? "Appear in category sections" : "Shfaqja në seksionet e kategorive",
      ],
      description: language === "en"
        ? "Build trust with your customers through verification."
        : "Ndërtoni besim me klientët tuaj përmes verifikimit."
    },
    {
      id: "trending",
      name: "Trending",
      icon: Flame,
      price: "10",
      accent: "#F97316",
      accentLight: "rgba(249,115,22,0.08)",
      accentBorder: "rgba(249,115,22,0.22)",
      popular: true,
      features: [
        language === "en" ? "Everything in Verify package" : "Gjithçka në paketën Verify",
        language === "en" ? "Higher ranking than Verify users" : "Renditje më e lartë se përdoruesit Verify",
        language === "en" ? "Featured in 'Trending' sections" : "I rekomanduar në seksionet 'Trending'",
        language === "en" ? "Priority support 24/7" : "Suport prioritar 24/7",
        language === "en" ? "Analytics for your listing" : "Analitika për listimin tuaj",
      ],
      description: language === "en"
        ? "Get more visibility and attract more customers."
        : "Merrni më shumë shikueshmëri dhe tërhiqni më shumë klientë."
    },
    {
      id: "features",
      name: "Features",
      icon: Sparkles,
      price: "15",
      accent: "#EAB308",
      accentLight: "rgba(234,179,8,0.08)",
      accentBorder: "rgba(234,179,8,0.22)",
      features: [
        language === "en" ? "Everything in Trending package" : "Gjithçka në paketën Trending",
        language === "en" ? "Highest ranking in all sections" : "Renditja më e lartë në të gjitha seksionet",
        language === "en" ? "Featured on Home Hero section" : "I rekomanduar në seksionin Home Hero",
        language === "en" ? "Professional photo review" : "Rishikim profesional i fotove",
        language === "en" ? "Custom promotion on social media" : "Promovim i personalizuar në rrjetet sociale",
      ],
      description: language === "en"
        ? "The ultimate package for maximum growth and reach."
        : "Paketa përfundimtare për rritje dhe shtrirje maksimale."
    }
  ];

  const searchParams = useSearchParams();
  const listingId = searchParams?.get("listingId") || "";

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--surface-cream)", borderBottom: "1px solid var(--border-soft)" }}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(34,153,120,0.05)", filter: "blur(100px)" }} />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-[300px] h-[300px] rounded-full" style={{ background: "rgba(34,153,120,0.04)", filter: "blur(80px)" }} />

        <div className="page-shell relative z-10 pt-16 pb-16 text-center max-w-2xl mx-auto">
          <p className="eyebrow mb-4">
            {language === "en" ? "Grow your business" : "Rrit biznesin tënd"}
          </p>
          <h1
            className="font-bold tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
          >
            {language === "en" ? "Choose Your Growth Package" : "Zgjidhni Paketën tuaj të Rritjes"}
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {language === "en"
              ? "Boost your business visibility and reach more tourists."
              : "Rritni shikueshmërinë e biznesit tuaj dhe arrini më shumë turistë."}
          </p>
        </div>
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="page-shell py-14">
        <div className="grid gap-6 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--surface-white)",
                border: pkg.popular ? `2px solid ${pkg.accent}` : "1px solid var(--border-soft)",
                borderRadius: "16px",
                boxShadow: pkg.popular ? `0 8px 32px ${pkg.accentBorder}` : "var(--shadow-card)",
                padding: "2rem"
              }}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: pkg.accent }}
                >
                  {language === "en" ? "Most Popular" : "Më Popullorja"}
                </div>
              )}

              {/* Icon */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl mb-5"
                style={{ background: pkg.accentLight }}
              >
                <pkg.icon className="w-5 h-5" style={{ color: pkg.accent }} />
              </div>

              {/* Name + description */}
              <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                {pkg.name}
              </h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                {pkg.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>€{pkg.price}</span>
                <span className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                  / {language === "en" ? "month" : "muaj"}
                </span>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--border-soft)", marginBottom: "1.25rem" }} />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5"
                      style={{ background: "rgba(34,153,120,0.1)" }}
                    >
                      <Check className="w-3 h-3" style={{ color: "var(--brand-accent)" }} />
                    </div>
                    <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={`/checkout?packet=${pkg.id}&price=${pkg.price}&listingId=${listingId}`}
                onClick={(e) => handlePackageClick(e, `/checkout?packet=${pkg.id}&price=${pkg.price}&listingId=${listingId}`)}
                className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
                style={{
                  background: pkg.popular ? pkg.accent : "var(--text-primary)",
                  boxShadow: pkg.popular ? `0 4px 16px ${pkg.accentBorder}` : "none"
                }}
              >
                {language === "en" ? "Get Started" : "Fillo Tani"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}

export default PacketPageClient;
