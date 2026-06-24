"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ListingCard from "@/components/ListingCard";

type Props = {
  categoryLabel: string;
  description: string;
  listings: any[];
  cityName: string;
};

export default function CityCategorySlider({
  categoryLabel,
  description,
  listings,
  cityName,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    railRef.current?.scrollBy({ left: direction * 420, behavior: "smooth" });
  }

  return (
    <section className="space-y-5">
      {/* Category Header */}
      <div className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-end sm:justify-between" style={{ borderColor: "var(--border-soft)" }}>
        <div>
          <p className="eyebrow mb-3">{cityName}</p>
          <h2 className="font-bold tracking-tight" style={{ color: "var(--text-primary)", fontSize: "clamp(1.55rem, 3vw, 2.25rem)", lineHeight: 1.14 }}>
            {categoryLabel}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5 active:scale-95"
            style={{
              background: "var(--surface-white)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
              boxShadow: "none"
            }}
            aria-label={`Scroll ${categoryLabel} left`}
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all hover:-translate-y-0.5 active:scale-95"
            style={{
              background: "var(--surface-white)",
              borderColor: "var(--border-soft)",
              color: "var(--text-secondary)",
              boxShadow: "none"
            }}
            aria-label={`Scroll ${categoryLabel} right`}
          >
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <div>
        {/* Cards Rail */}
        <div
          ref={railRef}
          className="-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 py-3 scroll-smooth no-scrollbar"
        >
          {listings.map((listing: any) => (
            <div
              key={listing._id?.toString()}
              className="w-[300px] shrink-0 snap-start sm:w-[340px]"
            >
              <ListingCard listing={listing} />
            </div>
          ))}

          {listings.length === 0 && (
            <div
              className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed py-16"
              style={{ background: "var(--surface-cream)", borderColor: "var(--border-soft)" }}
            >
              <p className="eyebrow">
                Nuk ka shërbime të disponueshme për momentin
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
