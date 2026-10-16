"use client";

import { Coins, FolderOpen, MapPin, Package } from "lucide-react";
import Image from "next/image";
import type { WorkspaceCategory } from "../hooks/use-category-workspace";
import type { ActiveCategory } from "../types/category.types";

interface WorkspaceCategoryIdentityProps {
  category: WorkspaceCategory;
  icon: ActiveCategory["categoryIcon"];
  totalItems: number;
  onZoom: (src: string) => void;
}

export function WorkspaceCategoryIdentity({
  category,
  icon,
  totalItems,
  onZoom,
}: WorkspaceCategoryIdentityProps) {
  const scopeText = category.store?.storeName || category.cityName || null;

  return (
    <div className="flex items-center gap-4 sm:gap-5">
      <div className="ring-primary/15 relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-4 sm:h-24 sm:w-24 dark:bg-slate-950">
        {icon ? (
          <button
            type="button"
            onClick={() => onZoom(icon)}
            className="absolute inset-0 cursor-pointer"
            title="View image"
          >
            <Image
              src={icon}
              alt={category.categoryName}
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ) : (
          <FolderOpen className="text-primary h-9 w-9" />
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <p className="text-primary flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
            <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
          </span>
          Working in category
        </p>
        <h1 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
          {category.categoryName}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={
              category.status === "ACTIVE"
                ? "rounded-full bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400"
                : "rounded-full bg-rose-500/10 px-2.5 py-1 font-semibold text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-400"
            }
          >
            {category.status === "ACTIVE" ? "Active" : "Inactive"}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <Package className="h-3.5 w-3.5" />
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
          {scopeText && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <MapPin className="h-3.5 w-3.5" />
              {scopeText}
            </span>
          )}
          {category.currencySymbol && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Coins className="h-3.5 w-3.5" />
              Prices in {category.currency || category.currencySymbol}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
