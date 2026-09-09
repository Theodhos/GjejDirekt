/**
 * Instant placeholder for a listing detail page, shaped to match its real
 * layout (gallery, then a two-column body) so there's no jump once the real
 * content streams in. Shown immediately on click, before the server has even
 * started the DB query for that listing.
 */
export default function ListingDetailSkeleton() {
  const block = (className: string) => (
    <div className={`animate-pulse rounded-xl ${className}`} style={{ background: "var(--surface-cream)" }} />
  );

  return (
    <main style={{ background: "var(--surface-page)", minHeight: "100vh" }} className="pb-8">
      <section className="page-shell pb-0">
        {block("h-[280px] w-full sm:h-[420px]")}
      </section>

      <section className="page-shell mt-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="min-w-0 space-y-4">
            {block("h-6 w-24")}
            {block("h-9 w-2/3")}
            {block("h-4 w-1/3")}
            <div className="space-y-2 pt-4">
              {block("h-4 w-full")}
              {block("h-4 w-full")}
              {block("h-4 w-3/4")}
            </div>
          </div>
          <aside>{block("h-72 w-full")}</aside>
        </div>
      </section>
    </main>
  );
}
