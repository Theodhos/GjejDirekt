import { Sparkles, MapPin } from "lucide-react";
import { Suspense } from "react";
import SearchFilters from "@/components/SearchFilters";
import ListingGrid from "@/components/ListingGrid";

function LoadingFallback() {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[450px] rounded-[2.5rem] bg-slate-200 animate-pulse" />
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-32">
      {/* Premium Header */}
      <section className="bg-slate-950 pt-24 pb-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />
        <div className="page-shell relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-brand-400 mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Verified Listings
            </div>
            <h1 className="text-6xl sm:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                Find Your <br /> Next Experience
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-slate-400 font-bold uppercase tracking-widest text-xs">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-500" />
                    Albania Wide
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    Verified Hosts
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Filters Left, Services Right */}
      <section className="page-shell -mt-20">
        <div className="grid gap-12 lg:grid-cols-[340px_1fr]">
          {/* Left: Filters Sidebar */}
          <aside className="relative z-20">
            <Suspense fallback={<div className="h-96 bg-white rounded-[2.5rem] animate-pulse shadow-soft" />}>
              <SearchFilters />
            </Suspense>
          </aside>

          {/* Right: Results Grid */}
          <div className="relative z-10 pt-20 lg:pt-0">
            <Suspense fallback={<LoadingFallback />}>
              <ListingGrid />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
