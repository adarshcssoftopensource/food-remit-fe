"use client";

import { ScopeBadge } from "@/components/common/scope-badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Barcode, ChevronDown, FolderOpen, Hash, Leaf, Maximize2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ItemData } from "../types/item.types";
import {
  formatPackSize,
  formatPrice,
  getItemCurrencySymbol,
  getItemOptions,
  getItemPriceSummary,
  getItemPrimaryImage,
} from "../utils/item-display";

function ItemThumbnail({
  name,
  image,
  onImageClick,
}: {
  name: string;
  image: string | null;
  onImageClick?: (image: string) => void;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  const src = image && !failed ? image : null;

  return (
    <div className="group bg-primary/5 text-primary relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-700">
      {src ? (
        <>
          <Image
            src={src}
            alt={name}
            width={48}
            height={48}
            unoptimized
            className="size-full object-cover"
            onError={() => setFailed(true)}
          />
          {onImageClick && (
            <button
              type="button"
              onClick={() => onImageClick(src)}
              aria-label={`View ${name} image`}
              className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Maximize2 className="size-4" />
            </button>
          )}
        </>
      ) : (
        <span className="text-sm font-bold">{initials || "?"}</span>
      )}
    </div>
  );
}

export function ItemIdentityCell({
  item,
  onView,
  onImageClick,
}: {
  item: ItemData;
  onView: (item: ItemData) => void;
  onImageClick?: (image: string) => void;
}) {
  return (
    <div className="flex max-w-85 min-w-60 items-center gap-3 py-1">
      <ItemThumbnail
        name={item.productName}
        image={getItemPrimaryImage(item)}
        onImageClick={onImageClick}
      />
      <div className="min-w-0 space-y-1">
        <button
          type="button"
          onClick={() => onView(item)}
          title={item.productName}
          className="hover:text-primary block max-w-full truncate text-left text-sm font-semibold text-slate-900 transition-colors dark:text-white"
        >
          {item.productName}
        </button>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
          {item.itemNumber ? (
            <span
              className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              title="Item number"
            >
              <Hash className="size-3 text-slate-400" />
              {item.itemNumber}
            </span>
          ) : null}
          {/* {item.upcCode ? (
            <span className="inline-flex items-center gap-1 font-mono" title="UPC / barcode">
              <Barcode className="size-3 text-slate-400" />
              {item.upcCode}
            </span>
          ) : null} */}
          {item.isPerishable ? (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Leaf className="size-3" />
              Perishable
            </span>
          ) : null}
          {!item.itemNumber && !item.upcCode && !item.isPerishable ? (
            <span className="text-slate-400">No item number</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ItemCategoryCell({
  item,
  showScope,
  showStore,
}: {
  item: ItemData;
  showScope?: boolean;
  showStore?: boolean;
}) {
  const categoryName = item.category?.categoryName;
  const categoryId = item.category?.id || item.categoryId;
  const storeName = item.storeName || item.store?.storeName;

  return (
    <div className="max-w-[220px] min-w-[140px] space-y-1">
      {categoryName && categoryId ? (
        <Link
          href={ROUTES.ADMIN.CATALOGUE_MANAGEMENT.CATEGORY_WORKSPACE(categoryId)}
          title={`Open ${categoryName}`}
          className="hover:text-primary inline-flex max-w-full items-center gap-1.5 text-sm font-medium text-slate-700 transition-colors dark:text-slate-200"
        >
          <FolderOpen className="size-3.5 shrink-0 text-slate-400" />
          <span className="truncate">{categoryName}</span>
        </Link>
      ) : (
        <span className="text-sm text-slate-400">—</span>
      )}
      {showStore && storeName ? (
        <p className="truncate text-[11px] text-slate-500" title={storeName}>
          {storeName}
        </p>
      ) : null}
      {showScope && (item.scopeLabel || item.isGlobal !== undefined) ? (
        <ScopeBadge isGlobal={item.isGlobal} scopeLabel={item.scopeLabel} />
      ) : null}
    </div>
  );
}

export function ItemPacksPriceCell({ item }: { item: ItemData }) {
  const options = getItemOptions(item);
  const summary = getItemPriceSummary(item);
  const symbol = getItemCurrencySymbol(item);
  const first = options[0];
  const firstSize = first ? formatPackSize(first) : "";

  const content = (
    <div className="min-w-[130px] space-y-1 text-left">
      <p className="text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
        {summary.label}
      </p>
      <p className="flex items-center gap-1 text-[11px] text-slate-500">
        {options.length > 1 ? (
          <>
            <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 font-semibold">
              {options.length} packs
            </span>
            <ChevronDown className="size-3" />
          </>
        ) : (
          <span className="truncate">
            {first?.optionName || "Standard"}
            {firstSize ? ` · ${firstSize}` : ""}
          </span>
        )}
      </p>
    </div>
  );

  if (options.length <= 1) return content;

  return (
    <Popover>
      <PopoverTrigger
        className="hover:bg-muted/60 focus-visible:ring-ring -mx-2 rounded-lg px-2 py-1 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-label={`Show ${options.length} pack options`}
      >
        {content}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" side="bottom" align="start">
        <div className="border-b px-3 py-2">
          <p className="text-sm font-semibold">Pack / size options</p>
          <p className="text-muted-foreground text-xs">{item.productName}</p>
        </div>
        <ul className="max-h-64 divide-y overflow-y-auto">
          {options.map((opt, index) => {
            const size = formatPackSize(opt);
            return (
              <li key={opt.id} className="flex items-center gap-2 px-3 py-2">
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    index === 0
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {index === 0 ? <Star className="size-3 fill-current" /> : index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium" title={opt.optionName}>
                    {opt.optionName}
                  </p>
                  {size ? <p className="text-muted-foreground text-[11px]">{size}</p> : null}
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums">
                  {formatPrice(opt.price, symbol)}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="text-muted-foreground border-t px-3 py-1.5 text-[11px]">
          <Star className="mr-1 inline size-3" />
          Default pack — its price is the item&apos;s base price.
        </p>
      </PopoverContent>
    </Popover>
  );
}
