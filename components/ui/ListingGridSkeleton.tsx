/** One pulsing placeholder shaped like a ListingCard (aspect-[4/3] image + two text lines). */
function CardSkeleton() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-2xl"
      style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)" }}
    >
      <div className="aspect-[4/3] w-full animate-pulse" style={{ background: "var(--surface-cream)" }} />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded" style={{ background: "var(--surface-cream)" }} />
        <div className="h-3 w-1/2 animate-pulse rounded" style={{ background: "var(--surface-cream)" }} />
        <div className="h-3 w-1/3 animate-pulse rounded" style={{ background: "var(--surface-cream)" }} />
      </div>
    </div>
  );
}

/**
 * Instant placeholder for any route whose page is a grid of listing cards
 * (search results, category pages, city pages). Shown by that segment's
 * `loading.tsx` the moment navigation starts, so the click never feels stuck
 * waiting on the server's DB query.
 */
export default function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }}>
      <div className="page-shell py-8 sm:py-10">
        <div className="mb-6 h-8 w-56 animate-pulse rounded" style={{ background: "var(--surface-cream)" }} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
