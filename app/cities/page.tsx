"use client";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { albaniaCities } from "@/lib/albania-cities";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Every city we cover, as a grid of the same photo tile the home rail uses — the
 * "Shiko të gjitha" target for that rail, so it has to read as the same product.
 */
export default function CitiesPage() {
  const { language } = useLanguage();
  const [cities, setCities] = useState<any[]>(albaniaCities);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await fetch("/api/cities");
        const data = await res.json();
        if (Array.isArray(data.cities) && data.cities.length) {
          setCities(data.cities);
        }
      } catch {}
    };
    loadCities();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <PageHeader
        title={language === "en" ? "Cities" : "Qytetet"}
        description={
          language === "en"
            ? `Browse businesses in ${cities.length} cities across Albania.`
            : `Shfleto bizneset në ${cities.length} qytete në të gjithë Shqipërinë.`
        }
      />

      <div className="page-shell py-4 sm:py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cities.map((city) => (
            <Link key={city.value} id={city.value} href={`/city/${city.value}`} className="gd-card group flex flex-col">
              <span className="relative block aspect-[4/3] w-full overflow-hidden">
                <SafeImage
                  src={city.image}
                  alt={city.label}
                  fill
                  sizes="(max-width: 640px) 45vw, 260px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(10,12,16,0.82) 0%, rgba(10,12,16,0.05) 65%)" }}
                />
                {city.region && (
                  <span className="gd-verified absolute left-1.5 top-1.5" style={{ background: "rgba(255,255,255,0.22)" }}>
                    {city.region}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 p-2.5 text-[13px] font-bold text-white">{city.label}</span>
              </span>

              {city.description && (
                <span className="p-2.5 pt-2">
                  <span className="line-clamp-2 text-[11px] leading-snug" style={{ color: "var(--text-tertiary)" }}>
                    {city.description}
                  </span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
