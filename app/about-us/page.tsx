"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Award, CheckCircle, Compass, Users } from "lucide-react";
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
              {language === "en" ? "WELCOME TO TRIPSHQIP" : "MIRËSEVINI NË TRIPSHQIP"}
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 leading-[1.05]">
              {language === "en" ? "Welcome to TripShqip 🇦🇱" : "Mirësevini në TripShqip 🇦🇱"}
            </h1>
            <p className="text-lg text-slate-700 leading-relaxed max-w-2xl font-medium">
              {language === "en"
                ? "TripShqip is a modern tourism platform that helps tourists discover Albania more easily and local businesses get found faster."
                : "TripShqip është një platformë moderne turistike që ndihmon turistët të zbulojnë Shqipërinë më lehtë dhe bizneset lokale të gjenden më shpejt."}
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
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80"
              alt="Beautiful Albania Landscape"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">
                {language === "en" ? "EXPLORE ALBANIA" : "EKSPLORO SHQIPËRINË"}
              </p>
              <h3 className="text-xl font-bold leading-tight">
                {language === "en" ? "Stays, Food & Authentic Culture" : "Qëndrimet, Ushqimi & Kultura Autentike"}
              </h3>
            </div>
          </div>
        </div>

        {/* Our Goal Card */}
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-soft p-10 sm:p-16 mb-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[60px] -mr-32 -mt-32 transition-colors duration-1000" />
          <div className="relative z-10 max-w-4xl space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-[10px] font-black uppercase tracking-widest border border-brand-100">
              {language === "en" ? "OUR GOAL" : "QËLLIMI YNË"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {language === "en"
                ? "Promoting Albanian tourism and authentic family experiences."
                : "Promovimi i turizmit shqiptar dhe eksperiencave autentike familjare."}
            </h2>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-medium">
              {language === "en"
                ? "Our goal is to promote Albanian tourism, authentic experiences, and the family businesses that make Albania unique."
                : "Qëllimi ynë është të promovojmë turizmin shqiptar, eksperiencat autentike dhe bizneset familjare që e bëjnë Shqipërinë unike."}
            </p>
          </div>
        </div>

        {/* What You Can Find Section */}
        <div className="space-y-12 mb-20">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              {language === "en" ? "DISCOVERY HUB" : "QENDRA E ZBULIMIT"}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              {language === "en" ? "On TripShqip You Can Find:" : "Në TripShqip Mund Të Gjeni:"}
            </h2>
            <p className="text-sm font-medium text-slate-600">
              {language === "en"
                ? "Browse through our carefully curated categories designed to elevate your travel experience."
                : "Shfletoni kategoritë tona të kurura me kujdes të dizajnuara për të përmirësuar përvojën tuaj."}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title_en: "Accommodations",
                title_al: "Akomodime",
                desc_en: "Boutique hotels, villas, and local guesthouses.",
                desc_al: "Hotele boutique, vila dhe shtëpi pritëse lokale.",
                icon: "🏨"
              },
              {
                title_en: "Restaurants",
                title_al: "Restorante",
                desc_en: "Enjoy authentic Albanian cuisine and modern dining.",
                desc_al: "Shijoni kuzhinën autentike shqiptare dhe ushqimin modern.",
                icon: "🍽️"
              },
              {
                title_en: "Attractions",
                title_al: "Atraksione",
                desc_en: "Explore castles, canyons, and stunning beaches.",
                desc_al: "Eksploroni kështjellat, kanionet dhe plazhet mahnitëse.",
                icon: "🏔️"
              },
              {
                title_en: "Events & Activities",
                title_al: "Evente & Aktivitete",
                desc_en: "Festivals, concerts, and exciting outdoor tours.",
                desc_al: "Festivale, koncerte dhe ture të jashtëzakonshme në natyrë.",
                icon: "🎉"
              },
              {
                title_en: "Tour Guides",
                title_al: "Guida Turistike",
                desc_en: "Professional guides revealing hidden Albanian gems.",
                desc_al: "Guida profesionale që zbulojnë perlat e fshehura shqiptare.",
                icon: "🚤"
              },
              {
                title_en: "Local Products",
                title_al: "Produkte Lokale",
                desc_en: "Artisan crafts, organic foods, and local wines.",
                desc_al: "Punime artizanale, ushqime organike dhe verëra lokale.",
                icon: "🧀"
              },
              {
                title_en: "Transport",
                title_al: "Transport",
                desc_en: "Rentals, direct taxi lines, airport transfers.",
                desc_al: "Makina me qira, linja taksi direkte, transferta aeroporti.",
                icon: "🚕"
              },
              {
                title_en: "Tourism Services",
                title_al: "Shërbime Turistike",
                desc_en: "Everything you need to secure your journey.",
                desc_al: "Gjithçka që ju nevojitet për të siguruar udhëtimin tuaj.",
                icon: "✨"
              }
            ].map((cat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-2">
                  {language === "en" ? cat.title_en : cat.title_al}
                </h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {language === "en" ? cat.desc_en : cat.desc_al}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Belief and Purpose */}
        <div className="grid gap-8 lg:grid-cols-2 mb-20">
          {/* Belief Card */}
          <div className="bg-slate-950 text-white rounded-[3rem] p-10 sm:p-12 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px] -ml-32 -mt-32" />
            <div className="relative z-10 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-brand-300 text-[10px] font-black uppercase tracking-widest border border-white/10">
                {language === "en" ? "OUR BELIEF" : "BESIMI YNË"}
              </span>
              <p className="text-2xl sm:text-3xl font-black text-white leading-relaxed">
                {language === "en"
                  ? "“We believe that every journey is important and it should be simple, authentic, and direct.”"
                  : "“Ne besojmë se çdo udhëtim është i rëndësishëm dhe ai duhet të jetë: i thjeshtë, autentik dhe direkt.”"}
              </p>
            </div>
            <div className="pt-8 relative z-10 flex items-center gap-3 text-brand-400 font-bold text-xs uppercase tracking-widest">
              <Heart className="w-5 h-5 text-brand-500 fill-brand-500 animate-pulse" />
              {language === "en" ? "TripShqip Philosophy" : "Filozofia e TripShqip"}
            </div>
          </div>

          {/* Purpose / Why Built Card */}
          <div className="bg-white rounded-[3rem] p-10 sm:p-12 border border-slate-100 shadow-soft space-y-8">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                {language === "en" ? "OUR MISSION" : "MISIONI YNË"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950">
                {language === "en" ? "Built For Discovery" : "Të Ndërtuar Për Zbulim"}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                {language === "en"
                  ? "Therefore, the platform is built to deliver direct actions:"
                  : "Prandaj platforma është ndërtuar për të kryer veprime direkte:"}
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  en: "Easily find places and businesses.",
                  al: "Gjetur lehtë vende dhe biznese."
                },
                {
                  en: "Contact hosts and business owners directly.",
                  al: "Kontaktuar direkt me pronarët e bizneseve."
                },
                {
                  en: "Organize your holidays faster without middlemen.",
                  al: "Organizuar pushimet më shpejt pa ndërmjetës."
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-white transition duration-300">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-slate-950">
                    {language === "en" ? item.en : item.al}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TripShqip Supports Section */}
        <div className="bg-emerald-50/50 rounded-[3.5rem] border border-emerald-100/70 p-10 sm:p-16 mb-16 relative overflow-hidden">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                {language === "en" ? "OUR COMMUNITY SUPPORT" : "MBËSHTETJA E KOMUNITETIT"}
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {language === "en" ? "TripShqip Supports:" : "TripShqip Mbështet:"}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { en: "Local Businesses", al: "Bizneset lokale" },
                  { en: "Authentic Tourism", al: "Turizmin autentik" },
                  { en: "Real Albanian Experiences", al: "Eksperiencat reale shqiptare" }
                ].map((support, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-emerald-100/50">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-black text-slate-950">{language === "en" ? support.en : support.al}</span>
                  </div>
                ))}
              </div>
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-semibold pt-4">
                {language === "en"
                  ? "We aim to create the largest and most organized tourism database in Albania, connecting travelers with local gems."
                  : "Ne synojmë të krijojmë databazën turistike më të madhe dhe më të organizuar në Shqipëri, duke lidhur udhëtarët me thesaret lokale."}
              </p>
            </div>
            <div className="lg:col-span-5 relative h-[250px] sm:h-[300px] w-full rounded-[2.5rem] overflow-hidden shadow-lg border border-white">
              <Image
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
                alt="Local products"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
          </div>
        </div>

        {/* Closing Premium Banner */}
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 text-white p-12 sm:p-20 text-center border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 to-emerald-600/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-6xl font-black tracking-tight leading-none text-white drop-shadow-md">
              {language === "en"
                ? "Find easily. Contact directly. Enjoy the journey."
                : "Gjej lehtë. Kontakto direkt. Shijo udhëtimin."}
            </h2>
            <div className="pt-4 flex justify-center gap-4">
              <Link
                href="/services"
                className="px-10 py-5 rounded-full bg-brand-600 text-white font-black text-sm uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/30 hover:scale-105 active:scale-95"
              >
                {language === "en" ? "Explore Marketplace" : "Eksploro Platformën"}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
