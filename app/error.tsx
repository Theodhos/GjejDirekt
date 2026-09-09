"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

/**
 * Catches render/data errors thrown anywhere under the root layout. Without this
 * boundary an unexpected server error dropped the visitor onto Next.js' raw crash
 * screen instead of the site.
 */
export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-shell flex min-h-[60vh] items-center justify-center py-12 text-center sm:py-20">
      <div className="surface max-w-xl p-6 sm:p-8">
        <p className="eyebrow">Gabim</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Diçka shkoi keq</h1>
        <p className="mt-3 text-slate-600">
          Nuk arritëm ta ngarkojmë këtë faqe. Provo sërish ose kthehu në faqen kryesore.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-slate-400">Kodi i gabimit: {error.digest}</p>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95"
          >
            Provo sërish
          </button>
          <Button href="/" variant="secondary">
            Kthehu në ballinë
          </Button>
        </div>
      </div>
    </section>
  );
}
