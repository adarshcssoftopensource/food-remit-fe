"use client";

import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
  alt?: string;
  maxWidthClass?: string;
}

const emptySubscribe = () => () => {};

export function ImageLightbox({
  src,
  onClose,
  alt = "Full size",
  maxWidthClass,
}: ImageLightboxProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [prevSrc, setPrevSrc] = useState(src);
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsImageLoading(true);
  }

  useEffect(() => {
    // Lock body scroll when open
    if (src) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [src]);

  if (!src || !isClient || typeof document === "undefined") {
    return null;
  }

  const isQrCode =
    src.includes("qrserver.com") ||
    src.toLowerCase().includes("qr") ||
    src.startsWith("data:image");

  const effectiveMaxWidth =
    maxWidthClass || (isQrCode ? "max-w-[280px] sm:max-w-[340px]" : "max-w-[50vw]");

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-200"
      style={{ zIndex: 99999, background: "rgba(15,15,20,0.65)" }}
      onClick={onClose}
    >
      <div
        className={`relative overflow-hidden rounded-3xl border border-white/20 bg-white/95 p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/95 ${
          isQrCode
            ? "min-h-70 w-70 sm:min-h-85 sm:w-85"
            : "min-h-80 w-[90vw] max-w-135 sm:min-h-105"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          aria-label="Close"
          className="absolute top-3 right-3 z-30 flex size-8 items-center justify-center rounded-full bg-slate-100/90 text-slate-600 shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-slate-200 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <X className="size-4" />
        </Button>

        {/* Skeleton Loading State while image is downloading */}
        {isImageLoading && (
          <div className="absolute inset-3 z-10 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-slate-100/80 dark:bg-slate-800/60">
            <Skeleton className="absolute inset-0 size-full rounded-2xl bg-slate-200/60 dark:bg-slate-800/80" />
            <div className="relative z-20 flex flex-col items-center justify-center gap-2.5 text-center">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white/80 shadow-xs ring-1 ring-slate-200/60 dark:bg-slate-900/80 dark:ring-slate-700">
                <Loader2 className="text-primary size-5 animate-spin" />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Loading image...
              </p>
            </div>
          </div>
        )}

        {/* Image Container */}
        <div className="flex min-h-[240px] items-center justify-center p-2">
          <Image
            src={src}
            alt={alt}
            width={600}
            height={600}
            unoptimized={src.startsWith("data:") || src.includes("qrserver.com")}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            className={`max-h-[80vh] w-full rounded-2xl object-contain transition-opacity duration-300 ${effectiveMaxWidth} ${
              isImageLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
