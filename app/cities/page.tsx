"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { albaniaCities } from "@/lib/albania-cities";
import { useLanguage } from "@/context/LanguageContext";

export default function CitiesPage() {
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-slate-50 py-24">
      <div className="page-shell">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-950 mb-8">
            {language === 'en' ? 'Explore Cities' : 'Eksploro Qytetet'}
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            {language === 'en' 
              ? 'Discover the unique charm and services of each Albanian city.' 
              : 'Zbuloni shijen unike dhe shërbimet e çdo qyteti shqiptar.'}
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {albaniaCities.map((city) => (
            <Link
              key={city.value}
              href={`/city/${city.value}`}
              className="group relative overflow-hidden rounded-[3rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl shadow-soft"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image 
                  src={city.image || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750"} 
                  alt={city.label} 
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
