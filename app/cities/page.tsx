"use client";

import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { albaniaCities } from "@/lib/albania-cities";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";

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
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="page-shell">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4">
            {language === 'en' ? 'Explore Cities' : 'Eksploro Qytetet'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            {language === 'en' 
              ? 'Discover the unique charm and services of each Albanian city.' 
              : 'Zbuloni shijen unike dhe shërbimet e çdo qyteti shqiptar.'}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {cities.map((city) => (
            <Link
              key={city.value}
              href={`/city/${city.value}`}
              id={city.value}
              className="group relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-soft"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <SafeImage
                  src={city.image}
                  alt={city.label}
                  fallbackSrc="https://images.unsplash.com/photo-1512917774080-9991f1c4c750"
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-6 left-6">
                  <div className="rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white border border-white/30">
                    {city.region}
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-brand-600" />
                  <h3 className="text-3xl font-black text-slate-950">{city.label}</h3>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-2">
                  {city.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-xs font-black uppercase tracking-widest text-brand-600">
                    {language === 'en' ? 'Explore all services' : 'Eksploro shërbimet'}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white group-hover:bg-brand-600 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
