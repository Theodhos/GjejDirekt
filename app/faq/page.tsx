"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, ChevronDown, Compass, Shield, Users, Mail, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  question: { en: string; al: string };
  answer: { en: string; al: string };
  category: "travelers" | "hosts" | "payments";
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "travelers",
    question: { en: "How do I book a stay or service on Gjej Direkt?", al: "Si mund të rezervoj një qëndrim ose shërbim në Gjej Direkt?" },
    answer: { en: "Gjej Direkt is a city-first discovery directory. Each listing features direct contact details (phone, exact address, and social links). You can contact the provider directly by clicking on 'Contact' or 'Book Now' to arrange your details directly with no platform fees!", al: "Gjej Direkt është një direktori zbulimi e fokusuar te qytetet. Çdo listim përmban detaje të drejtpërdrejta kontakti (telefon, adresë të saktë dhe rrjete sociale). Ju mund të kontaktoni drejtpërdrejt me ofruesin duke klikuar mbi 'Kontakt' ose 'Rezervo Tani' për të kryer marrëveshjen tuaj pa asnjë komision!" }
  },
  {
    category: "travelers",
    question: { en: "Are the listings on the platform verified?", al: "A janë të verifikuara shërbimet dhe listimet në platformë?" },
    answer: { en: "Yes! The moderation team at Gjej Direkt manually reviews and verifies every listing before they go live on our platform. This ensures only trusted, authentic local services are presented to travelers.", al: "Po! Ekipi i moderimit në Gjej Direkt shqyrton dhe verifikon manualisht çdo listim përpara se ato të bëhen publike. Kjo siguron që vetëm shërbimet e besuara dhe autentike lokale t'u prezantohen udhëtarëve." }
  },
  {
    category: "travelers",
    question: { en: "Can I filter listings by specific cities or categories?", al: "A mund t'i filtroj listimet sipas qyteteve apo kategorive të caktuara?" },
    answer: { en: "Absolutely! You can browse listings by selecting main categories or by visiting specific city pages where services are beautifully sorted for fast discovery.", al: "Plotësisht! Ju mund të shfletoni shërbimet duke përzgjedhur kategoritë kryesore ose duke vizituar faqet specifike të qyteteve ku shërbimet janë të organizuara shkëlqyeshëm." }
  },
  {
    category: "hosts",
    question: { en: "How can I add my business to Gjej Direkt?", al: "Si mund ta shtoj biznesin ose shërbimin tim në Gjej Direkt?" },
    answer: { en: "Listing your service is very simple! Register an account, click on 'Add Listing', choose your category, fill out the form with description, photos, business hours, and prices, and submit it. Our moderation team will review and approve it within 24 hours.", al: "Regjistrimi i shërbimit tuaj është shumë i thjeshtë! Regjistroni një llogari, klikoni në 'Shto Listim', zgjidhni kategorinë tuaj, plotësoni formularin dhe dërgojeni. Ekipi ynë do ta shqyrtojë dhe miratojë brenda 24 orëve." }
  },
  {
    category: "hosts",
    question: { en: "Is there a listing fee to register on the platform?", al: "A ka ndonjë tarifë për të regjistruar biznesin tim në platformë?" },
    answer: { en: "Gjej Direkt offers a free basic listing package for local tourism providers. For extra visibility or advanced promotion, we offer premium featured packages that you can view in your dashboard.", al: "Gjej Direkt ofron një paketë bazë regjistrimi krejtësisht falas. Për vizibilitet të shtuar, ofrojmë paketa premium që mund t'i shikoni në panelin tuaj." }
  },
  {
    category: "hosts",
    question: { en: "Can I manage multiple listings under one account?", al: "A mund të menaxhoj disa listime me një llogari të vetme?" },
    answer: { en: "Yes, you can list and edit as many listings as you want! From your personal Host Dashboard, you can see all your registered properties, edit prices, upload new gallery photos, and check approval status in real-time.", al: "Po, ju mund të regjistroni dhe të redaktoni sa listime të dëshironi! Nga paneli juaj personal, mund të shikoni të gjitha pronat tuaja, ndryshoni çmimet dhe kontrolloni statusin e tyre." }
  },
  {
    category: "payments",
    question: { en: "Does Gjej Direkt handle online payments or bookings?", al: "A kryen Gjej Direkt pagesa online ose rezervime direkte?" },
    answer: { en: "No, Gjej Direkt currently acts as a guide and direct connection engine. We do not charge commission fees! All payments and booking confirmations are agreed upon directly between you and the host.", al: "Jo, Gjej Direkt shërben si udhëzues dhe motor i lidhjes së drejtpërdrejtë. Ne nuk marrim asnjë komision! Të gjitha pagesat bëhen drejtpërdrejt mes jush dhe host-it." }
  },
  {
    category: "payments",
    question: { en: "Who do I contact if I have an issue with a booked stay?", al: "Me cilin duhet të kontaktoj nëse kam një problem me një akomodim të rezervuar?" },
    answer: { en: "Because bookings are handled directly, you should immediately contact the service provider using the contact phone or email listed on their page. For listing quality issues, you can report them to our support team.", al: "Duke qenë se rezervimet kryhen drejtpërdrejt, duhet të kontaktoni menjëherë ofruesin duke përdorur telefonin ose email-in e listuar. Për probleme me cilësinë, mund t'i raportoni tek ekipi ynë." }
  }
];

export default function FAQPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "travelers" | "hosts" | "payments">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const qText = language === "en" ? item.question.en : item.question.al;
      const aText = language === "en" ? item.answer.en : item.answer.al;
      const matchesSearch =
        qText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        aText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, language]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const categories = [
    { id: "all", labelEn: "All Questions", labelAl: "Të gjitha", icon: HelpCircle },
    { id: "travelers", labelEn: "For Travelers", labelAl: "Për Udhëtarët", icon: Users },
    { id: "hosts", labelEn: "For Hosts", labelAl: "Për Hostët", icon: Compass },
    { id: "payments", labelEn: "Trust & Bookings", labelAl: "Siguria & Rezervimet", icon: Shield }
  ];

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--surface-cream)", borderBottom: "1px solid var(--border-soft)" }}
      >
        <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(34,153,120,0.05)", filter: "blur(100px)" }} />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-[300px] h-[300px] rounded-full" style={{ background: "rgba(34,153,120,0.04)", filter: "blur(80px)" }} />

        <div className="page-shell relative z-10 pt-14 pb-14 text-center max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mb-6 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
            <Link href="/" className="hover:text-brand-600 transition-colors">
              {language === "en" ? "Home" : "Kreu"}
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>
              {language === "en" ? "FAQ" : "Pyetje të Shpeshta"}
            </span>
          </div>

          <p className="eyebrow mb-4">{language === "en" ? "Help Center" : "Qendra e Ndihmës"}</p>
          <h1
            className="font-bold tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
          >
            {language === "en" ? "Frequently Asked Questions" : "Pyetje të Shpeshta"}
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {language === "en"
              ? "Find answers quickly or contact our dedicated support team directly."
              : "Gjeni përgjigje shpejt ose kontaktoni direkt me ekipin tonë të dedikuar."}
          </p>
        </div>
      </section>

      <section className="page-shell py-12 max-w-3xl mx-auto">

        {/* Search */}
        <div className="relative mb-7">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-tertiary)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "en" ? "Search questions…" : "Kërko pyetje…"}
            className="w-full h-12 pl-11 pr-4 text-sm transition-all outline-none"
            style={{
              borderRadius: "12px",
              border: "1px solid var(--border-medium)",
              background: "var(--surface-white)",
              color: "var(--text-primary)",
              boxShadow: "var(--shadow-card)"
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = "var(--brand-accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--brand-ring)";
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = "var(--border-medium)";
              e.currentTarget.style.boxShadow = "var(--shadow-card)";
            }}
          />
        </div>

        {/* Category pills — exactly like Stay Directory's collection pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id as any); setOpenIndex(null); }}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all"
                style={{
                  background: active ? "var(--text-primary)" : "var(--surface-white)",
                  color: active ? "#fff" : "var(--text-secondary)",
                  border: active ? "1px solid transparent" : "1px solid var(--border-medium)",
                  boxShadow: active ? "0 2px 8px rgba(15,20,25,0.15)" : "none"
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {language === "en" ? cat.labelEn : cat.labelAl}
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-12">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="overflow-hidden transition-all"
                  style={{
                    background: "var(--surface-white)",
                    border: `1px solid ${isOpen ? "var(--border-medium)" : "var(--border-soft)"}`,
                    borderRadius: "14px",
                    boxShadow: isOpen ? "var(--shadow-hover)" : "var(--shadow-card)"
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between gap-4 text-left outline-none px-5 py-4"
                  >
                    <span className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
                      {language === "en" ? faq.question.en : faq.question.al}
                    </span>
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        background: isOpen ? "var(--brand-light)" : "var(--surface-subtle)",
                        color: isOpen ? "var(--brand-accent)" : "var(--text-tertiary)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                      }}
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? "400px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.35s ease"
                    }}
                  >
                    <div
                      className="px-5 pb-5 text-sm leading-relaxed"
                      style={{
                        color: "var(--text-secondary)",
                        borderTop: "1px solid var(--border-soft)"
                      }}
                    >
                      <div className="pt-4">
                        {language === "en" ? faq.answer.en : faq.answer.al}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div
              className="rounded-2xl py-16 text-center"
              style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)" }}
            >
              <HelpCircle className="w-10 h-10 mx-auto mb-4" style={{ color: "var(--text-tertiary)" }} />
              <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {language === "en" ? "No Answers Found" : "Nuk u gjet asnjë përgjigje"}
              </h3>
              <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-tertiary)" }}>
                {language === "en"
                  ? "Try different keywords or contact us directly."
                  : "Provoni fjalë kyçe të tjera ose na shkruani."}
              </p>
            </div>
          )}
        </div>

        {/* Contact Box — similar to Stay Directory's CTA section */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "var(--surface-cream)",
            border: "1px solid var(--border-soft)"
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl mx-auto mb-4"
            style={{ background: "var(--brand-light)", color: "var(--brand-accent)" }}
          >
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            {language === "en" ? "Still have questions?" : "Keni ende pyetje?"}
          </h3>
          <p className="text-sm leading-relaxed mb-5 max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
            {language === "en"
              ? "Email us directly and our team will get back to you right away."
              : "Na shkruani direkt dhe ekipi ynë do t'ju ndihmojë menjëherë."}
          </p>
          <a
            href="mailto:infoturizemalbania@gmail.com"
            className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--brand-accent)", boxShadow: "0 2px 10px rgba(34,153,120,0.22)" }}
          >
            infoturizemalbania@gmail.com
          </a>
        </div>
      </section>
    </main>
  );
}
