import Image from "next/image";
import Link from "next/link";
import { Sparkles, MapPin, ArrowLeft } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import ListingCard from "@/components/ListingCard";
import { albaniaCities } from "@/lib/albania-cities";
import { categories, getCategorySearchValues, getSubcategorySearchValues } from "@/lib/constants";
import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";

export const dynamic = "force-dynamic";

export default async function SubcategoryPage({
  params,
  searchParams
}: {
  params: { category: string; subcategory: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  await connectDB();

  const { category, subcategory } = params;
  
  // Find category label
  const categoryObj = categories.find(c => c.value === category);
  const subcategoryObj = categoryObj?.subcategories.find(s => s.value === subcategory);
  const subcategoryLabel = subcategoryObj?.label || subcategory.charAt(0).toUpperCase() + subcategory.slice(1);

  const query: Record<string, unknown> = { 
    status: "approved",
    category: { $in: getCategorySearchValues(category) },
    subcategory: { $in: getSubcategorySearchValues(category, subcategory) }
  };

  if (typeof searchParams.location === "string" && searchParams.location) query.location = { $regex: searchParams.location, $options: "i" };
  if (typeof searchParams.q === "string" && searchParams.q) query.$text = { $search: searchParams.q };

  const sort: Record<string, 1 | -1> =
    searchParams.sort === "popular"
      ? { views: -1, createdAt: -1 }
      : searchParams.sort === "rating"
        ? { ratingAverage: -1, reviewCount: -1, createdAt: -1 }
        : { createdAt: -1 };

  const listings = await Listing.find(query).sort(sort).lean<any>();

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* Category Banner */}
      <section className="relative h-[40vh] min-h-[350px] w-full overflow-hidden">
        <Image
          src={categoryObj?.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"}
          alt={subcategoryLabel}
          fill
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/20 to-slate-950/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
            <p className="text-xs uppercase tracking-[0.4em] font-black text-brand-400 mb-4">{categoryObj?.label || "Discovery"}</p>
            <h1 className="display-font text-5xl sm:text-7xl font-black tracking-tighter mb-6">
                {subcategoryLabel} <span className="italic font-light text-slate-300">in Albania</span>
            </h1>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <span className="opacity-40">/</span>
                <Link href="/services" className="hover:text-white transition">Services</Link>
                <span className="opacity-40">/</span>
                <span className="text-brand-400">{subcategoryLabel}</span>
            </div>
        </div>
      </section>

      <section className="page-shell -mt-16 relative z-20 pb-20">
        <div className="surface p-6 sm:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border-none shadow-2xl">
            <div className="max-w-2xl text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-4">Explore {listings.length} premium {subcategoryLabel.toLowerCase()}</h2>
                <p className="text-slate-600 leading-relaxed">
                    We&apos;ve curated the best {subcategoryLabel.toLowerCase()} across Albania. Each listing is verified for quality and trust to ensure you have the best experience.
                </p>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-[2rem] bg-brand-50 border border-brand-100 px-10 py-6 min-w-[180px]">
                <span className="text-5xl font-black text-brand-900 leading-none">{listings.length}</span>
                <span className="text-xs font-bold text-brand-700 uppercase tracking-widest">Total Results</span>
            </div>
        </div>

        {/* Quick City Filters */}
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-600" />
                    Browse by Popular Destinations
                </h3>
            </div>
            <div className="flex flex-wrap gap-3">
                <Link
                    href={`/services/${category}/${subcategory}`}
                    className={`inline-flex items-center rounded-full px-6 py-2.5 text-sm font-bold transition ${!searchParams.location ? 'bg-slate-950 text-white shadow-lg' : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-300'}`}
                >
                    All Regions
                </Link>
                {albaniaCities.slice(0, 10).map((city) => {
                    const isActive = searchParams.location === city.label;
                    return (
                        <Link
                            key={city.value}
                            href={`/services/${category}/${subcategory}?location=${encodeURIComponent(city.label)}`}
                            className={`inline-flex items-center rounded-full px-6 py-2.5 text-sm font-bold transition ${isActive ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-300'}`}
                        >
                            {city.label}
                        </Link>
                    );
                })}
            </div>
        </div>
          
        <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-white">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">Verified Listings</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Hand-picked by our editors</p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 font-medium">
                    Showing <span className="text-slate-950 font-black">{listings.length}</span> results found
                </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.length ? (
                listings.map((listing: any) => <ListingCard key={listing._id.toString()} listing={listing} />)
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center surface border-dashed bg-white/50">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-500 text-lg font-bold">No results found for your selection.</p>
                    <p className="text-slate-400 text-sm mt-2">Try clearing your location filter to see all {subcategoryLabel.toLowerCase()}.</p>
                    <Link href={`/services/${category}/${subcategory}`} className="mt-8 px-8 py-3 bg-slate-950 text-white rounded-full font-black text-sm hover:bg-brand-600 transition shadow-xl">
                        Clear all filters
                    </Link>
                </div>
              )}
            </div>
        </div>
      </section>
    </main>
  );
}

