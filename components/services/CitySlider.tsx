"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { albaniaCities } from "@/lib/albania-cities";

export default function CitySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center z-10">
        <button 
          onClick={() => scroll("left")}
          className="bg-white/90 backdrop-blur shadow-xl border border-slate-200 rounded-full p-2 -ml-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-500 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
      >
        {albaniaCities.map((city) => (
          <Link
            key={city.value}
            href={`/city/${city.value}`}
            className="inline-flex min-w-max items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-700 hover:shadow-lg hover:-translate-y-0.5"
          >
            <MapPin className="w-4 h-4 text-brand-500" />
            {city.label}
          </Link>
        ))}
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center z-10">
        <button 
          onClick={() => scroll("right")}
          className="bg-white/90 backdrop-blur shadow-xl border border-slate-200 rounded-full p-2 -mr-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-500 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
