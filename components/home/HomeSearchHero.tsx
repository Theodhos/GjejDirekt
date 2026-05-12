"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Bike, CalendarDays, Camera, ChefHat, Hotel, MapPin, Search, Sparkles, Store } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { albaniaCities } from "@/lib/albania-cities";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeSearchHero() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const { language, t } = useLanguage();

  const tabs = [
    { label: language === 'en' ? "All" : "Të gjitha", value: "", icon: Search, placeholder: { en: "Search tours, stays, restaurants...", al: "Kërko ture, akomodime, restorante..." } },
    { label: language === 'en' ? "Stays" : "Qëndrime", value: "akomodim", icon: Hotel, placeholder: { en: "Search hotels, villas, apartments...", al: "Kërko hotele, vila, apartamente..." } },
    { label: language === 'en' ? "Food" : "Ushqim", value: "restorante", icon: ChefHat, placeholder: { en: "Search restaurants, cafes...", al: "Kërko restorante, kafe..." } },
    { label: language === 'en' ? "Things to do" : "Aktivitete", value: "atraksione", icon: Camera, placeholder: { en: "Search attractions, beaches...", al: "Kërko atraksione, plazhe..." } },
    { label: language === 'en' ? "Events" : "Evente", value: "evente", icon: CalendarDays, placeholder: { en: "Search concerts, festivale...", al: "Kërko koncerte, festivale..." } },
    { label: language === 'en' ? "Services" : "Shërbime", value: "sherbime-turistike", icon: Sparkles, placeholder: { en: "Search guides, agencies...", al: "Kërko guida, agjenci..." } },
    { label: language === 'en' ? "Local goods" : "Produkte lokale", value: "produkte-lokale", icon: Store, placeholder: { en: "Search handmade products...", al: "Kërko produkte artizanale..." } },
    { label: language === 'en' ? "Transport" : "Transport", value: "transport", icon: Bike, placeholder: { en: "Search transfers, rentals...", al: "Kërko transferta, makina..." } }
  ] as const;

  const [active, setActive] = useState<(typeof tabs)[number]>(tabs[0]);
  const cityShortcuts = albaniaCities.slice(0, 8);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmedCity = city.trim();
    if (trimmedCity) params.set("location", trimmedCity);
    if (active.value) params.set("category", active.value);
    router.push(`/services${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function searchCity(value: string) {
    const params = new URLSearchParams();
    params.set("location", value);
    if (active.value) params.set("category", active.value);
    router.push(`/services?${params.toString()}`);
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1800&q=80"
          alt="Albania travel banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/68" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_30%),linear-gradient(135deg,rgba(2,6,23,0.15),rgba(2,6,23,0.4))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="text-white">
            <div className="flex flex-wrap gap-2">
              <span className="chip border-white/15 bg-white/10 text-white">
                <Sparkles className="h-4 w-4 text-emerald-300" />
                {t.hero.discoverByCity}
              </span>
              <span className="chip border-white/15 bg-white/10 text-white">
                <MapPin className="h-4 w-4 text-amber-300" />
                {t.hero.findEveryService}
              </span>
            </div>

            <h1 className="display-font mt-6 max-w-3xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              {t.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              {t.hero.description}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: t.hero.verifiedListings, value: "100% curated" },
                { label: t.hero.cityFirst, value: language === "en" ? "Search by place" : "Kërko sipas vendit" },
                { label: t.hero.fastDiscovery, value: language === "en" ? "One search flow" : "Një proces kërkimi" }
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{item.label}</p>
                  <p className="mt-2 text-lg font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>


          <div className="relative">
            <div className="rounded-[2rem] border border-white/15 bg-white/95 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-5">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = tab.value === active.value;
                  return (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setActive(tab)}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive ? "bg-slate-950 text-white shadow-md" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={submit} className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4 text-slate-950">
                  <Search className="h-5 w-5 text-slate-500" />
                  <input
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder={active.placeholder[language]}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:text-base"
                  />
                </div>
                <Button type="submit" className="w-full rounded-[1.4rem] px-6 py-4 text-base">
                  {t.hero.searchButton}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-4 flex flex-wrap gap-2">
                <p className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t.hero.popularCities}</p>
                {cityShortcuts.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => searchCity(item.label)}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  language === "en" ? "Accommodation" : "Akomodim",
                  language === "en" ? "Food and drinks" : "Ushqim dhe pije",
                  language === "en" ? "Things to do" : "Aktivitete",
                  language === "en" ? "Events and transport" : "Evente dhe transport"
                ].map((item) => (
                  <div key={item} className="rounded-[1.3rem] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                    {item}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
