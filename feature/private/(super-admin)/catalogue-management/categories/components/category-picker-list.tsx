"use client";

import type { VirtualItem, Virtualizer } from "@tanstack/react-virtual";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CategoryPickerItem } from "../hooks/use-category-picker";
import { CategoryRow } from "./category-picker-row";
import {
  PickerEmptyState,
  PickerLoadMoreRow,
  PickerSkeleton,
  PickerState,
} from "./category-picker-states";

interface PickerListContentProps {
  isPending: boolean;
  isError: boolean;
  categories: CategoryPickerItem[];
  debouncedSearch: string;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualRows: VirtualItem[];
  activeIndex: number;
  activeCategoryId?: string;
  onHover: (index: number) => void;
  onSelect: (category: CategoryPickerItem) => void;
  onZoom: (src: string) => void;
  onRetry: () => void;
  onLoadMore: () => void;
}

export function PickerListContent({
  isPending,
  isError,
  categories,
  debouncedSearch,
  virtualizer,
  virtualRows,
  activeIndex,
  activeCategoryId,
  onHover,
  onSelect,
  onZoom,
  onRetry,
  onLoadMore,
}: PickerListContentProps) {
  if (isPending) {
    return <PickerSkeleton />;
  }
  if (isError && !categories.length) {
    return (
      <PickerState
        icon={<AlertCircle className="h-9 w-9 text-rose-400" />}
        title="Couldn't load categories"
        description="Check your connection and try again."
        action={
          <Button variant="outline" size="sm" className="rounded-lg" onClick={onRetry}>
            Try again
          </Button>
        }
      />
    );
  }
  if (!categories.length) {
    return <PickerEmptyState debouncedSearch={debouncedSearch} />;
  }
  return (
    <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
      {virtualRows.map((row) => {
        const category = categories[row.index];
        return (
          <div
            key={row.key}
            className="absolute top-0 left-0 w-full px-1 py-0.5"
            style={{ height: row.size, transform: `translateY(${row.start}px)` }}
          >
            {category ? (
              <CategoryRow
                category={category}
                query={debouncedSearch}
                isActive={row.index === activeIndex}
                isCurrent={category.id === activeCategoryId}
                index={row.index}
                onHover={onHover}
                onSelect={onSelect}
                onZoom={onZoom}
              />
            ) : (
              <PickerLoadMoreRow isError={isError} onRetry={onLoadMore} />
            )}
          </div>
        );
      })}
    </div>
  );
}
