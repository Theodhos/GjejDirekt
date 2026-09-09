"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Send, Sparkles, ArrowRight, RotateCcw, MapPin, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Lang = "al" | "en";

const SUPPORT_EMAIL = "infoturizemalbania@gmail.com";

// The chat only handles the city + category suggestion flow. Anything that
// looks like an off-topic question is redirected to email instead.
function looksOffTopic(text: string) {
  const t = text.toLowerCase().trim();
  if (t.includes("?")) return true;
  if (t.split(/\s+/).length > 3) return true;
  const signals = [
    "si ", "pse", "sa ", "kur", "çmim", "cmim", "pages", "rimburs", "kontakt",
    "problem", "ankes", "email", "refund", "price", "cost", "how", "why",
    "when", "what", "contact", "help", "cancel", "anulo",
  ];
  return signals.some((s) => t.includes(s));
}

// This chat exists ONLY to suggest a service. It asks the visitor for a
// city and a category, then lists matching services with the listings that
// purchased a package ranked first (handled server-side by /api/listings).
const copy = {
  al: {
    open: "Sygjerim",
    title: "Asistent Sygjerimi",
    subtitle: "Vetëm për të sugjeruar shërbimin që kërkoni.",
    intro:
      "Përshëndetje! 👋 Ky chat shërben vetëm për t'ju dhënë një sygjerim për shërbimin që dëshironi. Më thoni qytetin ku e doni këtë shërbim.",
    cityPlaceholder: "Shkruani qytetin (p.sh. Tiranë)...",
    askCategory: "Bukur! Tani zgjidhni llojin e shërbimit që kërkoni:",
    searching: "Po kërkoj sugjerimet më të mira për ju...",
    paidBadge: "I rekomanduar",
    restart: "Sygjerim i ri",
    send: "Dërgo",
    view: "Shiko shërbimin",
    emailNotice:
      "Ky chat shërben vetëm për sugjerim shërbimi (qyteti + kategoria). Për çdo pyetje tjetër, na kontaktoni në email dhe do t'ju përgjigjemi vetë.",
    emailCta: "Kontaktoni në email",
    emailSubject: "Pyetje nga platforma",
    resultsHeader: (city: string, cat: string) => `Ja disa sygjerime për ${cat} në ${city} — shërbimet e rekomanduara dalin të parat:`,
    noResults: (city: string, cat: string) => `Nuk gjeta shërbime për ${cat} në ${city}. Provoni një qytet ose kategori tjetër.`,
  },
  en: {
    open: "Suggestion",
    title: "Suggestion Assistant",
    subtitle: "Only to suggest the service you are looking for.",
    intro:
      "Hello! 👋 This chat is only here to give you a suggestion for the service you want. Tell me the city where you want this service.",
    cityPlaceholder: "Type the city (e.g. Tirana)...",
    askCategory: "Great! Now choose the type of service you are looking for:",
    searching: "Looking for the best suggestions for you...",
    paidBadge: "Recommended",
    restart: "New suggestion",
    send: "Send",
    view: "View service",
    emailNotice:
      "This chat is only for service suggestions (city + category). For any other question, contact us by email and we'll reply to you personally.",
    emailCta: "Contact by email",
    emailSubject: "Question from the platform",
    resultsHeader: (city: string, cat: string) => `Here are some suggestions for ${cat} in ${city} — recommended services come first:`,
    noResults: (city: string, cat: string) => `I couldn't find services for ${cat} in ${city}. Try another city or category.`,
  },
} as const;

const CATEGORY_OPTIONS: { value: string; al: string; en: string }[] = [
  { value: "akomodim", al: "Akomodim", en: "Accommodation" },
  { value: "restorante", al: "Restorante", en: "Restaurants" },
  { value: "atraksione", al: "Atraksione", en: "Attractions" },
  { value: "evente", al: "Evente", en: "Events" },
  { value: "sherbime-turistike", al: "Shërbime Turistike", en: "Tourism Services" },
  { value: "aktivitete", al: "Aktivitete & Ture", en: "Activities & Tours" },
  { value: "produkte-lokale", al: "Shopping & Produkte Lokale", en: "Shopping & Local Products" },
  { value: "transport", al: "Transport", en: "Transport" },
];

type Suggestion = {
  _id: string;
  slug: string;
  title: string;
  location?: string;
  package?: string | null;
};

// Show the package the admin assigned, so the ranking (Ads Pro > Ads >
// Verified) is visible instead of one generic "recommended" badge.
function packageLabel(packet?: string | null) {
  if (packet === "features") return "ADS PRO";
  if (packet === "trading") return "ADS";
  if (packet === "verify") return "VERIFIED";
  return null;
}

function Bubble({ from, children }: { from: "user" | "bot"; children: React.ReactNode }) {
  return (
    <div className={`flex ${from === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed"
        style={
          from === "user"
            ? { background: "var(--brand-accent)", color: "#ffffff", borderBottomRightRadius: "4px" }
            : { background: "var(--surface-white)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)", borderBottomLeftRadius: "4px" }
        }
      >
        {children}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const lang: Lang = language === "en" ? "en" : "al";
  const c = copy[lang];

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"city" | "category" | "results">("city");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Suggestion[] | null>(null);
  const [offTopic, setOffTopic] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [open, step, loading, results, offTopic, lang]);

  const emailHref = (text: string) =>
    `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(c.emailSubject)}&body=${encodeURIComponent(text)}`;

  const catLabel = (value: string | null) => {
    if (!value) return "";
    const found = CATEGORY_OPTIONS.find((o) => o.value === value);
    return found ? found[lang] : value;
  };

  const submitCity = () => {
    const value = input.trim();
    if (!value) return;
    if (looksOffTopic(value)) {
      setOffTopic(value);
      setInput("");
      return;
    }
    setOffTopic(null);
    setCity(value);
    setInput("");
    setStep("category");
  };

  const chooseCategory = async (value: string) => {
    setCategory(value);
    setStep("results");
    setLoading(true);
    setResults(null);
    try {
      const params = new URLSearchParams({ location: city, category: value });
      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setResults((Array.isArray(data.listings) ? data.listings : []).slice(0, 5));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setStep("city");
    setCity("");
    setCategory(null);
    setResults(null);
    setInput("");
    setLoading(false);
    setOffTopic(null);
  };

  // The bubble floats right over the wizard buttons on phones, so it stays out of the
  // listing form entirely.
  const onListingForm = Boolean(
    pathname && (pathname.startsWith("/listings/add") || /^\/listings\/[^/]+\/edit\/?$/.test(pathname))
  );
  if (onListingForm) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={c.open}
          className="fixed bottom-28 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-4 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 md:bottom-6"
          style={{ background: "var(--brand-accent)", boxShadow: "0 8px 24px rgba(225,29,46,0.35)" }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="hidden sm:inline">{c.open}</span>
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-28 right-6 z-50 flex flex-col w-[calc(100vw-3rem)] sm:w-[380px] h-[560px] max-h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-300 md:bottom-6 md:max-h-[calc(100vh-3rem)]"
          style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", borderRadius: "18px", boxShadow: "0 16px 48px rgba(15,20,25,0.18)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 rounded-t-[18px]" style={{ background: "var(--brand-accent)" }}>
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#ffffff" }} />
              <div>
                <h3 className="text-base font-bold tracking-tight" style={{ color: "#ffffff" }}>{c.title}</h3>
                <p className="text-xs font-medium mt-1" style={{ color: "rgba(255,255,255,0.85)" }}>{c.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="shrink-0 rounded-full p-1 transition-opacity hover:opacity-80" style={{ color: "#ffffff" }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation (rendered from state so EN/AL toggles re-translate everything) */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: "var(--surface-page)" }}>
            <Bubble from="bot">{c.intro}</Bubble>

            {offTopic && (
              <>
                <Bubble from="user">{offTopic}</Bubble>
                <Bubble from="bot">
                  <p className="mb-3">{c.emailNotice}</p>
                  <a
                    href={emailHref(offTopic)}
                    className="inline-flex items-center gap-2 text-xs font-bold rounded-full px-4 py-2 transition-opacity hover:opacity-90"
                    style={{ background: "var(--brand-accent)", color: "#ffffff" }}
                  >
                    <Mail className="w-4 h-4" /> {c.emailCta}
                  </a>
                </Bubble>
              </>
            )}

            {city && <Bubble from="user">{city}</Bubble>}
            {city && <Bubble from="bot">{c.askCategory}</Bubble>}

            {step === "category" && (
              <div className="flex flex-wrap gap-2 pt-1">
                {CATEGORY_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => chooseCategory(o.value)}
                    className="rounded-full px-3.5 py-2 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
                    style={{ background: "var(--surface-white)", color: "var(--brand-accent)", border: "1px solid var(--border-soft)" }}
                  >
                    {o[lang]}
                  </button>
                ))}
              </div>
            )}

            {category && <Bubble from="user">{catLabel(category)}</Bubble>}

            {loading && <Bubble from="bot">{c.searching}</Bubble>}

            {step === "results" && !loading && results !== null && (
              results.length > 0 ? (
                <Bubble from="bot">
                  <p className="mb-3">{c.resultsHeader(city, catLabel(category))}</p>
                  <div className="space-y-2">
                    {results.map((s) => (
                      <a
                        key={s._id}
                        href={`/listings/${s.slug}`}
                        className="block rounded-xl px-3 py-2.5 transition-transform hover:scale-[1.02]"
                        style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{s.title}</span>
                          {packageLabel(s.package) ? (
                            <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide" style={{ background: "var(--brand-accent)", color: "#ffffff" }}>
                              {packageLabel(s.package)}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          {s.location ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                              <MapPin className="w-3 h-3" /> {s.location}
                            </span>
                          ) : <span />}
                          <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: "var(--brand-accent)" }}>
                            {c.view} <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </Bubble>
              ) : (
                <Bubble from="bot">{c.noResults(city, catLabel(category))}</Bubble>
              )
            )}

            {step === "results" && !loading && (
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 text-xs font-bold rounded-full px-4 py-2 transition-opacity hover:opacity-90"
                style={{ background: "var(--surface-cream)", color: "var(--brand-accent)", border: "1px solid var(--border-soft)" }}
              >
                <RotateCcw className="w-4 h-4" /> {c.restart}
              </button>
            )}
          </div>

          {/* Input — only relevant while collecting the city */}
          {step === "city" && (
            <div className="flex items-center gap-2 p-3" style={{ borderTop: "1px solid var(--border-soft)" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitCity(); }}
                placeholder={c.cityPlaceholder}
                className="flex-1 rounded-full px-4 py-2.5 text-sm font-medium outline-none"
                style={{ background: "var(--surface-page)", border: "1px solid var(--border-soft)", color: "var(--text-primary)" }}
              />
              <button
                onClick={submitCity}
                aria-label={c.send}
                className="shrink-0 flex items-center justify-center w-11 h-11 rounded-full text-white transition-transform hover:scale-105 active:scale-95"
                style={{ background: "var(--brand-accent)" }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
