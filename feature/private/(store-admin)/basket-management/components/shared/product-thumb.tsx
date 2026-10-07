"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function ProductThumb({
  src,
  alt,
  className,
  sizes = "112px",
  iconClassName,
}: {
  src?: string | null;
  alt: string;
  className?: string;
  /** Rendered width hint for next/image; match the displayed size to keep it sharp */
  sizes?: string;
  iconClassName?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700",
        className,
      )}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={cn(
            "object-contain p-0.5 transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <Package className={cn("size-4 text-slate-300", iconClassName)} />
      )}
    </div>
  );
}
