"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import {
  AlertCircle,
  Check,
  ChevronRight,
  CornerDownLeft,
  FolderOpen,
  FolderSearch,
  Loader2,
  Search,
  X,
} from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";
import { type CategoryPickerItem, useCategoryPicker } from "../hooks/use-category-picker";

interface CategoryPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: CategoryPickerItem) => void;
  activeCategoryId?: string;
  title?: string;
  description?: string;
}

const ROW_HEIGHT = 64;
const LOAD_MORE_THRESHOLD = 8;

export function CategoryPickerDialog({
  open,
  onOpenChange,
  title = "Select a category",
  description = "Items are created inside a category. Pick the category you want to work in.",
  ...props
}: CategoryPickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(640px,calc(100vh-2rem))] w-[calc(100%-1rem)] max-w-xl flex-col gap-0 overflow-hidden rounded-2xl p-0"
      >
        <DialogHeader className="flex-row items-start gap-3 space-y-0 px-5 pt-5 pb-4 text-left">
          <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <FolderSearch className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-sm leading-5 text-slate-500">
              {description}
            </DialogDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="-mt-1 -mr-2 h-8 w-8 shrink-0 rounded-lg text-slate-400"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        {/* Mounted only while open, so search and scroll reset on every open */}
        {open && <CategoryPickerBody {...props} />}
      </DialogContent>
    </Dialog>
  );
}

function CategoryPickerBody({
  onSelect,
  activeCategoryId,
}: Pick<CategoryPickerDialogProps, "onSelect" | "activeCategoryId">) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 250);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (prevSearch !== debouncedSearch) {
    setPrevSearch(debouncedSearch);
    setActiveIndex(0);
  }

  const {
    data,
    isPending,
    isFetching,
    isError,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCategoryPicker(debouncedSearch, true);

  const categories = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const isSearching =
    search.trim() !== debouncedSearch || (isFetching && !isFetchingNextPage && !isPending);

  const scrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: categories.length + (hasNextPage ? 1 : 0),
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 6,
  });
  const virtualRows = virtualizer.getVirtualItems();
  const lastVisibleIndex = virtualRows[virtualRows.length - 1]?.index ?? -1;

  useEffect(() => {
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      !isError &&
      lastVisibleIndex >= categories.length - LOAD_MORE_THRESHOLD
    ) {
      void fetchNextPage();
    }
  }, [
    lastVisibleIndex,
    categories.length,
    hasNextPage,
    isFetchingNextPage,
    isError,
    fetchNextPage,
  ]);

  const moveTo = (index: number) => {
    if (!categories.length) return;
    const next = Math.max(0, Math.min(categories.length - 1, index));
    setActiveIndex(next);
    virtualizer.scrollToIndex(next, { align: "auto" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const pageStep = Math.max(1, Math.floor((scrollRef.current?.clientHeight ?? 320) / ROW_HEIGHT));
    const keys: Record<string, () => void> = {
      ArrowDown: () => moveTo(activeIndex + 1),
      ArrowUp: () => moveTo(activeIndex - 1),
      PageDown: () => moveTo(activeIndex + pageStep),
      PageUp: () => moveTo(activeIndex - pageStep),
      Enter: () => categories[activeIndex] && onSelect(categories[activeIndex]),
    };
    const action = keys[e.key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  const activeOptionId = categories[activeIndex]
    ? `category-option-${categories[activeIndex].id}`
    : undefined;

  return (
    <>
      <div className="px-5 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search categories by name…"
            autoFocus
            role="combobox"
            aria-expanded
            aria-controls="category-picker-list"
            aria-activedescendant={activeOptionId}
            aria-autocomplete="list"
            maxLength={100}
            className="focus:border-primary focus:ring-primary/15 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-11 pl-10 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:bg-white focus:ring-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center">
            {isSearching ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin text-slate-400" />
            ) : search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800" />

      <div
        ref={scrollRef}
        id="category-picker-list"
        role="listbox"
        aria-label="Categories"
        className="min-h-60 flex-1 overflow-y-auto overscroll-contain px-2 py-2"
      >
        {isPending ? (
          <PickerSkeleton />
        ) : isError && !categories.length ? (
          <PickerState
            icon={<AlertCircle className="h-9 w-9 text-rose-400" />}
            title="Couldn't load categories"
            description="Check your connection and try again."
            action={
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : !categories.length ? (
          <PickerState
            icon={<FolderOpen className="h-9 w-9 text-slate-300" />}
            title={
              debouncedSearch ? `No categories match "${debouncedSearch}"` : "No categories yet"
            }
            description={
              debouncedSearch
                ? "Check the spelling or try a shorter search."
                : "Create a category first, then add items to it."
            }
          />
        ) : (
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
                      onHover={setActiveIndex}
                      onSelect={onSelect}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center gap-2 text-xs text-slate-400">
                      {isError ? (
                        <button
                          type="button"
                          onClick={() => fetchNextPage()}
                          className="text-primary font-semibold hover:underline"
                        >
                          Couldn&apos;t load more — retry
                        </button>
                      ) : (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Loading more…
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-2.5 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
        <span>
          {categories.length > 0
            ? `${categories.length.toLocaleString()}${hasNextPage ? "+" : ""} ${categories.length === 1 ? "category" : "categories"}`
            : "\u00a0"}
        </span>
        <span className="hidden items-center gap-3 sm:flex">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> to move
          </span>
          <span className="flex items-center gap-1">
            <Kbd>
              <CornerDownLeft className="h-3 w-3" />
            </Kbd>
            to select
          </span>
          <span className="flex items-center gap-1">
            <Kbd>Esc</Kbd> to close
          </span>
        </span>
      </div>
    </>
  );
}

const CategoryRow = memo(function CategoryRow({
  category,
  query,
  isActive,
  isCurrent,
  index,
  onHover,
  onSelect,
}: {
  category: CategoryPickerItem;
  query: string;
  isActive: boolean;
  isCurrent: boolean;
  index: number;
  onHover: (index: number) => void;
  onSelect: (category: CategoryPickerItem) => void;
}) {
  return (
    <button
      type="button"
      id={`category-option-${category.id}`}
      role="option"
      aria-selected={isActive}
      onMouseMove={isActive ? undefined : () => onHover(index)}
      onClick={() => onSelect(category)}
      className={cn(
        "flex h-full w-full items-center gap-3 rounded-xl px-3 text-left transition-colors",
        isActive ? "bg-primary/8" : "hover:bg-slate-50 dark:hover:bg-slate-900",
      )}
    >
      <div className="bg-primary/10 text-primary relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
        {category.categoryIconUrl ? (
          <Image src={category.categoryIconUrl} alt="" fill sizes="40px" className="object-cover" />
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
  );
});

function Highlight({ text, query }: { text: string; query: string }) {
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

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-slate-200 bg-white px-1 font-sans text-[10px] font-semibold text-slate-500 shadow-xs dark:border-slate-700 dark:bg-slate-800">
      {children}
    </kbd>
  );
}

function PickerSkeleton() {
  return (
    <div className="space-y-1 px-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex h-15 items-center gap-3 rounded-xl px-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-2/5 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-2.5 w-1/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PickerState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-56 flex-col items-center justify-center gap-2 px-6 text-center">
      {icon}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
      <p className="max-w-xs text-xs text-slate-500">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
