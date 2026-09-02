"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/button";

interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
  alt?: string;
  maxWidthClass?: string;
}

export function ImageLightbox({
  src,
  onClose,
  alt = "Full size",
  maxWidthClass,
}: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);

    // Lock body scroll when open
    if (src) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "unset";
    };
  }, [src]);

  if (!src || !mounted || typeof document === "undefined") {
    return null;
  }

  const isQrCode =
    src.includes("qrserver.com") ||
    src.toLowerCase().includes("qr") ||
    src.startsWith("data:image");

  const effectiveMaxWidth =
    maxWidthClass || (isQrCode ? "max-w-[260px] sm:max-w-[300px]" : "max-w-[45vw]");

  return createPortal(
    <button
      type="button"
      aria-label="Close lightbox"
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ zIndex: 99999, background: "rgba(15,15,20,0.55)" }}
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-3xl bg-white/95 p-3 shadow-2xl backdrop-blur-xl dark:bg-slate-900/95"
        style={{
          border: "1px solid rgba(255,255,255,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          variant={"ghost"}
          className="absolute top-2.5 right-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full text-slate-600 backdrop-blur-md transition-transform hover:scale-110 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-center p-2">
          <Image
            src={src}
            alt={alt}
            width={600}
            height={600}
            className={`max-h-[80vh] w-full rounded-2xl object-contain ${effectiveMaxWidth}`}
          />
        </div>
      </div>
    </button>,
    document.body,
  );
}
