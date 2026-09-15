"use client";

import { ArrowLeft, Share, Heart, MapPin, Phone, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SafeImage from "@/components/ui/SafeImage";
import { useLanguage } from "@/context/LanguageContext";
import { buildWhatsappActions } from "@/lib/constants";

export default function ListingMobileHeader({ listing }: { listing: any }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        const listingId = listing._id || listing.id;
        const exists = Array.isArray(data.favorites) && data.favorites.some((item: any) =>
          (item._id === listingId) || (item === listingId)
        );
        setFavorited(exists);
      })
      .catch(() => {});
  }, [listing]);

  const toggleFavorite = async () => {
    try {
      const listingId = listing._id || listing.id;
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId })
      });
      const data = await response.json();

      if (response.status === 401) {
        toast.error(language === "en" ? "You must be logged in to save favorites!" : "Duhet të identifikoheni për të shtuar në të preferuarat!");
        return;
      }

      if (!response.ok) {
        toast.error(data.error || "Could not update favorites");
        return;
      }

      setFavorited(Boolean(data.favorited));
      toast.success(
        data.favorited
          ? (language === "en" ? "Saved to favorites" : "U ruajt te të preferuarat")
          : (language === "en" ? "Removed from favorites" : "U hoq nga të preferuarat")
      );
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: listing.title,
          text: listing.description || "",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(language === "en" ? "Link copied to clipboard!" : "Linku u kopjua!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const phone = listing.contactInfo?.phone?.trim() || listing.contactPhone?.trim() || "";
  const phoneDigits = phone.replace(/\D/g, "");
  const whatsappActions = buildWhatsappActions(listing, phoneDigits);
  const whatsappHref = whatsappActions[0]?.href || "";

  const mapAddress = [listing.address, listing.location, listing.country].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(
    listing.coordinates?.lat && listing.coordinates?.lng
      ? `${listing.coordinates.lat},${listing.coordinates.lng}`
      : mapAddress || listing.title
  );
  const externalMapUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const track = (kind: "phone-click" | "whatsapp-click" | "map-click") => {
    if (!listing._id) return;
    fetch(`/api/listings/${listing._id}/${kind}`, { method: "POST", keepalive: true }).catch(() => {});
  };

  return (
    <div className="bg-white pb-4 pt-4 px-4 sm:px-6 w-full max-w-[1200px] mx-auto">
      {/* Top Nav */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="w-6 h-6" style={{ color: "var(--text-primary)" }} />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={handleShare} className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
            <Share className="w-5 h-5" style={{ color: "var(--text-primary)" }} />
          </button>
          <button onClick={toggleFavorite} className="p-2 -mr-2 rounded-full hover:bg-neutral-100 transition-colors">
            <Heart className={`w-5 h-5 transition-colors ${favorited ? "fill-[var(--brand-accent)] text-[var(--brand-accent)]" : "text-[var(--text-primary)]"}`} />
          </button>
        </div>
      </div>

      <div className="relative -mx-4 mb-4 h-[180px] overflow-hidden sm:-mx-6 sm:h-[250px]">
        <SafeImage
          src={listing.bannerImage || listing.images?.[1] || listing.photos?.[1] || listing.images?.[0]}
          alt={`${listing.title} cover`}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
      </div>

      {/* Business Info */}
      <div className="relative z-10 -mt-12 flex gap-4 items-center rounded-t-3xl bg-white px-2 pt-3 mb-6">
        {/* Circular Logo */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shrink-0 shadow-md border-4 border-white">
          <SafeImage
            src={listing.logo || listing.images?.[0] || listing.photos?.[0] || listing.bannerImage}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        
        {/* Title & Meta */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[22px] sm:text-[26px] font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
            {listing.title}
          </h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              {language === "en" ? "Open now" : "Hapur tani"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-bold" style={{ color: "#F5A524" }}>★</span>
              <span className="text-[13px] font-bold" style={{ color: "var(--text-secondary)" }}>4.8</span>
              <span className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>(128)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }} />
              <span className="text-[13px] truncate" style={{ color: "var(--text-secondary)" }}>{listing.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex gap-2">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("whatsapp-click")}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 transition-colors hover:bg-green-50 active:scale-[0.98]"
            style={{ borderColor: "var(--whatsapp-green)", color: "var(--whatsapp-green)" }}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[13px] font-bold">WhatsApp</span>
          </a>
        )}
        
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={() => track("phone-click")}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 transition-colors hover:bg-red-50 active:scale-[0.98]"
            style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)" }}
          >
            <Phone className="w-4 h-4" />
            <span className="text-[13px] font-bold">Telefono</span>
          </a>
        )}

        <a
          href={externalMapUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => track("map-click")}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 transition-colors hover:bg-red-50 active:scale-[0.98]"
          style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)" }}
        >
          <MapPin className="w-4 h-4" />
          <span className="text-[13px] font-bold">Shiko në hartë</span>
        </a>
      </div>
    </div>
  );
}
