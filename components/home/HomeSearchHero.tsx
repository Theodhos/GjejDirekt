"use client";

import SafeImage from "@/components/ui/SafeImage";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { categories } from "@/lib/constants";
import { albaniaCities } from "@/lib/albania-cities";

/**
 * The home search bar: just a field and a button, no autocomplete. Submitting it
 * sends the visitor straight to the right place — an exact city, category or
 * subcategory name goes to that page, anything else goes to the search results
 * (`/listings?q=`), which matches on a business's own text, its category/subcategory
 * (and every alias) and what it actually sells.
 */
export default function HomeSearchHero() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const { language } = useLanguage();
  const [availableCities, setAvailableCities] = useState<any[]>(albaniaCities);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch("/api/cities");
        const data = await res.json();
        if (Array.isArray(data.cities) && data.cities.length) setAvailableCities(data.cities);
      } catch {}
    };
    loadCities();
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = city.toLowerCase().trim();
    if (!query) {
      router.push("/listings");
      return;
    }

    const matchedCity = availableCities.find(
      (c) => String(c.label).toLowerCase() === query || String(c.value).toLowerCase() === query
    );
    if (matchedCity) return router.push(`/city/${matchedCity.value}`);

    const matchedCategory = categories.find(
      (cat) => cat.value === query || cat.label.toLowerCase() === query || cat.aliases.includes(query)
    );
    if (matchedCategory) return router.push(`/categories/${matchedCategory.value}`);

    for (const cat of categories) {
      const matchedSubcategory = cat.subcategories.find(
        (sub) => sub.value === query || sub.label.toLowerCase() === query || sub.aliases?.includes(query)
      );
      if (matchedSubcategory) return router.push(`/categories/${cat.value}?subcategory=${matchedSubcategory.value}`);
    }

    router.push(`/listings?q=${encodeURIComponent(query)}`);
  }

  return (
    <section className="relative overflow-visible" style={{ background: "#171A1F" }}>
      {/* Full-bleed background photo — clipped so the desktop dropdown isn't cut off */}
      <div className="absolute inset-0 overflow-hidden">
        <SafeImage
          src="/uploads/1000068416.jpg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ willChange: "auto" }}
        />
        {/* Two-stop gradient: darker top for the header overlay, darker bottom for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,6,8,0.88) 0%, rgba(5,6,8,0.68) 40%, rgba(5,6,8,0.94) 100%)"
          }}
        />
      </div>

      <div className="page-shell relative z-10 pb-6 pt-7 sm:pb-8 sm:pt-12">
        {/* Main headline — two lines exactly like the mockup */}
        <h1
          className="max-w-xs text-[1.85rem] font-bold text-white sm:max-w-2xl sm:text-[2.6rem]"
          style={{ lineHeight: 1.12, letterSpacing: "-0.025em" }}
        >
          {language === "en" ? (
            <>
              Find it easily.
              <br />
              <span style={{ color: "var(--brand-accent)" }}>Order</span> directly.
            </>
          ) : (
            <>
              Gjej lehtë.
              <br />
              <span style={{ color: "var(--brand-accent)" }}>Porosit</span> direkt.
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p
          className="mt-2 max-w-xs text-[12.5px] leading-relaxed sm:max-w-lg sm:text-[14px]"
          style={{ color: "rgba(255,255,255,0.78)" }}
        >
          {language === "en"
            ? "Find the best businesses near you and order or book directly on WhatsApp."
            : "Gjej bizneset më të mira pranë teje dhe porosit ose rezervo direkt në WhatsApp."}
        </p>

        {/* Search bar */}
        <div className="relative z-[100] mt-4 max-w-2xl">
          <form onSubmit={submit}>
            <div
              className="flex items-center gap-2 rounded-2xl p-1.5 pl-4"
              style={{
                background: "rgba(255,255,255,0.97)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.12)"
              }}
            >
              <Search className="h-[18px] w-[18px] shrink-0" style={{ color: "var(--text-tertiary)" }} />
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder={
                  language === "en" ? "Search business, product, service..." : "Kërko biznes, produkt, shërbim..."
                }
                className="min-w-0 flex-1 bg-transparent py-2 text-[14px] font-medium outline-none sm:text-[15px]"
                style={{ color: "var(--text-primary)" }}
                aria-label={language === "en" ? "Search" : "Kërko"}
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all"
                style={{
                  background: "var(--brand-accent)",
                  boxShadow: "0 2px 8px rgba(225,29,46,0.35)"
                }}
              >
                {language === "en" ? "Search" : "Kërko"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
