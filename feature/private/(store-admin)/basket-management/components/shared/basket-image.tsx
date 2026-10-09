"use client";

import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { cn } from "@/lib/utils";

import { getBasketFallbackImage } from "../../../../../../constants/basket.constants";
import type { BasketType } from "../../types/basket.types";

export interface BasketImageProps {
  image?: string | null;
  /** Food Remit library image key; falls back to the template image */
  libraryImage?: string | null;
  basketType: BasketType;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  previewable?: boolean;
  onImageClick?: (src: string) => void;
}

export function BasketImage({
  image,
  libraryImage,
  basketType,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority,
  previewable = true,
  onImageClick,
}: BasketImageProps) {
  const fallback = getBasketFallbackImage({ libraryImage, basketType });
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const src = image && image !== failedSrc ? image : fallback;

  const handleClick = (e: React.MouseEvent) => {
    if (!previewable || !src) return;
    e.preventDefault();
    e.stopPropagation();
    if (onImageClick) {
      onImageClick(src);
    } else {
      setLightboxOpen(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          "group/basket-img relative overflow-hidden bg-linear-to-br from-emerald-50 to-amber-50 dark:from-slate-800 dark:to-slate-900",
          previewable && "cursor-pointer",
          className,
        )}
        onClick={previewable ? handleClick : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-300",
            previewable && "group-hover/basket-img:scale-105",
          )}
          onError={() => image && setFailedSrc(image)}
        />
        {previewable && (
          <span
            aria-label={`View ${alt} full size`}
            className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 group-hover/basket-img:bg-black/35 group-hover/basket-img:opacity-100"
          >
            <span className="flex size-9 items-center justify-center rounded-full text-white hover:scale-110">
              <Maximize2 className="size-4.5" />
            </span>
          </span>
        )}
      </div>

      {lightboxOpen && src && (
        <ImageLightbox src={src} alt={alt} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
