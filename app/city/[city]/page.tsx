import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { categories } from "@/lib/constants";
import Image from "next/image";
import { MapPin, Sparkles } from "lucide-react";
import CityCategorySlider from "@/components/city/CityCategorySlider";

async function getListingsByCity(city: string) {
  await connectDB();
  return Listing.find({
    location: { $regex: city, $options: "i" },
    status: "approved",
  })
    .sort({ createdAt: -1 })
    .lean<any[]>();
}

/** Descriptive paragraph per category (Albanian) */
const categoryDescriptions: Record<string, string> = {
  akomodim:
    "Gjeni vendin e perfekt për të qëndruar — nga hotelet luksozë dhe resortet buzë detit, deri tek vilat intime dhe apartamentet komode. Të gjitha mundësitë e akomodimit në një vend të vetëm.",
  restorante:
    "Shijojini gatimet tradicionale shqiptare dhe kuzhinën ndërkombëtare. Eksploroni restorantet, kafetë dhe baret më të mira që ofron qyteti.",
  atraksione:
    "Zbuloni pasuritë natyrore, monumentet historike dhe shtegtimet mahnitëse. Eksperienca të paharrueshme për çdo lloj udhëtari.",
  evente:
    "Qëndroni të informuar për ngjarjet, festivalet, koncertet dhe aktivitetet kulturore. Mos humbisni asgjë ndërsa jeni në qytet.",
  "sherbime-turistike":
    "Planifikoni udhëtimin tuaj me guida profesionale, agjenci udhëtimi dhe shërbime ekskursionesh të besueshme.",
  "produkte-lokale":
    "Mbështetni artizanatin lokal dhe zbuloni produktet autentike të rajonit — nga suvenire unike deri tek produktet agro-ushqimore.",
  transport:
    "Lëvizni me lehtësi brenda dhe jashtë qytetit. Shërbime transferte, taksie, makinash me qira dhe transporti ujor.",
};

export default async function CityPage({
  params,
}: {
  params: { city: string };
}) {
  const cityName = decodeURIComponent(params.city);
  const listings = await getListingsByCity(cityName);

  // Build sections: one per category, aggregate ALL sub-category listings
  const categorySections = categories
    .map((cat) => {
      const catListings = listings.filter((l) => l.category === cat.value);
      return {
        category: cat,
        listings: catListings,
        description:
          categoryDescriptions[cat.value] ||
          `Zbuloni të gjitha mundësitë e ${cat.label.toLowerCase()} në ${cityName}.`,
      };
    })
    .filter((s) => s.listings.length > 0); // Only show categories that have listings

  return (
    <main className="min-h-screen bg-slate-50">
      {/* City Hero */}
      <section className="relative h-[65vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1580997150503-490333240212?auto=format&fit=crop&w=2000&q=80"
            alt={cityName}
            fill
            className="object-cover opacity-30 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-50" />
        </div>

        <div className="page-shell relative z-10 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-brand-500/10 border border-brand-500/20 backdrop-blur-md px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-brand-400 mb-8 animate-fade-in">
            <MapPin className="w-4 h-4" />
            {cityName} Albania
          </div>
          <h1 className="text-7xl sm:text-9xl font-black text-white tracking-tighter mb-6 capitalize animate-slide-up">
            {cityName}
          </h1>
          <p className="text-xl sm:text-2xl text-white/70 font-medium max-w-2xl mx-auto animate-slide-up delay-100">
            Eksploroni akomodimet, shijet lokale dhe aventurat më të mira në{" "}
            {cityName}.
          </p>
        </div>
      </section>

      {/* Category Sections */}
      <div className="page-shell py-20 space-y-24">
        {categorySections.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-slate-100 text-slate-400 mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-950 mb-4">
              Asnjë shërbim nuk u gjet
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Nuk mundëm të gjenim asnjë shërbim për &quot;{cityName}&quot; për
              momentin. Provoni një qytet tjetër!
            </p>
          </div>
        ) : (
          categorySections.map(({ category, listings: catListings, description }) => (
            <CityCategorySlider
              key={category.value}
              categoryLabel={category.label}
              description={description}
              listings={catListings}
              cityName={cityName}
            />
          ))
        )}
      </div>
    </main>
  );
}
