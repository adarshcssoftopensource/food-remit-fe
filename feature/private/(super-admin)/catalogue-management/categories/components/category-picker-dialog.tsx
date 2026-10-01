"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { FolderSearch, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDebounce } from "@/lib/debounce";
import { type CategoryPickerItem, useCategoryPicker } from "../hooks/use-category-picker";
import { PickerListContent } from "./category-picker-list";
import { PickerSearchInput } from "./category-picker-search";
import { PickerFooter } from "./category-picker-states";

export { CategoryRow, Highlight } from "./category-picker-row";
export {
  Kbd,
  PickerEmptyState,
  PickerFooter,
  PickerLoadMoreRow,
  PickerSkeleton,
  PickerState,
} from "./category-picker-states";
export { PickerSearchInput } from "./category-picker-search";
export { PickerListContent } from "./category-picker-list";

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 250);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
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
      <PickerSearchInput
        inputRef={searchInputRef}
        search={search}
        onSearchChange={setSearch}
        onKeyDown={onKeyDown}
        activeOptionId={activeOptionId}
        isSearching={isSearching}
      />

      <div className="border-t border-slate-100 dark:border-slate-800" />

      <div
        ref={scrollRef}
        id="category-picker-list"
        role="listbox"
        aria-label="Categories"
        className="min-h-60 flex-1 overflow-y-auto overscroll-contain px-2 py-2"
      >
        <PickerListContent
          isPending={isPending}
          isError={isError}
          categories={categories}
          debouncedSearch={debouncedSearch}
          virtualizer={virtualizer}
          virtualRows={virtualRows}
          activeIndex={activeIndex}
          activeCategoryId={activeCategoryId}
          onHover={setActiveIndex}
          onSelect={onSelect}
          onZoom={setLightboxSrc}
          onRetry={() => refetch()}
          onLoadMore={() => fetchNextPage()}
        />
      </div>

      <ImageLightbox src={lightboxSrc} alt="Category image" onClose={() => setLightboxSrc(null)} />

      <PickerFooter count={categories.length} hasNextPage={hasNextPage} />
    </>
  );
}
