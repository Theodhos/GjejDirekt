"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/constants";
import { Briefcase, Calendar, Car, ChevronLeft, ChevronRight, Compass, Home, MapPin, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const categoryIcons: Record<string, React.ReactNode> = {
  akomodim: <Home className="h-12 w-12" />,
  restorante: <UtensilsCrossed className="h-12 w-12" />,
  atraksione: <Compass className="h-12 w-12" />,
  evente: <Calendar className="h-12 w-12" />,
  "sherbime-turistike": <Briefcase className="h-12 w-12" />,
  "produkte-lokale": <MapPin className="h-12 w-12" />,
  transport: <Car className="h-12 w-12" />
};

const categoryColors: Record<string, { bg: string; icon: string; border: string }> = {
  akomodim: { bg: "bg-purple-100 hover:bg-purple-200", icon: "bg-purple-600", border: "border-purple-200 hover:border-purple-300" },
  restorante: { bg: "bg-pink-100 hover:bg-pink-200", icon: "bg-pink-600", border: "border-pink-200 hover:border-pink-300" },
  atraksione: { bg: "bg-blue-100 hover:bg-blue-200", icon: "bg-blue-600", border: "border-blue-200 hover:border-blue-300" },
  evente: { bg: "bg-orange-100 hover:bg-orange-200", icon: "bg-orange-600", border: "border-orange-200 hover:border-orange-300" },
  "sherbime-turistike": { bg: "bg-teal-100 hover:bg-teal-200", icon: "bg-teal-600", border: "border-teal-200 hover:border-teal-300" },
  "produkte-lokale": { bg: "bg-green-100 hover:bg-green-200", icon: "bg-green-600", border: "border-green-200 hover:border-green-300" },
  transport: { bg: "bg-cyan-100 hover:bg-cyan-200", icon: "bg-cyan-600", border: "border-cyan-200 hover:border-cyan-300" }
};

export default function CreateListingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const en = language === "en";
  const sliderRef = useRef<HTMLDivElement>(null);

  function handleCategoryClick(categoryValue: string) {
    router.push(`/listings/add?category=${categoryValue}`);
  }

  function scrollByCard(dir: -1 | 1) {
    const rail = sliderRef.current;
    if (!rail) return;
    const card = rail.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 16 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <main style={{ background: "var(--surface-page)" }}>
      <section
        className="relative overflow-hidden"
        style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--surface-cream)" }}
      >
        <div className="page-shell py-10 text-center sm:py-14">
          <p className="eyebrow mb-5">{en ? "Directory" : "Direktoria"}</p>
          <h1
            className="font-bold tracking-tight"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.05 }}
          >
            {en ? "Create a listing" : "Shto nje sherbim"}
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            {en
              ? "Choose the service category and continue with the full posting form."
              : "Zgjidh kategorine e sherbimit dhe vazhdo me formen e plote te postimit."}
          </p>
        </div>
      </section>

      <section className="page-shell py-6 sm:py-10">
        {/* Arrows — phones only, a cue that more categories sit off-screen. */}
        <div className="mb-4 flex items-center justify-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={en ? "Previous" : "Para"}
            className="flex h-11 w-14 items-center justify-center rounded-full border border-[var(--border-medium)] bg-[var(--surface-white)] text-[var(--text-secondary)] shadow-sm transition-all active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={en ? "Next" : "Pas"}
            className="flex h-11 w-14 items-center justify-center rounded-full border border-[var(--border-medium)] bg-[var(--surface-white)] text-[var(--text-secondary)] shadow-sm transition-all active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Phones swipe the categories left/right; from md up it's the usual grid.
            80vw card + 10vw padding each side = the active card sits centred with the
            next one peeking in. snap-center keeps every card centred as you swipe. */}
        <div
          ref={sliderRef}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[10vw] pb-4 no-scrollbar md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
        >
          {categories.map((category) => {
            const colors = categoryColors[category.value] || {
              bg: "bg-gray-50 hover:bg-gray-100",
              icon: "bg-gray-600",
              border: "border-gray-200 hover:border-gray-300"
            };
            const icon = categoryIcons[category.value] || <MapPin className="h-12 w-12" />;
            const label = t.categories.names[category.value as keyof typeof t.categories.names] || category.label;

            return (
              <button
                key={category.value}
                type="button"
                onClick={() => handleCategoryClick(category.value)}
                className={`${colors.bg} ${colors.border} w-[80vw] max-w-[340px] shrink-0 snap-center rounded-2xl border p-8 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl md:w-auto md:max-w-none`}
              >
                <span className="flex flex-col items-center text-center">
                  <span className={`${colors.icon} mb-4 rounded-full p-4 text-white shadow-lg`}>
                    {icon}
                  </span>
                  <span className="text-xl font-semibold text-gray-800">{label}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button type="button" onClick={() => router.back()} className="font-medium text-gray-600 hover:text-gray-900">
            {en ? "Back" : "Kthehu prapa"}
          </button>
        </div>
      </section>
    </main>
  );
}
