"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, PackageX } from "lucide-react";

interface StockIndicatorProps {
  quantity: number | null | undefined;
  unit?: string | null;
  lowStockThreshold?: number;
  className?: string;
  showBadge?: boolean;
}

export function StockIndicator({
  quantity,
  lowStockThreshold = 5,
  className,
  showBadge = true,
}: StockIndicatorProps) {
  if (quantity === null || quantity === undefined) {
    return <span className="text-sm font-medium text-slate-400">—</span>;
  }

  const qty = Number(quantity);
  const isOutOfStock = qty <= 0;
  const isNormal = qty > lowStockThreshold;

  // 1. Normal Stock (> 5): Keep clean and minimalist without badge
  if (isNormal) {
    return (
      <div className={cn("inline-flex items-baseline", className)}>
        <span className="text-sm font-semibold text-slate-800 tabular-nums dark:text-slate-200">
          {qty.toLocaleString()}
        </span>
      </div>
    );
  }

  // 2. Out of Stock (<= 0)
  if (isOutOfStock) {
    return (
      <div className={cn("flex flex-col gap-1.5 py-0.5", className)}>
        {/* Quantity count + Out of Stock Badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-rose-600 tabular-nums dark:text-rose-400">0</span>

          {showBadge && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/90 bg-gradient-to-r from-rose-50 to-red-50/80 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-700 uppercase shadow-2xs dark:border-rose-500/30 dark:from-rose-950/40 dark:to-red-950/20 dark:text-rose-300">
              <PackageX className="size-3 shrink-0 text-rose-500 dark:text-rose-400" />
              <span>Out of Stock</span>
            </span>
          )}
        </div>

        {/* Micro Stock Progress Track */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-rose-100 dark:bg-rose-950/50">
            <div className="h-full w-0 rounded-full bg-rose-500" />
          </div>
          <span className="text-[10px] font-semibold text-rose-500 dark:text-rose-400">
            0 in stock
          </span>
        </div>
      </div>
    );
  }

  // 3. Low Stock (0 < qty <= 5)
  const percent = Math.min(100, Math.max(15, (qty / lowStockThreshold) * 100));

  return (
    <div className={cn("flex flex-col gap-1.5 py-0.5", className)}>
      {/* Quantity count + Low Stock Badge with animated glowing radar dot */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-amber-700 tabular-nums dark:text-amber-400">
          {qty.toLocaleString()}
        </span>

        {showBadge && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-orange-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-800 uppercase shadow-2xs backdrop-blur-xs dark:border-amber-500/30 dark:from-amber-950/50 dark:to-orange-950/30 dark:text-amber-300">
            <span className="relative flex size-2 shrink-0 items-center justify-center">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
            </span>
            <AlertTriangle className="size-3 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Low Stock</span>
          </span>
        )}
      </div>

      {/* Micro Level Gauge Bar representing stock relative to threshold */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-amber-100/90 dark:bg-amber-950/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-[10px] font-semibold text-amber-700/90 tabular-nums dark:text-amber-400">
          {qty} of {lowStockThreshold} left
        </span>
      </div>
    </div>
  );
}
