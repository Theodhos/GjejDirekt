import { connectDB } from "@/lib/db";
import Listing from "@/models/Listing";
import ListingCard from "@/components/ListingCard";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ListingsPage() {
  await connectDB();
  const listings = await Listing.find({ status: "approved" }).sort({ createdAt: -1 }).lean<any>();

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,#38bdf8_0%,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e_0%,transparent_30%)]" />
        <div className="page-shell relative py-24">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Listings</p>
          <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">Browse all listings</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            Explore the latest approved offerings with city, service, guest count and contact details all in one place.
          </p>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-brand-600 font-black mb-2">{listings.length} {listings.length === 1 ? 'result' : 'results'}</p>
            <h2 className="text-3xl font-black text-slate-950">Latest approved listings</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Verified and reviewed content
          </div>
        </div>

        {listings.length ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing: any) => (
              <ListingCard key={listing._id.toString()} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-dashed border-slate-300 bg-white p-16 text-center">
            <p className="text-2xl font-black text-slate-900 mb-4">No approved listings found.</p>
            <p className="text-slate-500">If you have added a listing recently, it may still be waiting for approval.</p>
          </div>
        )}
      </section>
    </main>
  );
}
