import { Suspense } from "react";
import { MapPin, CheckCircle } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import ListingGrid from "@/components/ListingGrid";

function LoadingFallback() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[420px] animate-pulse"
          style={{ borderRadius: "16px", background: "var(--surface-subtle)" }}
        />
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh", paddingBottom: "5rem" }}>

      {/* ── PAGE HEADER — cream background like Stay Directory ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "var(--surface-cream)",
          borderBottom: "1px solid var(--border-soft)"
        }}
      >
        {/* Ambient soft blobs */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full"
          style={{ background: "rgba(34,153,120,0.05)", filter: "blur(100px)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-12 w-[300px] h-[300px] rounded-full"
          style={{ background: "rgba(34,153,120,0.04)", filter: "blur(80px)" }}
        />

        <div className="page-shell relative z-10 pt-14 pb-14">
          <p className="eyebrow mb-4">Verified Listings</p>
          <h1
            className="font-bold tracking-tight mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
              lineHeight: 1.1
            }}
          >
            Find Your Next Experience
          </h1>
          <p className="text-sm leading-relaxed max-w-md" style={{ color: "var(--text-secondary)" }}>
            Discover hotels, restaurants, attractions and services directly from verified local hosts in Albania.
          </p>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            {[
              { icon: MapPin, label: "Albania Wide" },
              { icon: CheckCircle, label: "Verified Hosts" },
              { icon: CheckCircle, label: "No Commission" }
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                <Icon className="w-4 h-4" style={{ color: "var(--brand-accent)" }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTERS + GRID ── */}
      <section className="page-shell pt-10">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[300px_1fr]">

          {/* Left: Filters */}
          <aside className="relative">
            <Suspense
              fallback={
                <div
                  className="h-96 animate-pulse"
                  style={{
                    borderRadius: "16px",
                    background: "var(--surface-subtle)"
                  }}
                />
              }
            >
              <SearchFilters />
            </Suspense>
          </aside>

          {/* Right: Results */}
          <div>
            <Suspense fallback={<LoadingFallback />}>
              <ListingGrid />
            </Suspense>
          </div>

        </div>
      </section>
    </main>
  );
}
