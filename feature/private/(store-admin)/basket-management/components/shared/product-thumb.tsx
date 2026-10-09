"use client";

import { Maximize2, Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { cn } from "@/lib/utils";

export interface ProductThumbProps {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  iconClassName?: string;
  previewable?: boolean;
  onImageClick?: (src: string) => void;
}

export function ProductThumb({
  src,
  alt,
  className,
  sizes = "112px",
  iconClassName,
  previewable = true,
  onImageClick,
}: ProductThumbProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImage = Boolean(src && !failed);
  const canPreview = Boolean(hasImage && previewable);

  const handleClick = (e: React.MouseEvent) => {
    if (!canPreview || !src) return;
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
          "group/thumb relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700",
          canPreview && "cursor-pointer",
          className,
        )}
        onClick={canPreview ? handleClick : undefined}
      >
        {hasImage ? (
          <>
            <Image
              src={src!}
              alt={alt}
              fill
              sizes={sizes}
              className={cn(
                "object-contain p-0.5 transition-all duration-300",
                canPreview && "group-hover/thumb:scale-105",
                loaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
            />
            {canPreview && (
              <span
                aria-label={`View ${alt} full size`}
                className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-200 group-hover/thumb:bg-black/35 group-hover/thumb:opacity-100"
              >
                <Maximize2 className="size-3.5 drop-shadow-sm" />
              </span>
            )}
          </>
        ) : (
          <Package className={cn("size-4 text-slate-300", iconClassName)} />
        )}
      </div>

      {lightboxOpen && src && (
        <ImageLightbox src={src} alt={alt} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}
