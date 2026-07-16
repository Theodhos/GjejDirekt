"use client";

import { useState, useEffect, useRef } from "react";
import Lightbox from "@/components/ui/Lightbox";
import { Maximize2, Heart, ArrowLeft, Share2, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import toast from "react-hot-toast";

interface ListingGalleryProps {
  images: string[];
  listing: any;
}

export default function ListingGallery({ images, listing }: ListingGalleryProps) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: -width, behavior: "smooth" });
    }
  };

  const scrollNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: width, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!listing?._id) return;
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const exists = Array.isArray(data.favorites) && data.favorites.some((item: any) => item._id === listing._id);
        setFavorited(exists);
      })
      .catch(() => undefined);
  }, [listing?._id]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!listing?._id) return;
    
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing._id })
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Could not update favorites");
        return;
      }
      setFavorited(Boolean(data.favorited));
      toast.success(
        data.favorited 
          ? translations[language].listing.savedToFavorites
          : translations[language].listing.removedFromFavorites
      );
    } catch (err) {
      toast.error(translations[language].listing.updateFavoritesFailed);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const baseUrl = typeof window !== "undefined" && !window.location.hostname.includes("localhost")
      ? "https://www.tripshqip.com"
      : "http://localhost:3000";
    const url = `${baseUrl}/listings/${listing?.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          url: url,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = url;
          textarea.style.position = "fixed";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        toast.success(translations[language].listing.linkCopied);
      } catch (err) {
        toast.error(translations[language].listing.linkCopyFailed);
      }
    }
  };

  const openLightbox = (index: number) => {
    setInitialIndex(index);
    setIsOpen(true);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setMobileIndex(newIndex);
  };

  const validImages = images.filter(Boolean);
  const usedImages = validImages.length > 0 ? validImages : ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"];

  // Pad displayImages to always have 5 items so desktop grid never breaks
  const padImages = [...usedImages];
  while (padImages.length < 5) {
    padImages.push(usedImages[0]);
  }
  const displayImages = padImages.slice(0, 5);

  return (
    <>
      {/* ==================== DESKTOP LAYOUT (Airbnb 5-Photo Grid) ==================== */}
      <div className="relative hidden md:grid md:grid-cols-4 gap-3 h-[400px] lg:h-[480px] xl:h-[540px] w-full overflow-hidden group">
        {/* Main large image (Left half) */}
        <div 
          className="col-span-2 row-span-2 relative h-full w-full overflow-hidden cursor-zoom-in group/item"
          onClick={() => openLightbox(0)}
        >
          <img 
            src={displayImages[0]} 
            alt="Listing main image" 
            className="object-cover h-full w-full transition duration-700"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Maximize2 className="w-8 h-8 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Top Middle */}
        <div 
          className="relative h-full w-full overflow-hidden cursor-zoom-in group/item"
          onClick={() => openLightbox(1)}
        >
          <img 
            src={displayImages[1]} 
            alt="Listing image 2" 
            className="object-cover h-full w-full transition duration-700"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Top Right */}
        <div 
          className="relative h-full w-full overflow-hidden cursor-zoom-in group/item"
          onClick={() => openLightbox(2)}
        >
          <img 
            src={displayImages[2]} 
            alt="Listing image 3" 
            className="object-cover h-full w-full transition duration-700"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Bottom Middle */}
        <div 
          className="relative h-full w-full overflow-hidden cursor-zoom-in group/item"
          onClick={() => openLightbox(3)}
        >
          <img 
            src={displayImages[3]} 
            alt="Listing image 4" 
            className="object-cover h-full w-full transition duration-700"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Bottom Right */}
        <div 
          className="relative h-full w-full overflow-hidden cursor-zoom-in group/item"
          onClick={() => openLightbox(4)}
        >
          <img 
            src={displayImages[4]} 
            alt="Listing image 5" 
            className="object-cover h-full w-full transition duration-700"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Maximize2 className="w-6 h-6 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Show all photos Button (Bottom Right corner) */}
        {images.length > 0 && (
          <button 
            onClick={() => openLightbox(0)}
            className="absolute bottom-6 right-6 px-4 py-2.5 bg-white text-slate-900 rounded-xl shadow-lg border border-slate-200 font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all duration-200 active:scale-95 z-20"
          >
            <LayoutGrid className="w-4 h-4 text-slate-700" />
            <span>{translations[language].listing.showAllPhotos}</span>
          </button>
        )}
      </div>

      {/* ==================== MOBILE LAYOUT (Swipeable Slider) ==================== */}
      <div className="relative md:hidden left-1/2 right-1/2 w-screen max-w-none -translate-x-1/2 min-h-[520px] overflow-hidden">
        {/* Floating Share Action (Mobile Overlay) */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={handleShare} 
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-800 shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Arrows for Mobile Slider */}
        {images.length > 1 && (
          <>
            <button 
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-slate-800/80 shadow-md hover:scale-105 hover:bg-white/60 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-slate-800/80 shadow-md hover:scale-105 hover:bg-white/60 active:scale-95 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Horizontal scroll container with scroll snap */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory h-full w-full"
          onScroll={handleScroll}
        >
          {usedImages.map((img, idx) => (
            <div 
              key={idx} 
              className="min-w-full snap-start snap-always relative h-full w-full"
            >
              <img src={img} alt={`Slide ${idx + 1}`} className="object-cover h-full w-full" />
            </div>
          ))}
        </div>

        {/* Counter indicator (3 / 16) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-[11px] px-3 py-1.5 rounded-full font-semibold z-10 shadow-lg">
          {mobileIndex + 1} / {usedImages.length}
        </div>
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
