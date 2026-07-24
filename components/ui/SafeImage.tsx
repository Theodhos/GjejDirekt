"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE, isOptimizableImageSrc, resolveImageSrc } from "@/lib/images";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

/**
 * Drop-in replacement for `next/image` for any src that comes from the database or
 * from user input. It never throws on an unknown host: unlisted hosts are rendered
 * unoptimized, junk URLs (share links, empty values) and images that fail to load
 * fall back to `fallbackSrc`.
 */
export default function SafeImage({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  unoptimized,
  onError,
  ...rest
}: SafeImageProps) {
  // Tracking the failed src (instead of a boolean) resets the fallback automatically
  // when the parent moves to another image, e.g. a card slider.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const resolved = resolveImageSrc(src, fallbackSrc);
  const finalSrc = failedSrc === resolved ? fallbackSrc : resolved;

  return (
    <Image
      {...rest}
      alt={alt}
      src={finalSrc}
      unoptimized={unoptimized ?? !isOptimizableImageSrc(finalSrc)}
      onError={(event) => {
        setFailedSrc(resolved);
        onError?.(event);
      }}
    />
  );
}
