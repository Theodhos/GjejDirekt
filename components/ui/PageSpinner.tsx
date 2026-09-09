import { Loader2 } from "lucide-react";

/**
 * The instant-feedback state Next.js shows the moment a click starts navigating
 * to a `force-dynamic` route, before that route's own server-side data fetch
 * resolves. Without a `loading.tsx` per segment, the browser just sits on the
 * old page with no feedback until the new one is fully ready — this is what
 * makes navigation feel stuck. Every route segment's `loading.tsx` renders one
 * of these (or a shape-matched skeleton) so a click always produces something
 * on screen immediately.
 */
export default function PageSpinner({ minHeight = "60vh" }: { minHeight?: string }) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-3"
      style={{ minHeight, background: "var(--surface-page)" }}
    >
      <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--brand-accent)" }} />
    </div>
  );
}
