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

  return (
    <section id={id} className="py-5 sm:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          {eyebrow && (
            <p className="eyebrow mb-2">{eyebrow}</p>
          )}
          <h2
            className="font-bold tracking-tight"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
              lineHeight: 1.15
            }}
          >
            {title}
          </h2>
          {description && (
            <p
              className="mt-2.5 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start md:items-end gap-3 mt-3 md:mt-0">
          {actionButton}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all active:scale-95"
              style={{
                borderColor: "var(--border-medium)",
                background: "var(--surface-white)",
                color: "var(--text-secondary)"
              }}
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
              className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all active:scale-95"
              style={{
                borderColor: "var(--border-medium)",
                background: "var(--surface-white)",
                color: "var(--text-secondary)"
              }}
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
        </div>
      </div>

      {/* Scroll Rail */}
      <div
        ref={railRef}
        className="flex items-stretch gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-0.5 -mx-0.5"
      >
        {children}
      </div>
    </section>
  );
}
