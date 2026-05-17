"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "@/components/ui/Lightbox";
import { Maximize2 } from "lucide-react";

export default function ListingGallery({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const openLightbox = (index: number) => {
    setInitialIndex(index);
    setIsOpen(true);
  };

  if (!images || images.length === 0) return null;

  const displayImages = images.slice(0, 5);

  return (
    <>
      <div className="relative group">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 h-auto md:h-[500px] lg:h-[620px]">
          {/* Main Cinematic Feature */}
          <div 
            className="col-span-12 md:col-span-8 relative aspect-[4/3] md:aspect-auto overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[4rem] shadow-2xl group/item cursor-zoom-in border-2 sm:border-4 border-white"
            onClick={() => openLightbox(0)}
          >
            <Image 
              src={displayImages[0]} 
              alt="Main Gallery" 
              fill 
              className="object-cover transition duration-1000 group-hover/item:scale-105" 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 flex items-center gap-3 sm:gap-4 translate-y-4 opacity-0 group-hover/item:translate-y-0 group-hover/item:opacity-100 transition-all duration-500">
               <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white">
                  <Maximize2 className="w-5 h-5 sm:w-8 sm:h-8" />
               </div>
               <span className="text-white font-black uppercase tracking-widest text-[10px] sm:text-xs">Expand Gallery</span>
            </div>
          </div>

          {/* Vertical Stack */}
          <div className="col-span-12 md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6">
            {displayImages.slice(1, 3).map((img, i) => (
              <div 
                key={i} 
                className="relative aspect-[4/3] md:aspect-auto md:flex-1 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3.5rem] shadow-2xl group/item cursor-zoom-in border-2 sm:border-4 border-white"
                onClick={() => openLightbox(i + 1)}
              >
                <Image 
                  src={img} 
                  alt={`Gallery ${i + 1}`} 
                  fill 
                  className="object-cover transition duration-1000 group-hover/item:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating "View All" Badge */}
        {images.length > 3 && (
          <button 
            onClick={() => openLightbox(0)}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 md:bottom-8 md:right-8 md:left-auto md:translate-x-0 px-6 py-3 sm:px-10 sm:py-5 bg-white text-slate-950 rounded-full shadow-2xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-widest hover:bg-brand-600 hover:text-white transition-all duration-300 active:scale-95 flex items-center gap-2 sm:gap-3 border border-slate-100 z-20 group/btn whitespace-nowrap"
          >
            <div className="flex -space-x-3">
               {images.slice(0, 3).map((img, i) => (
                 <div key={i} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white overflow-hidden">
                    <Image src={img} alt="Thumb" width={24} height={24} className="object-cover" />
                 </div>
               ))}
            </div>
            <span>View All {images.length} Photos</span>
          </button>
        )}
      </div>

      <Lightbox 
        images={images} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        initialIndex={initialIndex} 
      />
    </>
  );
}
