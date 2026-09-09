"use client";

import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/pricing";
import type { ProductCardData } from "@/lib/products";

/**
 * Product tile: photo, product name, the business behind it, and the price in red.
 * Same footprint as BusinessCard so the two rails line up on the home page.
 */
export default function ProductCard({ product, className = "" }: { product: ProductCardData; className?: string }) {
  return (
    <Link href={product.href} className={`gd-card group flex flex-col ${className}`}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 45vw, 220px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-0.5 p-2.5">
        <h3 className="line-clamp-1 text-[13px] font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
          {product.name}
        </h3>
        <p className="line-clamp-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          {product.businessName}
        </p>
        <p className="gd-price mt-auto pt-1 text-[13px]">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
