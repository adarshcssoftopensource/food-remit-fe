"use client";

import {
  Check,
  CheckCheck,
  ChevronsUpDown,
  Layers,
  Loader2,
  PackageSearch,
  Plus,
  Search,
  Store,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { errorToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher } from "@/hooks/useApi";
import { buildUrl } from "@/lib/build-query-string";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";

import { useGetBasketCatalogue } from "../../../hooks/use-get-basket-catalogue";
import type { CatalogueItem, GetCatalogueResponse } from "../../../types/basket.types";
import { formatItemSize, formatMoney } from "../../../utils/basket-format";
import { DiscountBadge } from "../../shared/price-display";
import { ProductThumb } from "../../shared/product-thumb";

const PAGE_SIZE = 20;
const ALL = "ALL";

interface CataloguePanelProps {
  storeId?: string;
  /** Items already in the basket (shown as added, not selectable) */
  addedIds: Set<string>;
  onAdd: (items: CatalogueItem[]) => void;
  className?: string;
}

interface CategoryOption {
  id: string;
  categoryName: string;
}

/** Searchable category filter that stays usable with very long category lists */
function CategoryPicker({
  categories,
  value,
  onChange,
}: {
  categories: CategoryOption[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedName = categories.find((c) => c.id === value)?.categoryName;
  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? categories.filter((c) => c.categoryName.toLowerCase().includes(q)) : categories;
  }, [categories, query]);

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };
  const pick = (id: string) => {
    onChange(id);
    changeOpen(false);
  };
  const optionClass = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
      active
        ? "bg-emerald-50 font-semibold text-primary dark:bg-emerald-950/40"
        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
    );

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center gap-2 rounded-xl border bg-white px-3 text-left text-sm transition-colors sm:w-52 dark:bg-slate-950",
              value === ALL
                ? "border-input text-slate-600 dark:text-slate-300"
                : "border-primary/40 text-primary bg-emerald-50/60 font-semibold dark:bg-emerald-950/30",
            )}
          />
        }
      >
        <Layers className="size-4 shrink-0 opacity-70" />
        <span className="min-w-0 flex-1 truncate">{selectedName ?? "All categories"}</span>
        <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(18rem,calc(100vw-2rem))] gap-0 p-0"
        initialFocus={() => {
          requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
          return false;
        }}
      >
        <div className="border-b border-slate-100 p-2 dark:border-slate-800">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && options[0]) {
                  e.preventDefault();
                  pick(options[0].id);
                }
              }}
              placeholder={`Search ${categories.length} categories`}
              className="h-9 w-full rounded-lg bg-slate-100 pr-2 pl-8 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 dark:bg-slate-800"
            />
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto overscroll-contain p-1.5">
          {!query && (
            <button type="button" onClick={() => pick(ALL)} className={optionClass(value === ALL)}>
              <span className="flex-1">All categories</span>
              {value === ALL && <Check className="size-4" />}
            </button>
          )}
          {options.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => pick(c.id)}
              className={optionClass(value === c.id)}
            >
              <span className="min-w-0 flex-1 truncate">{c.categoryName}</span>
              {value === c.id && <Check className="size-4 shrink-0" />}
            </button>
          ))}
          {options.length === 0 && (
            <p className="text-muted-foreground px-2 py-6 text-center text-sm">
              No category found.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** Fetches every active item of a category from the store catalogue */
async function fetchCategoryItems(storeId: string, categoryId: string) {
  const all: CatalogueItem[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetcher<GetCatalogueResponse>({
      method: "get",
      url: buildUrl(BASKET_ENDPOINTS.CATALOGUE, { storeId, categoryId, page, limit: 100 }),
    });
    all.push(...res.data);
    if (page >= res.pagination.totalPages) break;
  }
  return all;
}

/** Store catalogue with search, category filter and multi-select, shown beside Basket Contents */
export function CataloguePanel({ storeId, addedIds, onAdd, className }: CataloguePanelProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [categoryId, setCategoryId] = useState(ALL);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Map<string, CatalogueItem>>(new Map());
  const [selectingCategory, setSelectingCategory] = useState(false);

  const { data, isLoading, isFetching } = useGetBasketCatalogue({
    storeId,
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    categoryId: categoryId === ALL ? undefined : categoryId,
  });

  const rows = data?.data ?? [];
  const categories = data?.categories ?? [];
  const symbol = data?.currencySymbol ?? "";
  const totalPages = data?.pagination.totalPages ?? 1;
  const selectable = rows.filter((r) => r.isAvailable && !addedIds.has(r.id));
  const pageSelectedCount = selectable.filter((r) => selected.has(r.id)).length;
  const allPageSelected = selectable.length > 0 && pageSelectedCount === selectable.length;
  const categoryName = categories.find((c) => c.id === categoryId)?.categoryName;
  const pendingCount = [...selected.keys()].filter((id) => !addedIds.has(id)).length;

  const toggle = (item: CatalogueItem, checked: boolean) =>
    setSelected((prev) => {
      const next = new Map(prev);
      if (checked) next.set(item.id, item);
      else next.delete(item.id);
      return next;
    });

  const togglePage = (checked: boolean) =>
    setSelected((prev) => {
      const next = new Map(prev);
      for (const item of selectable) {
        if (checked) next.set(item.id, item);
        else next.delete(item.id);
      }
      return next;
    });

  const selectAllInCategory = async () => {
    if (!storeId || categoryId === ALL) return;
    setSelectingCategory(true);
    try {
      const items = await fetchCategoryItems(storeId, categoryId);
      setSelected((prev) => {
        const next = new Map(prev);
        for (const item of items) {
          if (item.isAvailable && !addedIds.has(item.id)) next.set(item.id, item);
        }
        return next;
      });
    } catch {
      errorToast({ description: "Couldn't load all items in this category. Please try again." });
    } finally {
      setSelectingCategory(false);
    }
  };

  const changeCategory = (id: string) => {
    setCategoryId(id);
    setPage(1);
  };

  const addSelected = () => {
    onAdd([...selected.values()].filter((item) => !addedIds.has(item.id)));
    setSelected(new Map());
  };

  return (
    <section
      aria-label="Store items"
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-950",
        className,
      )}
    >
      <header className="space-y-3 border-b border-slate-100 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Store className="size-4" />
            </span>
            Store Items
          </h3>
          <span className="text-muted-foreground text-xs">
            {data ? `${data.pagination.total} items` : ""}
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search items"
              className="h-10 rounded-xl bg-white pl-10 dark:bg-slate-950"
            />
          </div>
          <CategoryPicker categories={categories} value={categoryId} onChange={changeCategory} />
        </div>
        {categoryId !== ALL && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Filtered by</span>
            <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full py-0.5 pr-1 pl-2.5 font-semibold">
              {categoryName}
              <button
                type="button"
                onClick={() => changeCategory(ALL)}
                className="rounded-full p-0.5 hover:bg-emerald-200/60"
                aria-label="Clear category filter"
              >
                <X className="size-3" />
              </button>
            </span>
          </div>
        )}
      </header>

      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-2 text-xs dark:border-slate-800">
        <label className="flex cursor-pointer items-center gap-2 font-medium text-slate-600 dark:text-slate-300">
          <Checkbox
            checked={allPageSelected}
            indeterminate={pageSelectedCount > 0 && !allPageSelected}
            disabled={selectable.length === 0}
            onCheckedChange={(checked) => togglePage(Boolean(checked))}
            aria-label="Select all items on this page"
          />
          Select page
        </label>
        {categoryId !== ALL && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={selectAllInCategory}
            disabled={selectingCategory}
            className="text-primary h-7 rounded-lg text-xs font-semibold"
          >
            {selectingCategory ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCheck className="size-3.5" />
            )}
            Select all in {categoryName}
          </Button>
        )}
      </div>

      <ul
        className={cn(
          "max-h-105 min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto lg:max-h-none dark:divide-slate-800",
          isFetching && !isLoading && "opacity-60 transition-opacity",
        )}
      >
        {isLoading &&
          Array.from({ length: 7 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="size-11 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-4 w-12" />
            </li>
          ))}
        {rows.map((item) => {
          const isAdded = addedIds.has(item.id);
          const disabled = isAdded || !item.isAvailable;
          const checked = selected.has(item.id);
          const size = formatItemSize(item);
          return (
            <li
              key={item.id}
              onClick={() => !disabled && toggle(item, !checked)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 transition-colors sm:gap-3 sm:px-4",
                disabled
                  ? "cursor-default"
                  : "cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
                checked && "bg-emerald-50/80 dark:bg-emerald-950/30",
                !item.isAvailable && "opacity-55",
              )}
            >
              <span onClick={(e) => e.stopPropagation()} className="flex">
                <Checkbox
                  checked={isAdded || checked}
                  disabled={disabled}
                  onCheckedChange={(value) => toggle(item, Boolean(value))}
                  aria-label={`Select ${item.productName}`}
                />
              </span>
              <ProductThumb
                src={item.productImageUrl}
                alt={item.productName}
                className="size-10 shrink-0 rounded-lg sm:size-11"
                sizes="88px"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.productName}
                </p>
                <p className="text-muted-foreground truncate text-[11px]">
                  {item.category?.categoryName ?? "—"}
                  {size ? ` · ${size}` : ""}
                  {!item.isAvailable && " · Unavailable"}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-slate-900 tabular-nums dark:text-white">
                  {formatMoney(item.discountedVendorPrice, symbol)}
                </p>
                {item.discountPercent > 0 && (
                  <p className="flex items-center justify-end gap-1">
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatMoney(item.vendorPrice, symbol)}
                    </span>
                    <DiscountBadge size="xs" percent={item.discountPercent} />
                  </p>
                )}
              </div>
              {isAdded ? (
                <span className="text-primary flex w-16 shrink-0 items-center justify-end gap-1 text-[11px] font-bold">
                  <Check className="size-3.5" strokeWidth={3} /> Added
                </span>
              ) : (
                <button
                  type="button"
                  disabled={!item.isAvailable}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd([item]);
                    toggle(item, false);
                  }}
                  className="text-primary flex w-16 shrink-0 items-center justify-center gap-1 rounded-lg py-1.5 text-[11px] font-bold ring-1 ring-emerald-200 transition-colors hover:bg-emerald-50 disabled:pointer-events-none disabled:opacity-40 dark:ring-emerald-900 dark:hover:bg-emerald-950/40"
                  aria-label={`Add ${item.productName} to basket`}
                >
                  <Plus className="size-3.5" strokeWidth={3} /> Add
                </button>
              )}
            </li>
          );
        })}
        {!isLoading && rows.length === 0 && (
          <li className="flex flex-col items-center gap-2 px-4 py-14 text-center">
            <PackageSearch className="size-12 text-slate-300" />
            <p className="font-semibold">No items found</p>
            <p className="text-muted-foreground max-w-xs text-sm">
              {debouncedSearch || categoryId !== ALL
                ? "Try a different search or category."
                : "Your store has no active items yet. Add items in Product Catalogue first."}
            </p>
          </li>
        )}
      </ul>

      <footer className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/60">
        {totalPages > 1 ? (
          <div className="flex items-center gap-1.5 text-xs">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-lg px-2.5"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span className="text-muted-foreground tabular-nums">
              {page}/{totalPages}
            </span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 rounded-lg px-2.5"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">
            {pendingCount > 0 ? `${pendingCount} selected` : "Tick items to add several at once"}
          </span>
        )}
        <Button
          type="button"
          size="sm"
          className="h-9 rounded-xl px-3.5"
          disabled={pendingCount === 0}
          onClick={addSelected}
        >
          <Plus className="size-4" />
          Add Selected{pendingCount > 0 ? ` (${pendingCount})` : ""}
        </Button>
      </footer>
    </section>
  );
}
