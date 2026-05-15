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
    <section className="space-y-10">
      {/* Category Header */}
      <div className="border-b border-slate-200 pb-8">
        <h2 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tighter leading-none">
          {categoryLabel}
        </h2>
        <p className="mt-4 text-lg text-slate-500 font-medium max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Slider */}
      <div>
        {/* Navigation Arrows */}
        <div className="flex items-center justify-end gap-3 mb-6">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-950 hover:text-white hover:shadow-xl active:scale-95"
            aria-label={`Scroll ${categoryLabel} left`}
          >
            <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-950 hover:text-white hover:shadow-xl active:scale-95"
            aria-label={`Scroll ${categoryLabel} right`}
          >
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Cards Rail */}
        <div
          ref={railRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1 -mx-1"
        >
          {listings.map((listing: any) => (
            <div
              key={listing._id?.toString()}
              className="w-[340px] sm:w-[380px] shrink-0 snap-start"
            >
              <ListingCard listing={listing} />
            </div>
          ))}

          {listings.length === 0 && (
            <div className="w-full flex items-center justify-center py-16 bg-slate-100/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Nuk ka shërbime të disponueshme për momentin
              </p>
            </div>
          )}
        </div>

        {/* Dots Indicator */}
        {listings.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {Array.from({ length: Math.min(listings.length, 8) }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-6 rounded-full bg-slate-200 first:bg-slate-950"
              />
            ))}
            {listings.length > 8 && (
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
                +{listings.length - 8} më shumë
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
