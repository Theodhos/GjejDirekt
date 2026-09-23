import SafeImage from "@/components/ui/SafeImage";
import Link from "next/link";
import { MapPin, SearchX } from "lucide-react";
import BusinessCard from "@/components/home/BusinessCard";
import EmptyState from "@/components/ui/EmptyState";
import { albaniaCities } from "@/lib/albania-cities";
import { categories, getCategorySearchValues, getSubcategorySearchValues } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import { sortByPackageTier } from "@/lib/ranking";
import { escapeRegex, safeJson } from "@/lib/utils";
import ListingResults from "@/components/listings/ListingResults";
import { FOOD_CATEGORY, isFoodCategory } from "@/lib/food";
import { withMenuTerms } from "@/lib/food-server";

// Approved listings per subcategory change a handful of times a day — cache the
// page and refresh it in the background instead of hitting Mongo on every request.
export const revalidate = 60;

export default async function SubcategoryPage({
  params,
  searchParams
}: {
  params: { category: string; subcategory: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await connectDB();

  const { category, subcategory } = params;

  const categoryObj = categories.find(c => c.value === category);
  const subcategoryObj = categoryObj?.subcategories.find(s => s.value === subcategory);
  const subcategoryLabel = subcategoryObj?.label || subcategory.charAt(0).toUpperCase() + subcategory.slice(1);

  const query: Record<string, unknown> = {
    status: "approved",
    category: { $in: getCategorySearchValues(category) },
    subcategory: { $in: getSubcategorySearchValues(category, subcategory) }
  };

  // Food pages filter by city and search text on the device (ListingResults), so the whole
  // set is fetched for them; every other category still filters in the query.
  const isFood = isFoodCategory(category);
  if (!isFood) {
    if (typeof searchParams.location === "string" && searchParams.location) query.location = { $regex: escapeRegex(searchParams.location), $options: "i" };
    if (typeof searchParams.q === "string" && searchParams.q) query.$text = { $search: searchParams.q };
  }

  const sort: Record<string, 1 | -1> =
    searchParams.sort === "popular"
      ? { views: -1, createdAt: -1 }
      : searchParams.sort === "rating"
        ? { ratingAverage: -1, reviewCount: -1, createdAt: -1 }
        : { createdAt: -1 };

  const found = await Listing.find(query).sort(sort).lean<any>();
  const listings = sortByPackageTier(found);

  if (isFood) {
    const activeSubcategory = categoryObj?.subcategories.find((sub) => sub.value === subcategory || sub.aliases?.includes(subcategory))?.value ?? subcategory;
    return (
      <ListingResults
        listings={safeJson(await withMenuTerms(listings))}
        title={subcategoryLabel}
        category={FOOD_CATEGORY}
        showTabs
        initialQuery={typeof searchParams.q === "string" ? searchParams.q : ""}
        initialCity={typeof searchParams.location === "string" ? searchParams.location : ""}
        activeSubcategory={activeSubcategory}
        subcategoryBasePath={`/services/${FOOD_CATEGORY}`}
      />
    );
  }

  const activeLocation = typeof searchParams.location === "string" ? searchParams.location : "";
  const basePath = `/services/${category}/${subcategory}`;

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      {/* Compact photo band, same proportions as the city page. */}
      <section className="relative overflow-hidden" style={{ background: "#171A1F" }}>
        <SafeImage
          src={categoryObj?.image}
          alt={subcategoryLabel}
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(12,14,18,0.55) 0%, rgba(12,14,18,0.82) 100%)" }}
        />
        <div className="page-shell relative z-10 py-7 sm:py-10">
          <p
            className="mb-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            <Link href="/" className="hover:text-white">Kreu</Link>
            <span className="opacity-50">/</span>
            <Link href="/services" className="hover:text-white">Shërbime</Link>
            {categoryObj && (
              <>
                <span className="opacity-50">/</span>
                <Link href={`/categories/${categoryObj.value}`} className="hover:text-white">
                  {categoryObj.label}
                </Link>
              </>
            )}
          </p>
          <h1
            className="text-[26px] font-bold text-white sm:text-[2.25rem]"
            style={{ letterSpacing: "-0.025em", lineHeight: 1.15 }}
          >
            {subcategoryLabel}
          </h1>
          <p className="mt-1.5 max-w-lg text-[13px] sm:text-[15px]" style={{ color: "rgba(255,255,255,0.75)" }}>
            {listings.length} biznese të verifikuara — porosit ose rezervo direkt.
          </p>
        </div>
      </section>

      <div className="page-shell space-y-4 py-4 sm:py-6">
        {/* City filter — the one filter that matters on a subcategory page. */}
        <div className="gd-rail -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          <Link
            href={basePath}
            className="gd-quick-pill"
            style={
              !activeLocation
                ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" }
                : undefined
            }
          >
            <MapPin className="h-4 w-4" />
            Të gjitha
          </Link>
          {albaniaCities.slice(0, 10).map((city) => {
            const active = activeLocation === city.label;
            return (
              <Link
                key={city.value}
                href={`${basePath}?location=${encodeURIComponent(city.label)}`}
                className="gd-quick-pill"
                style={
                  active
                    ? { background: "var(--text-primary)", color: "#fff", borderColor: "var(--text-primary)" }
                    : undefined
                }
              >
                {city.label}
              </Link>
            );
          })}
        </div>

        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          <strong style={{ color: "var(--text-primary)" }}>{listings.length}</strong>{" "}
          {listings.length === 1 ? "biznes" : "biznese"}
          {activeLocation && ` në ${activeLocation}`}
        </p>

        {listings.length ? (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {listings.map((listing: any) => (
              <BusinessCard key={listing._id.toString()} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title={`Ende asnjë biznes te ${subcategoryLabel}`}
            description={
              activeLocation
                ? `Nuk ka biznese në ${activeLocation}. Provo një qytet tjetër.`
                : "Bëhu i pari që regjistrohet në këtë kategori."
            }
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Link href="/create-listing" className="btn-primary">
                  Regjistro biznesin tënd
                </Link>
                {activeLocation && (
                  <Link href={basePath} className="btn-secondary">
                    Pastro filtrat
                  </Link>
                )}
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
