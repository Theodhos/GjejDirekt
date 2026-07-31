"use client";

import { Check, X, ArrowRight, Rocket, BadgeCheck, Megaphone, Crown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

function PacketPageClient() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams?.get("listingId") || "";
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [freeLoading, setFreeLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setIsAuthenticated(!!data.user);
        setUser(data.user || null);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
  }, []);

  const requireLogin = () => {
    router.push(`/login?callback=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  };

  const handlePackageClick = (e: React.MouseEvent) => {
    if (isAuthenticated === false) {
      e.preventDefault();
      requireLogin();
    }
  };

  const handlePaidPackageClick = (pkg: any) => {
    if (isAuthenticated === false) {
      requireLogin();
      return;
    }

    const userName = user?.name || user?.email || "N/A";
    const userEmail = user?.email || "N/A";
    const requestText = language === "en"
      ? `Hello TripShqip! I want to buy the ${pkg.name} package.\nPrice: €${pkg.price} ${pkg.priceSuffix}.\nDescription: ${pkg.description}.\nFeatures:\n- ${pkg.features.map((f: any) => (f.included ? "✅ " : "❌ ") + f.text).join("\n- ")}\nUser: ${userName}\nEmail: ${userEmail}\nListing ID: ${listingId || "N/A"}`
      : `Përshëndetje TripShqip! Dua të blej paketën ${pkg.name}.\nÇmimi: €${pkg.price} ${pkg.priceSuffix}.\nPërshkrimi: ${pkg.description}.\nKarakteristikat:\n- ${pkg.features.map((f: any) => (f.included ? "✅ " : "❌ ") + f.text).join("\n- ")}\nPërdoruesi: ${userName}\nEmail: ${userEmail}\nListing ID: ${listingId || "N/A"}`;

    const whatsappUrl = `https://wa.me/355695429998?text=${encodeURIComponent(requestText)}`;
    window.open(whatsappUrl, "_blank");
  };

  // Free package: no payment — just email the user an invoice/confirmation.
  const handleFreeStart = async () => {
    if (isAuthenticated === false) {
      requireLogin();
      return;
    }
    setFreeLoading(true);
    try {
      const res = await fetch("/api/packages/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, listingId })
      });
      if (res.ok) {
        toast.success(
          language === "en"
            ? "Done! We've emailed your invoice."
            : "U krye! Ju dërguam faturën në email."
        );
      } else {
        toast.error(language === "en" ? "Something went wrong." : "Ndodhi një gabim.");
      }
    } catch {
      toast.error(language === "en" ? "Something went wrong." : "Ndodhi një gabim.");
    } finally {
      setFreeLoading(false);
    }
  };

  const packages = [
    {
      id: "free",
      name: language === "en" ? "Free" : "Falas",
      icon: Rocket,
      price: "0",
      priceSuffix: language === "en" ? "free" : "falas",
      subtitle: language === "en"
        ? "Basic online presence"
        : "Prezenca bazë online",
      description: language === "en"
        ? "Start at no cost and become part of Albania's tourism database."
        : "Filloni pa asnjë kosto dhe bëhuni pjesë e databazës turistike të Shqipërisë.",
      features: [
        { text: language === "en" ? "Free listing" : "Listim falas", included: true },
        { text: language === "en" ? "1 cover photo" : "1 foto cover", included: true },
        { text: language === "en" ? "Description" : "Përshkrimi", included: true },
        { text: language === "en" ? "Phone number" : "Telefon", included: true },
        { text: "WhatsApp", included: true },
        { text: "Google Maps", included: true },
        { text: language === "en" ? "Working hours (if applicable)" : "Orari (kur aplikohet)", included: true },
        { text: language === "en" ? "Basic features" : "Karakteristikat bazë", included: true },
        { text: language === "en" ? "Tags" : "Tag-et", included: true },
        { text: "Website", included: false },
        { text: language === "en" ? "Social media" : "Rrjetet sociale", included: false },
        { text: "Book Now", included: false },
        { text: language === "en" ? "Verified Badge" : "Badge Verified", included: false },
        { text: "Ads / Ads Pro", included: false },
      ],
      cta: language === "en" ? "Start Free" : "Fillo Falas",
    },
    {
      id: "verified",
      name: "Verified",
      icon: BadgeCheck,
      price: "50",
      priceSuffix: language === "en" ? "one-time" : "një herë",
      subtitle: language === "en"
        ? "Only Verified businesses can use Ads and Ads Pro."
        : "Vetëm bizneset Verified mund të përdorin Ads dhe Ads Pro.",
      description: language === "en"
        ? "The Verified badge shows tourists that the business has a verified profile."
        : "Badge Verified u tregon turistëve se biznesi ka një profil të verifikuar.",
      features: [
        { text: language === "en" ? "Everything in Free +" : "Gjithçka nga Falas +", included: true },
        { text: language === "en" ? "Verified Badge" : "Badge Verified", included: true },
        { text: language === "en" ? "Up to 10 photos" : "Deri në 10 foto", included: true },
        { text: "Website", included: true },
        { text: "Facebook", included: true },
        { text: "Instagram", included: true },
        { text: "TikTok", included: true },
        { text: "YouTube", included: true },
        { text: "Book Now", included: true },
        { text: language === "en" ? "Eligible for Ads" : "E drejtë për Ads", included: true },
        { text: language === "en" ? "Eligible for Ads Pro" : "E drejtë për Ads Pro", included: true },
      ],
      cta: language === "en" ? "Become Verified" : "Bëhu Verified",
    },
    {
      id: "ads",
      name: "Ads",
      icon: Megaphone,
      price: "50",
      priceSuffix: language === "en" ? "/ year" : "/ vit",
      subtitle: language === "en"
        ? "Increase your business visibility."
        : "Rrit shikueshmërinë e biznesit tuaj.",
      description: language === "en"
        ? "For Verified businesses that want to appear more often and get more visits."
        : "Për bizneset Verified që duan të shfaqen më shpesh dhe të marrin më shumë vizita.",
      features: [
        { text: language === "en" ? "Everything in Verified +" : "Gjithçka nga Verified +", included: true },
        { text: language === "en" ? "Ad Badge" : "Badge Ad", included: true },
        { text: language === "en" ? "More visibility in category" : "Më shumë shikueshmëri në kategori", included: true },
        { text: language === "en" ? "Priority in search results" : "Prioritet në rezultatet e kërkimit", included: true },
        { text: language === "en" ? "More exposure for a year" : "Më shumë ekspozim për një vit", included: true },
      ],
      note: language === "en" ? "Only for Verified businesses." : "Vetëm për bizneset Verified.",
      cta: language === "en" ? "Activate Ads" : "Aktivizo Ads",
    },
    {
      id: "ads-pro",
      name: "Ads Pro",
      icon: Crown,
      price: "30",
      priceSuffix: language === "en" ? "/ month" : "/ muaj",
      popular: true,
      subtitle: language === "en"
        ? "Maximum exposure for your business."
        : "Ekspozimi maksimal për biznesin tuaj.",
      description: language === "en"
        ? "For Verified businesses that want to always be visible."
        : "Për bizneset Verified që duan të jenë gjithmonë të dukshme.",
      features: [
        { text: language === "en" ? "Everything in Ads +" : "Gjithçka nga Ads +", included: true },
        { text: language === "en" ? "Highlighted (underlined background)" : "Highlighted (sfond i nenvizuar)", included: true },
        { text: language === "en" ? "Always on top of the category" : "Gjithmonë në krye të kategorisë", included: true },
        { text: language === "en" ? "Maximum priority in search" : "Prioritet maksimal në kërkim", included: true },
        { text: language === "en" ? "Highest exposure on the platform" : "Ekspozimi më i lartë në platformë", included: true },
      ],
      note: language === "en" ? "Only for Verified businesses." : "Vetëm për bizneset Verified.",
      cta: language === "en" ? "Activate Ads Pro" : "Aktivizo Ads Pro",
    }
  ];

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--surface-cream)", borderBottom: "1px solid var(--border-soft)" }}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(31,138,112,0.06)", filter: "blur(100px)" }} />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-[300px] h-[300px] rounded-full" style={{ background: "rgba(31,138,112,0.05)", filter: "blur(80px)" }} />

        <div className="page-shell relative z-10 py-8 text-center max-w-2xl mx-auto">
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-7xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="relative flex flex-col h-full transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--surface-white)",
                border: pkg.popular || pkg.id === "ads"
                  ? "2px solid var(--brand-accent)"
                  : "1px solid var(--border-soft)",
                borderRadius: "16px",
                boxShadow: pkg.popular ? "0 8px 32px rgba(31,138,112,0.18)" : "var(--shadow-card)",
                padding: "2rem"
              }}
            >
              {/* Popular badge */}
              {pkg.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: "var(--brand-accent)" }}
                >
                  {language === "en" ? "Most Popular" : "Më Popullorja"}
                </div>
              )}

              {/* Icon */}
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl mb-5"
                style={{ background: "var(--brand-light)" }}
              >
                <pkg.icon className="w-6 h-6" style={{ color: "var(--brand-accent)" }} />
              </div>

              {/* Name + subtitle + description */}
              <h2 className="text-xl font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>
                {pkg.name}
              </h2>
              <p className="text-[15px] font-medium leading-snug mb-2" style={{ color: "var(--brand-accent)" }}>
                {pkg.subtitle}
              </p>
              <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                {pkg.description}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>€{pkg.price}</span>
                <span className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                  {pkg.priceSuffix}
                </span>
              </div>

              {/* Note */}
              {pkg.note ? (
                <p className="text-xs font-medium mb-5" style={{ color: "var(--brand-hover)" }}>{pkg.note}</p>
              ) : (
                <div className="mb-5" />
              )}

              {/* Divider */}
              <div style={{ borderTop: "1px solid var(--border-soft)", marginBottom: "1.25rem" }} />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature: any, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5"
                      style={{ background: feature.included ? "var(--brand-light)" : "var(--surface-cream)" }}
                    >
                      {feature.included ? (
                        <Check className="w-3 h-3" style={{ color: "var(--brand-accent)" }} />
                      ) : (
                        <X className="w-3 h-3" style={{ color: "var(--text-tertiary)" }} />
                      )}
                    </div>
                    <span
                      className="text-[14px] leading-snug"
                      style={{ color: feature.included ? "var(--text-secondary)" : "var(--text-tertiary)", textDecoration: feature.included ? "none" : "line-through" }}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {pkg.id === "free" ? (
                <button
                  type="button"
                  onClick={handleFreeStart}
                  disabled={freeLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "var(--text-primary)" }}
                >
                  {freeLoading
                    ? (language === "en" ? "Sending..." : "Duke dërguar...")
                    : pkg.cta}
                  {!freeLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handlePaidPackageClick(pkg)}
                  className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
                  style={{
                    background: pkg.popular ? "var(--brand-accent)" : "var(--text-primary)",
                    boxShadow: pkg.popular ? "0 4px 16px rgba(31,138,112,0.18)" : "none"
                  }}
                >
                  {pkg.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

      </section>
    </main>
  );
}

export default PacketPageClient;
