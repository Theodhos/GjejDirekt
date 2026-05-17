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
    <section id={id} className="py-4 sm:py-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-600 mb-2">{eyebrow}</p> : null}
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950">{title}</h2>
          {description ? <p className="mt-4 text-lg font-medium text-slate-500 leading-relaxed">{description}</p> : null}
        </div>
        <div className="flex flex-col items-start md:items-end gap-3 mt-4 md:mt-0">
          {actionButton}
          <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="group inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft transition-all hover:bg-slate-950 hover:text-white hover:shadow-xl active:scale-95"
            aria-label={`Scroll ${title} left`}
          >
            <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="group inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-soft transition-all hover:bg-slate-950 hover:text-white hover:shadow-xl active:scale-95"
            aria-label={`Scroll ${title} right`}
          >
            <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-6 px-1 -mx-1"
      >
        {children}
      </div>
    </section>
  );
}

