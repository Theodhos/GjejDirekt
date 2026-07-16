import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { categories } from "@/lib/constants";
import Image from "next/image";
import { MapPin } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import City from "@/models/City";
import { seedCities } from "@/lib/cities-catalog";
import { rankListings } from "@/lib/ranking";

export const dynamic = "force-dynamic";

async function getListingsByCity(city: string) {
  await connectDB();
  const found = await Listing.find({
    location: { $regex: city, $options: "i" },
    status: "approved"
  })
    .sort({ createdAt: -1 })
    .lean<any[]>();
  return rankListings(found);
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
    <main className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <section className="relative flex min-h-[calc(62vh-var(--header-height))] items-center overflow-hidden bg-slate-950 py-16 sm:min-h-[calc(72vh-var(--header-height))] sm:py-20">
        <div className="absolute inset-0">
          <Image src={cityImage} alt={cityLabel} fill className="object-cover opacity-90" unoptimized priority />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.48) 46%, rgba(0,0,0,0.18) 100%)"
            }}
          />
        </div>

        <div className="page-shell relative z-10">
          <div
            className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase"
            style={{
              color: "rgba(255,255,255,0.82)",
              letterSpacing: "0.18em",
              textShadow: "0 2px 8px rgba(0,0,0,0.45)"
            }}
          >
            <MapPin className="w-4 h-4" />
            {cityLabel} Albania
          </div>
          <h1
            className="mb-5 max-w-3xl font-bold capitalize text-white"
            style={{
              fontSize: "clamp(2.25rem, 6vw, 4rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              textShadow: "0 3px 24px rgba(0,0,0,0.72)"
            }}
          >
            {cityLabel}
          </h1>
          <p
            className="max-w-xl text-base font-semibold leading-relaxed sm:text-lg"
            style={{ color: "rgba(255,255,255,0.96)", textShadow: "0 2px 12px rgba(0,0,0,0.86)" }}
          >
            Eksploroni akomodimet, shijet lokale dhe aventurat me te mira ne {cityLabel}.
          </p>
        </div>
      </section>

      <div className="page-shell space-y-12 py-12 sm:space-y-16 sm:py-16">
        {categorySections.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="section-heading mb-4">Asnje sherbim nuk u gjet</h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Nuk u gjet asnje sherbim per &quot;{cityLabel}&quot; per momentin. Provoni nje qytet tjeter.
            </p>
          </div>
        ) : (
          categorySections.map(({ category, listings: catListings, description }) => (
            <section key={category.value} className="space-y-6">
              <div className="flex flex-col gap-2 border-b pb-4" style={{ borderColor: "var(--border-soft)" }}>
                <p className="eyebrow">{cityLabel}</p>
                <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {category.label}
                </h2>
                <p className="text-sm text-slate-500">
                  {description}
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {catListings.map((listing: any) => (
                  <ListingCard key={listing._id.toString()} listing={listing} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
}
