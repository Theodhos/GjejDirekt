"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Award, Users, Compass } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutUsPage() {
  const { language } = useLanguage();

  return (
    <div className="relative min-h-screen bg-slate-50 pt-24 pb-20 overflow-hidden">
      {/* Visual Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />

      <div className="page-shell max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 animate-fade-in text-xs font-semibold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            {language === "en" ? "Home" : "Kreu"}
          </Link>
          <span>/</span>
          <span className="text-slate-600">
            {language === "en" ? "About Us" : "Rreth Nesh"}
          </span>
        </div>

        {/* Hero Section */}
        <div className="grid gap-12 lg:grid-cols-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-widest border border-brand-100">
              {language === "en" ? "OUR JOURNEY" : "UDHËTIMI YNË"}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 leading-[1.05]">
              {language === "en" 
                ? "Connecting travelers with Albania's authentic soul." 
                : "Duke lidhur udhëtarët me shpirtin autentik të Shqipërisë."}
            </h1>
            <p className="text-lg text-slate-700 leading-relaxed max-w-2xl font-medium">
              {language === "en"
                ? "Gjej Direkt is Albania's premier city-first tourism marketplace. We bridge the gap between verified local hosts and globally-minded explorers through a beautifully simple, trusted discovery ecosystem."
                : "Gjej Direkt është tregu më i madh turistik në Shqipëri i fokusuar te qytetet. Ne ndërlidhim ofruesit e verifikuar lokalë me eksploruesit ndërkombëtarë përmes një ekosistemi zbulimi të bukur, të thjeshtë dhe të besuar."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/services"
                className="px-8 py-4 rounded-full bg-slate-950 text-white font-black text-xs uppercase tracking-widest hover:bg-brand-600 transition-all shadow-xl shadow-slate-950/20 flex items-center gap-3 group"
              >
                {language === "en" ? "Explore Services" : "Eksploro Shërbimet"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/create-listing"
                className="px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-950 font-black text-xs uppercase tracking-widest hover:border-brand-500 transition-all shadow-soft flex items-center gap-2"
              >
                {language === "en" ? "Become a Host" : "Bëhu një Host"}
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 relative h-[380px] sm:h-[450px] w-full rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
              alt="Beautiful Albania coastline"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                {language === "en" ? "FEATURED LOCATION" : "VENDNDODHJA E REKOMANDUAR"}
              </p>
              <h3 className="text-xl font-bold leading-tight">
                {language === "en" ? "Riviera Stays & Beaches" : "Qëndrimet & Plazhet në Rivierë"}
              </h3>
            </div>
          </div>
        </div>

        {/* Stats Dashboard Layout */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-soft p-8 sm:p-12 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y-0 divide-x-0 sm:divide-x sm:divide-slate-100">
            <div className="text-center sm:text-left px-2 sm:px-6">
              <p className="text-4xl sm:text-5xl font-black text-slate-950">500+</p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">
                {language === "en" ? "Verified Hosts" : "Host-ë të Verifikuar"}
              </p>
            </div>
            <div className="text-center sm:text-left px-2 sm:px-6">
              <p className="text-4xl sm:text-5xl font-black text-slate-950">1,200+</p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">
                {language === "en" ? "Total Listings" : "Listime Gjithsej"}
              </p>
            </div>
            <div className="text-center sm:text-left px-2 sm:px-6">
              <p className="text-4xl sm:text-5xl font-black text-slate-950">45+</p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">
                {language === "en" ? "Albanian Cities" : "Qytete Shqiptare"}
              </p>
            </div>
            <div className="text-center sm:text-left px-2 sm:px-6">
              <p className="text-4xl sm:text-5xl font-black text-slate-950">4.9</p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">
                {language === "en" ? "Average Rating" : "Vlerësimi Mesatar"}
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-12 mb-20">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              {language === "en" ? "OUR VALUES" : "VLERAT TONA"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              {language === "en" ? "Why Gjej Direkt?" : "Pse Gjej Direkt?"}
            </h2>
            <p className="text-sm font-medium text-slate-600">
              {language === "en"
                ? "We shape the tourism guide of tomorrow, balancing pristine quality with authentic hospitality."
                : "Ne ndërtojmë udhëzuesin e të nesërmes, duke balancuar cilësinë maksimale me mikpritjen autentike."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">
                {language === "en" ? "Verified Quality" : "Cilësi e Verifikuar"}
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {language === "en"
                  ? "Every accommodation, local restaurant, or tourist agency on our platform is carefully verified to guarantee traveler safety and high standards."
                  : "Çdo akomodim, restorant lokal, apo agjenci turistike në platformën tonë verifikohet me kujdes për të garantuar sigurinë e udhëtarëve dhe standardet e larta."}
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">
                {language === "en" ? "Locally Sourced" : "Mbështetje Lokale"}
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {language === "en"
                  ? "We champion small businesses, organic farm products, and local hosts, fostering sustainable tourism growth in communities across Albania."
                  : "Ne mbështesim bizneset e vogla, produktet organike bujqësore dhe hostët vendas, duke nxitur rritjen e turizmit të qëndrueshëm në të gjithë Shqipërinë."}
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">
                {language === "en" ? "Premium Design" : "Ndërfaqe Premium"}
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {language === "en"
                  ? "A gorgeous, responsive mobile-first UI designed to feel like a high-end travel guide, helping travelers discover local gems in just clicks."
                  : "Një dizajnim modern, jashtëzakonisht i përgjegjshëm për telefonat, i cili ndihet si një udhëzues luksoz udhëtimi, duke gjetur destinacione në pak sekonda."}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="relative rounded-[3rem] bg-slate-950 border border-slate-800 text-white overflow-hidden p-8 sm:p-14 shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,#0284c7_0%,transparent_50%)]" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-4">
              <h3 className="text-3xl sm:text-4xl font-black leading-tight">
                {language === "en" 
                  ? "Ready to show Albania to the world?" 
                  : "Gati për t'i treguar botës bukurinë e Shqipërisë?"}
              </h3>
              <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                {language === "en"
                  ? "Join our curated collective of hosts, hotels, adventure operators, and local service providers. Make your tourism business discoverable beautifully."
                  : "Bashkohuni me rrjetin tonë të përzgjedhur të hotelerive, guidave të aventurës, restoranteve dhe shërbimeve. Bëjeni biznesin tuaj të zbulueshëm bukur."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Link 
                href="/create-listing" 
                className="px-8 py-4 rounded-full bg-brand-600 text-white font-black text-xs uppercase tracking-widest text-center shadow-lg shadow-brand-600/30 hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all"
              >
                {language === "en" ? "List Your Business" : "Regjistro Biznesin Tënd"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
