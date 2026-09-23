"use client";

import { LayoutGrid } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { getCategoryByValue } from "@/lib/constants";
import { getCategoryIcon } from "@/lib/category-icons";

export type ListingsBannerData = {
  /** The category's picture. */
  image?: string;
  /** A row of pictures instead of one — used when the directory mixes every category. */
  images?: string[];
  title: string;
  subtitle?: string;
  /** Canonical category value — picks the icon chip and its colour. Omit for the "all businesses" banner. */
  category?: string;
};

/**
 * The photo banner above the directory's search field. Each category brings its own
 * picture, name and colour, so the page reads as that category the moment it opens;
 * with no category picked it shows the general "search businesses" banner.
 */
export default function ListingsBanner({ image, images, title, subtitle, category }: ListingsBannerData) {
  const definition = getCategoryByValue(category);
  const Icon = definition ? getCategoryIcon(definition.value) : LayoutGrid;

  return (
    <div className="relative h-[150px] overflow-hidden sm:h-[190px] lg:h-[220px]" style={{ background: "#171A1F" }}>
      {images?.length ? (
        <div className="absolute inset-0 flex">
          {images.map((src, index) => (
            <div key={src} className="relative h-full flex-1">
              <SafeImage src={src} alt="" fill priority={index < 2} sizes="300px" className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <SafeImage
          src={image}
          alt=""
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1136px"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />

      {/* Full-bleed picture, but the words line up with the header's content. */}
      <div className="absolute inset-0">
        <div className="mx-auto flex h-full items-center gap-3.5 px-4 sm:gap-5 lg:w-[calc(100%-4rem)] lg:max-w-[1136px] lg:px-0">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white sm:h-16 sm:w-16"
          style={{ background: definition?.color || "var(--brand-accent)", boxShadow: "0 3px 12px rgba(15,20,25,0.25)" }}
        >
          <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">GjejDirekt</p>
          {/* The site's mobile stylesheet forces h1 sizes with !important, hence the !utilities. */}
          <h1 className="mt-0.5 !text-[24px] font-bold !leading-tight text-white sm:!text-[32px]" style={{ letterSpacing: "-0.02em" }}>
            {title}
          </h1>
          {subtitle && <p className="mt-1 line-clamp-2 text-[13px] text-white/85 sm:text-[15px]">{subtitle}</p>}
        </div>
        </div>
      </div>
    </div>
  );
}
