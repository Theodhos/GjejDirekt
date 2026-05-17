import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { categories } from "@/lib/constants";
import Image from "next/image";
import { MapPin, Sparkles } from "lucide-react";
import CityCategorySlider from "@/components/city/CityCategorySlider";
import City from "@/models/City";
import { seedCities } from "@/lib/cities-catalog";

async function getListingsByCity(city: string) {
  await connectDB();
  return Listing.find({
    location: { $regex: city, $options: "i" },
    status: "approved"
  })
    .sort({ createdAt: -1 })
    .lean<any[]>();
}

async function getCityMeta(city: string) {
  await connectDB();
  const customCity = await City.findOne({
    $or: [{ value: city.toLowerCase() }, { label: new RegExp(`^${city}$`, "i") }]
  }).lean<any>();

  if (customCity) return customCity;

  return (
    seedCities.find(
      (c) => c.value.toLowerCase() === city.toLowerCase() || c.label.toLowerCase() === city.toLowerCase()
    ) || null
  );
}

const categoryDescriptions: Record<string, string> = {
  akomodim: "Gjeni vendin e duhur per te qendruar, nga hotelet luksoze te resortet bregdetare.",
  restorante: "Shijoni kuzhinen lokale dhe nderkombetare ne restorantet me te mira te qytetit.",
  atraksione: "Zbuloni atraksione natyrore, histori dhe eksperienca unike per cdo vizitor.",
  evente: "Qendroni te informuar per evente, festivale dhe aktivitete kulturore ne qytet.",
  "sherbime-turistike": "Planifikoni udhetimin me guida dhe sherbime turistike te besueshme.",
  "produkte-lokale": "Gjeni produkte autentike lokale, suvenire dhe artizanat tradicional.",
  transport: "Levizni lehte me taksi, transferte, makina me qira dhe transport lokal."
};

export default async function CityPage({ params }: { params: { city: string } }) {
  const cityName = decodeURIComponent(params.city);
  const listings = await getListingsByCity(cityName);
  const cityMeta = await getCityMeta(cityName);

  const cityImage =
    cityMeta?.image ||
    "https://images.unsplash.com/photo-1580997150503-490333240212?auto=format&fit=crop&w=2000&q=80";
  const cityLabel = cityMeta?.label || cityName;

  const categorySections = categories
    .map((cat) => {
      const catListings = listings.filter((l) => l.category === cat.value);
      return {
        category: cat,
        listings: catListings,
        description:
          categoryDescriptions[cat.value] || `Zbuloni mundesite e ${cat.label.toLowerCase()} ne ${cityLabel}.`
      };
    })
    .filter((s) => s.listings.length > 0);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative h-[65vh] flex items-center justify-center bg-slate-950 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={cityImage} alt={cityLabel} fill className="object-cover opacity-30 animate-slow-zoom" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-50" />
        </div>

        <div className="page-shell relative z-10 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-brand-500/10 border border-brand-500/20 backdrop-blur-md px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-brand-400 mb-8 animate-fade-in">
            <MapPin className="w-4 h-4" />
            {cityLabel} Albania
          </div>
          <h1 className="text-7xl sm:text-9xl font-black text-white tracking-tighter mb-6 capitalize animate-slide-up">{cityLabel}</h1>
          <p className="text-xl sm:text-2xl text-white/70 font-medium max-w-2xl mx-auto animate-slide-up delay-100">
            Eksploroni akomodimet, shijet lokale dhe aventurat me te mira ne {cityLabel}.
          </p>
        </div>
      </section>

      <div className="page-shell py-20 space-y-24">
        {categorySections.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-slate-100 text-slate-400 mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-black text-slate-950 mb-4">Asnje sherbim nuk u gjet</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Nuk u gjet asnje sherbim per "{cityLabel}" per momentin. Provoni nje qytet tjeter.
            </p>
          </div>
        ) : (
          categorySections.map(({ category, listings: catListings, description }) => (
            <CityCategorySlider
              key={category.value}
              categoryLabel={category.label}
              description={description}
              listings={catListings}
              cityName={cityLabel}
            />
          ))
        )}
      </div>
    </main>
  );
}
