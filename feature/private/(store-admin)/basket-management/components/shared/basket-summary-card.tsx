import { ImageIcon, LayoutTemplate, Package, Plus, Tag, Users } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import {
  BASKET_LIBRARY_IMAGES,
  BASKET_TYPE_MAP,
  formatHouseholdSize,
  getTemplateImage,
} from "../../../../../../constants/basket.constants";
import type { BasketType } from "../../types/basket.types";
import { formatMoney } from "../../utils/basket-format";
import { BasketImage } from "./basket-image";

interface BasketSummaryCardProps {
  name: string;
  shortDescription?: string | null;
  basketType: BasketType;
  householdSize?: string | null;
  image?: string | null;
  libraryImage?: string | null;
  itemCount: number;
  totalUnits?: number;
  price?: number;
  originalPrice?: number;
  currencySymbol?: string;
  badge?: ReactNode;
  layout?: "vertical" | "horizontal";
  className?: string;
}

/** Where the basket image comes from: an upload, a library pick, or the template default */
export function imageSourceLabel(image?: string | null, libraryImage?: string | null) {
  if (image) return "Uploaded";
  const library = BASKET_LIBRARY_IMAGES.find((l) => l.key === libraryImage);
  return library ? `Library · ${library.label}` : "Template default";
}

/** The template picked in step 1, kept apart from the basket image picked in step 5 */
function TemplateTile({
  basketType,
  householdSize,
}: {
  basketType: BasketType;
  householdSize?: string | null;
}) {
  const template = BASKET_TYPE_MAP[basketType];
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2 dark:border-slate-800 dark:bg-slate-900/50">
      <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-emerald-50 dark:bg-emerald-950/40">
        {basketType === "CUSTOM" ? (
          <Plus className="size-6 text-emerald-600" strokeWidth={2.5} />
        ) : (
          <Image
            src={getTemplateImage(basketType)}
            alt={template.label}
            fill
            sizes="56px"
            className="object-cover"
          />
        )}
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1 text-[10px] font-bold tracking-wide text-slate-500 uppercase">
          <LayoutTemplate className="size-3" /> Template
        </p>
        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
          {template.label}
        </p>
        <p className="text-primary text-xs font-semibold">
          {householdSize ? `For ${formatHouseholdSize(householdSize)}` : template.tagline}
        </p>
      </div>
    </div>
  );
}

export function BasketSummaryCard({
  name,
  shortDescription,
  basketType,
  householdSize,
  image,
  libraryImage,
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
          libraryImage={libraryImage}
          basketType={basketType}
          alt={name || "Basket"}
          className={cn(
            "rounded-xl",
            horizontal ? "aspect-4/3 w-full sm:w-64" : "aspect-4/3 w-full",
          )}
        />
        {badge && <div className="absolute top-2.5 left-2.5">{badge}</div>}
        <span className="absolute bottom-2.5 left-2.5 inline-flex max-w-[calc(100%-1.25rem)] items-center gap-1 truncate rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
          <ImageIcon className="size-3 shrink-0" />
          Basket image · {imageSourceLabel(image, libraryImage)}
        </span>
        {hasDiscount && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            Save {formatMoney(originalPrice - price, currencySymbol)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="space-y-1.5">
          <h3 className="text-xl leading-tight font-bold tracking-tight wrap-break-word">
            {name || "Untitled basket"}
          </h3>
          {shortDescription && <p className="text-muted-foreground text-sm">{shortDescription}</p>}
        </div>
        <TemplateTile basketType={basketType} householdSize={householdSize} />
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
