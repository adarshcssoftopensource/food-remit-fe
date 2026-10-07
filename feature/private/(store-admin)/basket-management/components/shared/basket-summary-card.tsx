import { Package, Tag, Users } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { BASKET_TYPE_MAP, formatHouseholdSize } from "../../../../../../constants/basket.constants";
import type { BasketType } from "../../types/basket.types";
import { formatMoney } from "../../utils/basket-format";
import { BasketTypeBadge } from "./basket-badges";
import { BasketImage } from "./basket-image";

interface BasketSummaryCardProps {
  name: string;
  shortDescription?: string | null;
  basketType: BasketType;
  householdSize?: string | null;
  image?: string | null;
  itemCount: number;
  totalUnits?: number;
  price?: number;
  originalPrice?: number;
  currencySymbol?: string;
  badge?: ReactNode;
  layout?: "vertical" | "horizontal";
  className?: string;
}

export function BasketSummaryCard({
  name,
  shortDescription,
  basketType,
  householdSize,
  image,
  itemCount,
  totalUnits,
  price,
  originalPrice,
  currencySymbol,
  badge,
  layout = "vertical",
  className,
}: BasketSummaryCardProps) {
  const horizontal = layout === "horizontal";
  const hasDiscount =
    originalPrice !== undefined && price !== undefined && originalPrice - price > 0.004;
  const stats = [
    {
      icon: Users,
      label: "Serves",
      value: householdSize ? formatHouseholdSize(householdSize) : "—",
    },
    {
      icon: Package,
      label: "Items",
      value: `${itemCount}${totalUnits !== undefined ? ` (${totalUnits} units)` : ""}`,
    },
    {
      icon: Tag,
      label: "Customer price",
      value: (
        <span className="inline-flex items-baseline gap-1.5">
          <span className={hasDiscount ? "text-rose-600 dark:text-rose-400" : undefined}>
            {formatMoney(price, currencySymbol)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] font-medium text-slate-400 line-through">
              {formatMoney(originalPrice, currencySymbol)}
            </span>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className={cn("flex gap-4", horizontal ? "flex-col sm:flex-row" : "flex-col", className)}>
      <div className="relative shrink-0">
        <BasketImage
          image={image}
          basketType={basketType}
          alt={name || "Basket"}
          className={cn(
            "rounded-xl",
            horizontal ? "aspect-4/3 w-full sm:w-64" : "aspect-4/3 w-full",
          )}
        />
        {badge && <div className="absolute top-2.5 left-2.5">{badge}</div>}
        {hasDiscount && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            Save {formatMoney(originalPrice - price, currencySymbol)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="space-y-1.5">
          <BasketTypeBadge type={basketType} />
          <h3 className="text-xl leading-tight font-bold tracking-tight wrap-break-word">
            {name || "Untitled basket"}
          </h3>
          <p className="text-primary text-sm font-semibold">
            {householdSize
              ? `For ${formatHouseholdSize(householdSize)}`
              : BASKET_TYPE_MAP[basketType].tagline}
          </p>
          {shortDescription && <p className="text-muted-foreground text-sm">{shortDescription}</p>}
        </div>
        <dl className="grid gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
                <stat.icon className="size-4" />
              </span>
              <div>
                <dt className="text-muted-foreground text-[11px]">{stat.label}</dt>
                <dd className="text-sm font-bold tabular-nums">{stat.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
