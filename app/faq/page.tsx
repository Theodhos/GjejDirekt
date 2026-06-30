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
    question: { en: "What is TripShqip?", al: "Çfarë është TripShqip?" },
    answer: { en: "TripShqip is a tourism platform that helps users discover hotels, restaurants, attractions, events, and tourism businesses across Albania.", al: "TripShqip është një platformë turistike që ndihmon përdoruesit të zbulojnë hotele, restorante, atraksione, evente dhe biznese turistike në Shqipëri." }
  },
  {
    category: "travelers",
    question: { en: "How does TripShqip work?", al: "Si funksionon TripShqip?" },
    answer: { en: "Users can search by categories, destinations, or tags and contact businesses directly via phone, WhatsApp, Instagram, or their website.", al: "Përdoruesit mund të kërkojnë sipas kategorive, destinacioneve ose tags dhe të kontaktojnë bizneset direkt përmes telefonit, WhatsApp, Instagramit ose website-it të tyre." }
  },
  {
    category: "payments",
    question: { en: "Can I book directly through TripShqip?", al: "A mund të rezervoj direkt nga TripShqip?" },
    answer: { en: "For now, TripShqip focuses on the direct connection between tourists and businesses. Reservations are made directly with the business or through external links.", al: "Për momentin TripShqip fokusohet te lidhja direkte midis turistëve dhe bizneseve. Rezervimet realizohen direkt me biznesin ose përmes linkeve të jashtme." }
  },
  {
    category: "hosts",
    question: { en: "How can I add my business?", al: "Si mund të shtoj biznesin tim?" },
    answer: { en: "You can create a profile and add your listing through the \"Add business\" page.", al: "Mund të krijoni një profil dhe të shtoni listing-un tuaj përmes faqes “Shto biznesin”." }
  },
  {
    category: "hosts",
    question: { en: "What does Verified mean?", al: "Çfarë do të thotë Verified?" },
    answer: { en: "Verified indicates that a business has a more complete profile and a more professional presence on the platform.", al: "Verified tregon që biznesi ka një profil më të plotë dhe prezencë më profesionale në platformë." }
  },
  {
    category: "hosts",
    question: { en: "What benefits do Verified businesses get?", al: "Çfarë përfitimesh kanë bizneset Verified?" },
    answer: {
      en: "Verified businesses can have: (1) Verified Badge — a visual ✅ Verified badge that instantly builds trust; (2) \"Business checked by TripShqip\" on the listing page, which is psychologically very strong in Albania; (3) Priority support — faster changes and direct assistance; (4) More credibility in search — the badge naturally increases CTR (not a ranking boost, but an indirect advantage); (5) Protection against fake listings — users understand who is real and active.",
      al: "Bizneset Verified mund të kenë: (1) Verified Badge — një badge vizual ✅ Verified që rrit besimin menjëherë; (2) “Business checked by TripShqip” tek faqja e listing-ut, shumë e fortë psikologjikisht në Shqipëri; (3) Prioritet në support — ndryshime më të shpejta dhe asistencë direkte; (4) Më shumë kredibilitet në kërkim — badge rrit CTR natyralisht (jo ranking boost, por avantazh indirekt); (5) Mbrojtje nga listings fake — useri kupton kush është real dhe aktiv."
    }
  },
  {
    category: "hosts",
    question: { en: "Is it free to add a listing?", al: "A është falas të shtosh një listing?" },
    answer: { en: "Yes, businesses can add a basic listing for free.", al: "Po, bizneset mund të shtojnë listing-un bazë falas." }
  },
  {
    category: "hosts",
    question: { en: "How do Ads and Ads Pro work?", al: "Si funksionojnë Ads dhe AdsPro?" },
    answer: { en: "Ads and Ads Pro help Verified businesses gain more exposure on the platform.", al: "Ads dhe Ads Pro ndihmojnë bizneset Verified të marrin më shumë ekspozim në platformë." }
  },
  {
    category: "travelers",
    question: { en: "Can I contact the business directly?", al: "A mund të kontaktoj direkt biznesin?" },
    answer: { en: "Yes. TripShqip is built for direct contact between tourists and businesses.", al: "Po. TripShqip është ndërtuar për kontakt të drejtpërdrejtë midis turistëve dhe bizneseve." }
  },
  {
    category: "travelers",
    question: { en: "What categories can I find on TripShqip?", al: "Çfarë kategorish mund të gjej në TripShqip?" },
    answer: { en: "On TripShqip you can find: Accommodation, Restaurants, Attractions, Events & Activities, Tourism Services, Local Products, and Transport & Taxi.", al: "Në TripShqip mund të gjeni: Akomodime, Restorante, Atraksione, Evente & Aktivitete, Shërbime Turistike, Produkte Lokale dhe Transport & Taxi." }
  },
  {
    category: "payments",
    question: { en: "How can I report a listing?", al: "Si mund të raportoj një listing?" },
    answer: { en: "You can contact us through the contact page if a listing has inaccurate or problematic information.", al: "Mund të na kontaktoni përmes faqes së kontaktit nëse një listing ka informacion të pasaktë ose problematik." }
  },
  {
    category: "hosts",
    question: { en: "Can I add events or activities?", al: "A mund të shtoj evente ose aktivitete?" },
    answer: { en: "Yes, events and activities can be added under the Events & Activities category.", al: "Po, eventet dhe aktivitetet mund të shtohen në kategorinë Evente & Aktivitete." }
  },
  {
    category: "travelers",
    question: { en: "Does TripShqip work on mobile?", al: "A funksionon TripShqip në mobile?" },
    answer: { en: "Yes, TripShqip is built mobile-first for a fast and simple experience.", al: "Po, TripShqip është ndërtuar me fokus mobile-first për një eksperiencë të shpejtë dhe të thjeshtë." }
  },
  {
    category: "travelers",
    question: { en: "How can I contact TripShqip?", al: "Si mund të kontaktoj TripShqip?" },
    answer: { en: "You can contact us through the \"Contact\" page or our social networks.", al: "Mund të na kontaktoni përmes faqes “Kontakt” ose rrjeteve tona sociale." }
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
        <div className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full" style={{ background: "rgba(31,138,112,0.06)", filter: "blur(100px)" }} />
        <div className="pointer-events-none absolute -bottom-12 -left-12 w-[300px] h-[300px] rounded-full" style={{ background: "rgba(31,138,112,0.05)", filter: "blur(80px)" }} />

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
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
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
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold transition-all"
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
                    <span className="text-[15px] font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
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
                      maxHeight: isOpen ? "720px" : "0",
                      overflow: "hidden",
                      transition: "max-height 0.35s ease"
                    }}
                  >
                    <div
                      className="px-5 pb-5 text-[15px] leading-relaxed"
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
          <p className="text-[15px] leading-relaxed mb-5 max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
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
