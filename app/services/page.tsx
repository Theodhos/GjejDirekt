import { Suspense } from "react";
import SearchFilters from "@/components/SearchFilters";
import ListingGrid from "@/components/ListingGrid";
import ServicesPageHeader from "@/components/services/ServicesPageHeader";

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
      <ServicesPageHeader />

      <section className="page-shell pt-10">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr] lg:gap-10">
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
