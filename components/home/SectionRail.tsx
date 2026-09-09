"use client";

import Link from "next/link";
import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SectionRailProps = {
  id?: string;
  title: string;
  /** Renders the red "see all" link on the right of the heading. */
  href?: string;
  linkLabel?: string;
  children: ReactNode;
};

/**
 * The horizontal section used everywhere on GjejDirekt: bold title, red "see all"
 * link, and cards that scroll sideways. On phones the rail bleeds past the page
 * gutter so the next card is always half-visible — that peek is what tells people
 * the row scrolls. Arrow buttons only appear from `md` up, where there is no swipe.
 */
export default function SectionRail({ id, title, href, linkLabel, children }: SectionRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    railRef.current?.scrollBy({ left: direction * 400, behavior: "smooth" });
  }

  return (
    <section id={id} className="scroll-mt-20">
      <div className="gd-section-head">
        <h2 className="gd-section-title">{title}</h2>

        <div className="flex items-center gap-2">
          {href && (
            <Link href={href} className="gd-section-link">
              {linkLabel || "Shiko të gjitha"}
            </Link>
          )}
          <div className="hidden items-center gap-1.5 md:flex">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => scroll(direction)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--surface-subtle)]"
                style={{ borderColor: "var(--border-medium)", color: "var(--text-secondary)" }}
                aria-label={`${title}: ${direction === -1 ? "prapa" : "përpara"}`}
              >
                {direction === -1 ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* -mx / px pair lets the first card align to the gutter while the last one
          can still scroll fully into view. */}
      <div ref={railRef} className="gd-rail -mx-4 scroll-smooth px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        {children}
      </div>
    </section>
  );
}
