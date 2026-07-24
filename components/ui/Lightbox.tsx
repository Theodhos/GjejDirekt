"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

interface LightboxProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function Lightbox({ images, isOpen, onClose, initialIndex = 0 }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen) return null;

  const next = () => setCurrentIndex((currentIndex + 1) % images.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
      >
        <X className="w-10 h-10" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-20">
        <button 
          onClick={prev}
          className="absolute left-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all z-[110]"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
          <SafeImage
            src={images[currentIndex]}
            alt={`Gallery ${currentIndex}`}
            fill
            className="object-contain"
            priority
          />
        </div>

        <button 
          onClick={next}
          className="absolute right-8 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all z-[110]"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        {images.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentIndex ? 'bg-brand-500 w-8' : 'bg-white/20'}`}
          />
        ))}
      </div>
    </div>
  );
}
