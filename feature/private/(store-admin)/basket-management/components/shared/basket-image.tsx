"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { getDefaultBasketImage } from "../../../../../../constants/basket.constants";
import type { BasketType } from "../../types/basket.types";

interface BasketImageProps {
  image?: string | null;
  basketType: BasketType;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Basket artwork; falls back to the default image for the basket type */
export function BasketImage({
  image,
  basketType,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority,
}: BasketImageProps) {
  const fallback = getDefaultBasketImage(basketType);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = image && image !== failedSrc ? image : fallback;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-900",
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
