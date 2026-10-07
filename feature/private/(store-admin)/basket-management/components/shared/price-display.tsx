import { Tag } from "lucide-react";

import { cn } from "@/lib/utils";

import { formatMoney } from "../../utils/basket-format";

export function DiscountBadge({
  percent,
  size = "sm",
  className,
}: {
  percent: number;
  size?: "xs" | "sm";
  className?: string;
}) {
  if (!percent || percent <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-rose-500 font-bold whitespace-nowrap text-white shadow-sm shadow-rose-500/30",
        size === "xs" ? "px-1.5 py-px text-[9px]" : "px-2 py-0.5 text-[10px]",
        className,
      )}
    >
      <Tag className={size === "xs" ? "size-2.5" : "size-3"} />
      {Number(percent.toFixed(2))}% OFF
    </span>
  );
}

interface PriceStackProps {
  price: number | null | undefined;
  /** Shown struck through when higher than `price` */
  originalPrice?: number | null;
  currencySymbol?: string;
  size?: "sm" | "md" | "lg" | "xl";
  align?: "left" | "right";
  caption?: string;
  className?: string;
}

const PRICE_SIZE = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-3xl",
};

export function PriceStack({
  price,
  originalPrice,
  currencySymbol,
  size = "sm",
  align = "right",
  caption,
  className,
}: PriceStackProps) {
  const hasDiscount =
    originalPrice !== null &&
    originalPrice !== undefined &&
    price !== null &&
    price !== undefined &&
    originalPrice - price > 0.004;
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "right" ? "items-end text-right" : "items-start",
        className,
      )}
    >
      <span
        className={cn(
          "leading-tight font-black tabular-nums",
          PRICE_SIZE[size],
          hasDiscount && "text-rose-600 dark:text-rose-400",
        )}
      >
        {formatMoney(price, currencySymbol)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            "text-slate-400 tabular-nums line-through",
            size === "xl" || size === "lg" ? "text-sm" : "text-[11px]",
          )}
        >
          {formatMoney(originalPrice, currencySymbol)}
        </span>
      )}
      {caption && <span className="text-[10px] text-slate-400">{caption}</span>}
    </div>
  );
}
