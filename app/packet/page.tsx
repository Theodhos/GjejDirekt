"use client";

import { Check, ArrowRight, Shield, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function PacketPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setIsAuthenticated(!!data.user))
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handlePackageClick = (e: React.MouseEvent, href: string) => {
    if (isAuthenticated === false) {
      e.preventDefault();
      router.push(`/login?callback=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  };

  const packages = [
    {
      id: "verify",
      name: "Verify",
      icon: Shield,
      price: "5",
      color: "blue",
      features: [
        language === 'en' ? "Verified Badge on your listing" : "Distinktivi i verifikuar në listimin tuaj",
        language === 'en' ? "Basic priority in search results" : "Prioritet bazë në rezultatet e kërkimit",
        language === 'en' ? "Direct WhatsApp & Phone contact" : "Kontakt direkt me WhatsApp & Telefon",
        language === 'en' ? "Appear in category sections" : "Shfaqja në seksionet e kategorive",
      ],
      description: language === 'en' ? "Build trust with your customers through verification." : "Ndërtoni besim me klientët tuaj përmes verifikimit."
    },
    {
      id: "trending",
      name: "Trending",
      icon: Flame,
      price: "10",
      color: "orange",
      popular: true,
      features: [
        language === 'en' ? "Everything in Verify package" : "Gjithçka në paketën Verify",
        language === 'en' ? "Higher ranking than Verify users" : "Renditje më e lartë se përdoruesit Verify",
        language === 'en' ? "Featured in 'Trending' sections" : "I rekomanduar në seksionet 'Trending'",
        language === 'en' ? "Priority support 24/7" : "Suport prioritar 24/7",
        language === 'en' ? "Analytics for your listing" : "Analitika për listimin tuaj",
      ],
      description: language === 'en' ? "Get more visibility and attract more customers." : "Merrni më shumë shikueshmëri dhe tërhiqni më shumë klientë."
    },
    {
      id: "features",
      name: "Features",
      icon: Sparkles,
      price: "15",
      color: "yellow",
      features: [
        language === 'en' ? "Everything in Trending package" : "Gjithçka në paketën Trending",
        language === 'en' ? "Highest ranking in all sections" : "Renditja më e lartë në të gjitha seksionet",
        language === 'en' ? "Featured on Home Hero section" : "I rekomanduar në seksionin Home Hero",
        language === 'en' ? "Professional photo review" : "Rishikim profesional i fotove",
        language === 'en' ? "Custom promotion on social media" : "Promovim i personalizuar në rrjetet sociale",
      ],
      description: language === 'en' ? "The ultimate package for maximum growth and reach." : "Paketa përfundimtare për rritje dhe shtrirje maksimale."
    }
  ];

  const searchParams = useSearchParams();
  const listingId = searchParams?.get("listingId") || "";

  return (
    <main className="min-h-screen bg-slate-50 py-24">
      <div className="page-shell">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-950 mb-8">
            {language === 'en' ? 'Choose Your Growth Packet' : 'Zgjidhni Paketën tuaj të Rritjes'}
          </h1>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            {language === 'en' 
              ? 'Boost your business visibility and reach more tourists by choosing one of our premium packages.' 
              : 'Rritni shikueshmërinë e biznesit tuaj dhe arrini më shumë turistë duke zgjedhur një nga paketat tona premium.'}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`relative flex flex-col rounded-[3rem] p-10 bg-white border-2 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl ${
                pkg.popular ? 'border-orange-500 shadow-xl' : 'border-slate-100 hover:border-brand-300'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                  {language === 'en' ? 'Most Popular' : 'Më Popullorja'}
                </div>
              )}

              <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center mb-8 ${
                pkg.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                pkg.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                'bg-yellow-50 text-yellow-600'
              }`}>
                <pkg.icon className="w-8 h-8" />
              </div>

              <h2 className="text-3xl font-black text-slate-950 mb-4">{pkg.name}</h2>
              <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                {pkg.description}
              </p>

              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-5xl font-black text-slate-950">€{pkg.price}</span>
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">/ {language === 'en' ? 'month' : 'muaj'}</span>
              </div>

              <ul className="space-y-4 mb-12 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-emerald-50 rounded-full p-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-slate-600 font-semibold text-sm leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link 
                href={`/checkout?packet=${pkg.id}&price=${pkg.price}&listingId=${listingId}`}
                onClick={(e) => handlePackageClick(e, `/checkout?packet=${pkg.id}&price=${pkg.price}&listingId=${listingId}`)}
                className={`w-full py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                  pkg.popular 
                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20' 
                    : 'bg-slate-950 text-white hover:bg-brand-600 shadow-lg shadow-slate-950/20'
                }`}
              >
                {language === 'en' ? 'Get Started' : 'Fillo Tani'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 rounded-[4rem] bg-slate-950 text-white text-center">
          <h3 className="text-3xl font-black mb-6">
            {language === 'en' ? 'Need a custom solution?' : 'Keni nevojë për një zgjidhje të personalizuar?'}
          </h3>
          <p className="text-slate-400 font-medium mb-10 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Contact our sales team for enterprise solutions or multiple listings packages.' 
              : 'Kontaktoni ekipin tonë të shitjeve për zgjidhje ndërmarrjeje ose paketa për listime të shumta.'}
          </p>
          <Link href="/contact" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-slate-950 rounded-full font-black text-sm hover:bg-brand-500 hover:text-white transition-all duration-300">
            {language === 'en' ? 'Contact Us' : 'Na Kontaktoni'} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
