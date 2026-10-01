"use client";

import { Check, ChevronRight, FolderOpen, ZoomIn } from "lucide-react";
import Image from "next/image";
import { memo } from "react";

import { cn } from "@/lib/utils";
import type { CategoryPickerItem } from "../hooks/use-category-picker";

export function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const start = text.toLowerCase().indexOf(query.toLowerCase());
  if (start < 0) return <>{text}</>;
  const end = start + query.length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="text-primary rounded-sm bg-transparent font-bold">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  );
}

export const CategoryRow = memo(function CategoryRow({
  category,
  query,
  isActive,
  isCurrent,
  index,
  onHover,
  onSelect,
  onZoom,
}: {
  category: CategoryPickerItem;
  query: string;
  isActive: boolean;
  isCurrent: boolean;
  index: number;
  onHover: (index: number) => void;
  onSelect: (category: CategoryPickerItem) => void;
  onZoom: (src: string) => void;
}) {
  const handleMouseMove = isActive ? undefined : () => onHover(index);

  return (
    <div className="relative h-full w-full">
      <button
        type="button"
        id={`category-option-${category.id}`}
        role="option"
        aria-selected={isActive}
        onMouseMove={handleMouseMove}
        onClick={() => onSelect(category)}
        className={cn(
          "flex h-full w-full items-center gap-3 rounded-xl px-3 text-left transition-colors",
          isActive
            ? "bg-primary/8"
            : "hover:bg-slate-50 has-[~button:hover]:bg-slate-50 dark:hover:bg-slate-900 dark:has-[~button:hover]:bg-slate-900",
        )}
      >
        <div className="bg-primary/10 text-primary relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          {category.categoryIconUrl ? (
            <Image
              src={category.categoryIconUrl}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          ) : (
            <FolderOpen className="h-4 w-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            <Highlight text={category.categoryName} query={query} />
          </p>
          <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
            <span>
              {category.itemCount.toLocaleString()} {category.itemCount === 1 ? "item" : "items"}
            </span>
            {category.storeName && (
              <>
                <span className="text-slate-300">·</span>
                <span className="truncate">{category.storeName}</span>
              </>
            )}
            {category.status === "INACTIVE" && (
              <span className="rounded-md bg-rose-50 px-1.5 py-px text-[10px] font-semibold text-rose-600 dark:bg-rose-950/40">
                Inactive
              </span>
            )}
          </p>
        </div>
        {isCurrent ? (
          <span className="text-primary inline-flex shrink-0 items-center gap-1 text-xs font-semibold">
            <Check className="h-4 w-4" />
            Current
          </span>
        ) : (
          <ChevronRight
            className={cn(
              "h-4 w-4 shrink-0 transition",
              isActive ? "text-primary translate-x-0.5" : "text-slate-300",
            )}
          />
        )}
      </button>
      {category.categoryIconUrl && (
        <button
          type="button"
          aria-label="View full image"
          onMouseMove={handleMouseMove}
          onClick={() => onZoom(category.categoryIconUrl!)}
          className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-black/0 opacity-0 transition duration-200 hover:bg-black/40 hover:opacity-100"
        >
          <ZoomIn className="h-4 w-4 text-white drop-shadow-md" />
        </button>
      )}
    </div>
  );
});
