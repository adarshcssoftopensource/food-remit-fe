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
}

export function ImageLightbox({ src, onClose, alt = "Full size" }: ImageLightboxProps) {
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

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-md"
      style={{ zIndex: 99999, background: "rgba(15,15,20,0.45)" }}
      onClick={onClose}
    >
      <div
        className="relative max-h-[95vh] max-w-[95vw] overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          onClick={onClose}
          variant={"ghost"}
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-md transition-colors transition-transform hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <X className="h-4 w-4" />
        </Button>
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1200}
          className="max-h-[93vh] max-w-[45vw] object-contain"
        />
      </div>
    </div>,
    document.body,
  );
}
