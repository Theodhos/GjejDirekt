"use client";

import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HorizontalRailProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  actionButton?: ReactNode;
  children: ReactNode;
};

export default function HorizontalRail({ id, eyebrow, title, description, actionButton, children }: HorizontalRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    railRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  }

  // The two nav arrows, reused for the mobile (inline with the title) and desktop
  // (right-aligned) layouts so the markup stays in one place.
  const arrows = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="group inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border transition-all active:scale-95"
        style={{ borderColor: "var(--border-medium)", background: "var(--surface-white)", color: "var(--text-secondary)" }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--text-primary)";
          (e.currentTarget as HTMLElement).style.color = "#fff";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--surface-white)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
        }}
        aria-label={`Scroll ${title} left`}
      >
        <ChevronLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-0.5" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        className="group inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border transition-all active:scale-95"
        style={{ borderColor: "var(--border-medium)", background: "var(--surface-white)", color: "var(--text-secondary)" }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--text-primary)";
          (e.currentTarget as HTMLElement).style.color = "#fff";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--text-primary)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "var(--surface-white)";
          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border-medium)";
        }}
        aria-label={`Scroll ${title} right`}
      >
        <ChevronRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );

  // No vertical padding on the section — the home page sets the rhythm with space-y,
  // which keeps the gaps compact and identical between every rail. scroll-mt clears
  // the fixed header when an anchor link jumps to a category.
  return (
    <section id={id} className="scroll-mt-24">
      {/* Header */}
      <div className="mb-4 sm:mb-5 md:flex md:items-end md:justify-between md:gap-4">
        <div className="min-w-0 max-w-xl">
          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}

          {/* On phones the arrows sit on the title's line; from md up they move to the
              right cluster and this inline copy is hidden. */}
          <div className="flex items-center justify-between gap-3">
            <h2
              className="font-bold tracking-tight"
              style={{ color: "var(--text-primary)", fontSize: "clamp(1.5rem, 3.5vw, 2rem)", lineHeight: 1.15 }}
            >
              {title}
            </h2>
            <div className="shrink-0 md:hidden">{arrows}</div>
          </div>

          {description && (
            <p className="mt-2.5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {description}
            </p>
          )}

          {/* Action button (e.g. blog "view all") drops below on phones. */}
          {actionButton && <div className="mt-3 md:hidden">{actionButton}</div>}
        </div>

        {/* Desktop right cluster */}
        <div className="mt-3 hidden shrink-0 md:mt-0 md:flex md:flex-col md:items-end md:gap-3">
          {actionButton}
          {arrows}
        </div>
      </div>

      {/* Scroll Rail */}
      <div
        ref={railRef}
        className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-3 px-0.5 -mx-0.5"
      >
        {children}
      </div>
    </section>
  );
}
