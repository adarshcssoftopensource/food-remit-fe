"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { getBasketFallbackImage } from "../../../../../../constants/basket.constants";
import type { BasketType } from "../../types/basket.types";

interface BasketImageProps {
  image?: string | null;
  /** Food Remit library image key; falls back to the template image */
  libraryImage?: string | null;
  basketType: BasketType;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function BasketImage({
  image,
  libraryImage,
  basketType,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority,
}: BasketImageProps) {
  const fallback = getBasketFallbackImage({ libraryImage, basketType });
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = image && image !== failedSrc ? image : fallback;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-linear-to-br from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-900",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => image && setFailedSrc(image)}
      />
    </div>
  );
}
