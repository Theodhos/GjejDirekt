import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { categories, getCategoryByValue } from "@/lib/constants";
import SafeImage from "@/components/ui/SafeImage";
import { MapPin, SearchX } from "lucide-react";
import BusinessCard from "@/components/home/BusinessCard";
import EmptyState from "@/components/ui/EmptyState";
import City from "@/models/City";
import { seedCities } from "@/lib/cities-catalog";
import { rankListings } from "@/lib/ranking";
import { escapeRegex, safeJson } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getListingsByCity(city: string) {
  await connectDB();
  const found = await Listing.find({
    location: { $regex: escapeRegex(city), $options: "i" },
    status: "approved"
  })
    .sort({ createdAt: -1 })
    .lean<any[]>();
  // BusinessCard is a Client Component, so the ObjectId/Date values mongoose
  // returns have to be flattened before they cross the boundary.
  return safeJson(rankListings(found));
}

// generateMetadata and the page component both need this; `cache()` memoizes it
// per-request so the two calls share one DB round-trip instead of two.
const getCityMeta = cache(async (city: string) => {
  await connectDB();
  const customCity = await City.findOne({
    $or: [{ value: city.toLowerCase() }, { label: new RegExp(`^${escapeRegex(city)}$`, "i") }]
  }).lean<any>();

  if (customCity) return customCity;

  return (
    seedCities.find(
      (c) => c.value.toLowerCase() === city.toLowerCase() || c.label.toLowerCase() === city.toLowerCase()
    ) || null
  );
});

const categoryDescriptions: Record<string, string> = {
  "ushqim-pije": "Restorante, kafene dhe pastiçeri — porosit ose rezervo në WhatsApp.",
  hotele: "Hotele, bujtina dhe apartamente me qira për çdo buxhet.",
  shopping: "Veshje, elektronikë, dekor dhe gjithçka që mund të porositësh direkt.",
  supermarkete: "Supermarkete, minimarkete dhe produkte ushqimore me dërgesë.",
  bukuri: "Parukeri, berber, thonj dhe spa — rezervo takimin me një mesazh.",
  shendet: "Klinika, dentistë, laboratorë dhe fizioterapi pranë teje.",
  auto: "Servise, gomisteri, lavazh dhe makina me qira.",
  "shtepi-ndertim": "Mobilim, kuzhina, dyer, dritare dhe materiale ndërtimi.",
  "sherbime-shtepi": "Hidraulikë, elektricistë, bojaxhinj dhe pastrim — vijnë te ti.",
  "sherbime-profesionale": "Avokatë, kontabilistë, marketing dhe IT për biznesin tënd.",
  evente: "Salla, fotografë, DJ dhe dekor për dasmën a eventin tënd.",
  turizem: "Agjenci, guida, ture dhe aktivitete për ta zbuluar zonën.",
  arsim: "Kurse, gjuhë të huaja, trajnime dhe mësim privat.",
  "sport-fitness": "Palestra, yoga, pilates, pishina dhe tenis.",
  kafshe: "Pet shop, veterinerë dhe grooming për miqtë me putra.",
  "biznese-industri": "Materiale, pajisje profesionale dhe shitje me shumicë."
};

/** decodeURIComponent throws on malformed escapes (e.g. "%E0%A4%A"); fall back to the raw segment. */
function decodeCity(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = decodeCity(params.city);
  const cityMeta = await getCityMeta(cityName);
  const label = cityMeta?.label || cityName;
  return {
    title: `Biznese në ${label}`,
    description: `Gjej restorante, hotele, dyqane dhe shërbime në ${label} dhe porosit direkt në WhatsApp.`
  };
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const cityName = decodeCity(params.city);
  const [listings, cityMeta] = await Promise.all([getListingsByCity(cityName), getCityMeta(cityName)]);

  // An unknown city with nothing to show is a 404, not an empty page that still
  // renders a hero and ranks in search.
  if (!cityMeta && listings.length === 0) {
    notFound();
  }

  const cityImage =
    cityMeta?.image ||
    "https://images.unsplash.com/photo-1580997150503-490333240212?auto=format&fit=crop&w=2000&q=80";
  const cityLabel = cityMeta?.label || cityName;

  // Group by the resolved category so legacy listings still land in the right row.
  const categorySections = categories
    .map((category) => ({
      category,
      listings: listings.filter((listing) => getCategoryByValue(listing.category)?.value === category.value),
      description:
        categoryDescriptions[category.value] ||
        `Zbulo ${category.label.toLowerCase()} në ${cityLabel}.`
    }))
    .filter((section) => section.listings.length > 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      {/* Compact photo band — the city photo stays, but it never takes the whole screen. */}
      <section className="relative overflow-hidden" style={{ background: "#171A1F" }}>
        <SafeImage src={cityImage} alt={cityLabel} fill className="object-cover" priority />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(12,14,18,0.55) 0%, rgba(12,14,18,0.82) 100%)" }}
        />
        <div className="page-shell relative z-10 py-7 sm:py-10">
          <p
            className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            <MapPin className="h-3.5 w-3.5" />
            Shqipëri
          </p>
          <h1
            className="text-[26px] font-bold capitalize text-white sm:text-[2.25rem]"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.15 }}
          >
            {cityLabel}
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[15px]" style={{ color: "rgba(255,255,255,0.75)" }}>
            {listings.length} biznese në {cityLabel} — porosit ose rezervo direkt.
          </p>
        </div>
      </section>

      <div className="page-shell space-y-6 py-5 sm:space-y-8 sm:py-7">
        {categorySections.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={`Ende asnjë biznes në ${cityLabel}`}
            description="Provo një qytet tjetër ose regjistro biznesin tënd i pari këtu."
            action={
              <Link href="/create-listing" className="btn-primary">
                Regjistro biznesin tënd
              </Link>
            }
          />
        ) : (
          categorySections.map(({ category, listings: categoryListings, description }) => (
            <section key={category.value}>
              <div className="gd-section-head">
                <div className="min-w-0">
                  <h2 className="gd-section-title">{category.label}</h2>
                  <p className="mt-0.5 text-[12.5px]" style={{ color: "var(--text-secondary)" }}>
                    {description}
                  </p>
                </div>
                <Link href={`/categories/${category.value}`} className="gd-section-link">
                  Shiko të gjitha
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {categoryListings.map((listing: any) => (
                  <BusinessCard key={listing._id.toString()} listing={listing} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
