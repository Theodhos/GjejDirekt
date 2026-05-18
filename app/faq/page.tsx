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
  // Travelers Category
  {
    category: "travelers",
    question: {
      en: "How do I book a stay or service on Gjej Direkt?",
      al: "Si mund të rezervoj një qëndrim ose shërbim në Gjej Direkt?"
    },
    answer: {
      en: "Gjej Direkt is a city-first discovery directory. Each listing features direct contact details (phone, exact address, and social links). You can contact the provider directly by clicking on 'Contact' or 'Book Now' to arrange your details directly with no platform fees!",
      al: "Gjej Direkt është një direktori zbulimi e fokusuar te qytetet. Çdo listim përmban detaje të drejtpërdrejta kontakti (telefon, adresë të saktë dhe rrjete sociale). Ju mund të kontaktoni drejtpërdrejt me ofruesin duke klikuar mbi 'Kontakt' ose 'Rezervo Tani' për të kryer marrëveshjen tuaj pa asnjë komision!"
    }
  },
  {
    category: "travelers",
    question: {
      en: "Are the listings on the platform verified?",
      al: "A janë të verifikuara shërbimet dhe listimet në platformë?"
    },
    answer: {
      en: "Yes! The moderation team at Gjej Direkt manually reviews and verifies every listing (accommodations, restaurants, tours) before they go live on our platform. This ensures only trusted, authentic local services are presented to travelers.",
      al: "Po! Ekipi i moderimit në Gjej Direkt shqyrton dhe verifikon manualisht çdo listim (akomodim, restorant, guidë) përpara se ato të bëhen publike. Kjo siguron që vetëm shërbimet e besuara dhe autentike lokale t'u prezantohen udhëtarëve."
    }
  },
  {
    category: "travelers",
    question: {
      en: "Can I filter listings by specific cities or categories?",
      al: "A mund t'i filtroj listimet sipas qyteteve apo kategorive të caktuara?"
    },
    answer: {
      en: "Absolutely! You can browse listings by selecting main categories (Stays, Restaurants, Events, Transport, local products) or by visiting specific city pages (e.g. Tirana, Saranda, Berat) where services are beautifully sorted for fast discovery.",
      al: "Plotësisht! Ju mund të shfletoni shërbimet duke përzgjedhur kategoritë kryesore (Akomodimi, Restorantet, Eventet, Transporti, Produkte Lokale) ose duke vizituar faqet specifike të qyteteve (p.sh. Tirana, Saranda, Berati) ku shërbimet janë të organizuara shkëlqyeshëm."
    }
  },
  // Hosts Category
  {
    category: "hosts",
    question: {
      en: "How can I add my business to Gjej Direkt?",
      al: "Si mund ta shtoj biznesin ose shërbimin tim në Gjej Direkt?"
    },
    answer: {
      en: "Listing your service is very simple! Register an account, click on 'Add Listing' (Shto Listim), choose your category, fill out the beautiful form with description, photos, business hours, and prices (min/max), and submit it. Our moderation team will review and approve it within 24 hours.",
      al: "Regjistrimi i shërbimit tuaj është shumë i thjeshtë! Regjistroni një llogari, klikoni në 'Shto Listim', zgjidhni kategorinë tuaj, plotësoni formularin me përshkrimin, fotot, orarin e punës dhe çmimet (min/max) dhe dërgojeni për miratim. Ekipi ynë do ta shqyrtojë dhe miratojë brenda 24 orëve."
    }
  },
  {
    category: "hosts",
    question: {
      en: "Is there a listing fee to register on the platform?",
      al: "A ka ndonjë tarifë për të regjistruar biznesin tim në platformë?"
    },
    answer: {
      en: "Gjej Direkt offers a free basic listing package for local tourism providers. We want to support Albanian tourism and culture. For extra visibility or advanced promotion on the city pages, we offer premium featured packages that you can view in your dashboard.",
      al: "Gjej Direkt ofron një paketë bazë regjistrimi krejtësisht falas për ofruesit lokalë të turizmit. Ne dëshirojmë të mbështesim turizmin dhe kulturën shqiptare. Për vizibilitet të shtuar apo promovim në faqet e qyteteve, ofrojmë paketa premium që mund t'i shikoni në panelin tuaj."
    }
  },
  {
    category: "hosts",
    question: {
      en: "Can I manage multiple listings under one account?",
      al: "A mund të menaxhoj disa listime me një llogari të vetme?"
    },
    answer: {
      en: "Yes, you can list and edit as many listings as you want! From your personal Host Dashboard, you can see all your registered properties, edit their prices, upload new gallery photos, update opening hours, or check their approval status in real-time.",
      al: "Po, ju mund të regjistroni dhe të redaktoni sa listime të dëshironi! Nga paneli juaj personal i Host-it (Dashboard), ju mund të shikoni të gjitha pronat tuaja të regjistruara, të ndryshoni çmimet e tyre, të ngarkoni foto të reja, të përditësoni oraret ose të kontrolloni statusin e tyre në kohë reale."
    }
  },
  // Payments Category
  {
    category: "payments",
    question: {
      en: "Does Gjej Direkt handle online payments or bookings?",
      al: "A kryen Gjej Direkt pagesa online ose rezervime direkte?"
    },
    answer: {
      en: "No, Gjej Direkt currently acts as a guide and direct connection engine. We do not charge commission fees! All payments and booking confirmations are agreed upon directly between you and the host via email, phone call, or their external direct links.",
      al: "Jo, Gjej Direkt shërben si një udhëzues dhe motor i lidhjes së drejtpërdrejtë. Ne nuk marrim asnjë komision mbi shitjet! Të gjitha pagesat dhe konfirmimet e rezervimeve bëhen drejtpërdrejt mes jush dhe host-it me telefon, email, ose përmes lidhjeve të tyre direkte."
    }
  },
  {
    category: "payments",
    question: {
      en: "Who do I contact if I have an issue with a booked stay?",
      al: "Me cilin duhet të kontaktoj nëse kam një problem me një akomodim të rezervuar?"
    },
    answer: {
      en: "Because bookings and agreements are handled directly, you should immediately contact the service provider or host using the contact phone or email listed on their page. For listing quality issues, you can report them to our support team at infoturizemalbania@gmail.com.",
      al: "Duke qenë se marrëveshjet dhe rezervimet kryhen në mënyrë të drejtpërdrejtë, ju duhet të kontaktoni menjëherë ofruesin e shërbimit duke përdorur telefonin ose email-in e listuar në faqen e tyre. Për probleme me cilësinë e listimeve, mund t'i raportoni tek ekipi ynë i suportit në infoturizemalbania@gmail.com."
    }
  }
];

export default function FAQPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "travelers" | "hosts" | "payments">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item, index) => {
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

  return (
    <div className="relative min-h-screen bg-slate-50 pt-24 pb-20 overflow-hidden">
      {/* Visual Background Elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />

      <div className="page-shell max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 animate-fade-in text-xs font-semibold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            {language === "en" ? "Home" : "Kreu"}
          </Link>
          <span>/</span>
          <span className="text-slate-600">
            {language === "en" ? "FAQ" : "Pyetje të Shpeshta"}
          </span>
        </div>

        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-widest border border-brand-100">
            {language === "en" ? "HELP CENTER" : "QENDRA E NDIHMËS"}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.1]">
            {language === "en" ? "Frequently Asked Questions" : "Pyetje të Shpeshta"}
          </h1>
          <p className="text-sm font-medium text-slate-600 leading-relaxed">
            {language === "en"
              ? "Find answer quickly or contact our dedicated support team directly."
              : "Gjeni përgjigje shpejt ose kontaktoni direkt me ekipin tonë të dedikuar të suportit."}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "en" ? "Search for answers... (e.g. Host, payment, verified)" : "Kërko për përgjigje... (p.sh. Host, pagesa, miratim)"}
            className="w-full h-14 pl-14 pr-6 rounded-[2rem] bg-white border border-slate-200 focus:border-brand-500 focus:ring-8 focus:ring-brand-500/10 outline-none text-sm font-semibold text-slate-950 shadow-soft transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: "all", labelEn: "All Questions", labelAl: "Të gjitha", icon: HelpCircle },
            { id: "travelers", labelEn: "For Travelers", labelAl: "Për Udhëtarët", icon: Users },
            { id: "hosts", labelEn: "For Hosts", labelAl: "Për Hostët", icon: Compass },
            { id: "payments", labelEn: "Trust & Bookings", labelAl: "Siguria & Rezervimet", icon: Shield }
          ].map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id as any);
                  setOpenIndex(null);
                }}
                className={`px-5 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 border transition-all ${
                  active
                    ? "bg-slate-950 text-white border-slate-950 shadow-lg shadow-slate-950/15 scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:border-brand-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {language === "en" ? cat.labelEn : cat.labelAl}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:border-slate-200"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-6 sm:px-8 flex items-center justify-between gap-4 text-left outline-none"
                  >
                    <span className="text-base sm:text-lg font-black text-slate-950 leading-snug">
                      {language === "en" ? faq.question.en : faq.question.al}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-brand-50 text-brand-600" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[300px] border-t border-slate-50" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 py-6 sm:px-8 text-sm font-medium text-slate-600 leading-relaxed bg-slate-50/50">
                      {language === "en" ? faq.answer.en : faq.answer.al}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-black text-slate-950">
                {language === "en" ? "No Answers Found" : "Nuk u gjet asnjë përgjigje"}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === "en"
                  ? "We couldn't find any questions matching your query. Try different keywords or contact us."
                  : "Nuk gjetëm asnjë pyetje që përputhet me kërkimin tuaj. Provoni fjalë kyçe të tjera ose na shkruani."}
              </p>
            </div>
          )}
        </div>

        {/* Secondary Contact Box */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-soft p-8 sm:p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-950">
            {language === "en" ? "Still have questions?" : "Keni ende pyetje?"}
          </h3>
          <p className="text-sm font-medium text-slate-600 max-w-md mx-auto">
            {language === "en"
              ? "We are here to support you. Email us directly and our moderation team will get back to you immediately."
              : "Ne jemi këtu për t'ju mbështetur. Na shkruani direkt dhe ekipi ynë do t'ju ndihmojë menjëherë."}
          </p>
          <div>
            <a
              href="mailto:infoturizemalbania@gmail.com"
              className="inline-block px-8 py-4 rounded-full bg-slate-950 text-white font-black text-xs uppercase tracking-widest hover:bg-brand-600 transition-all shadow-md"
            >
              infoturizemalbania@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
