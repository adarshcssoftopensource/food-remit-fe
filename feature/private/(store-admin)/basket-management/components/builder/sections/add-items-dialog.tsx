"use client";

import { CheckCheck, Loader2, PackageSearch, Plus, Search } from "lucide-react";
import { useState } from "react";

import { errorToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface AddItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeId?: string;
  /** Items already in the basket (shown as added, not selectable) */
  addedIds: Set<string>;
  onAdd: (items: CatalogueItem[]) => void;
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

export function AddItemsDialog({
  open,
  onOpenChange,
  storeId,
  addedIds,
  onAdd,
}: AddItemsDialogProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [categoryId, setCategoryId] = useState(ALL);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Map<string, CatalogueItem>>(new Map());
  const [selectingCategory, setSelectingCategory] = useState(false);

  const { data, isLoading, isFetching } = useGetBasketCatalogue({
    storeId: open ? storeId : undefined,
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

  const reset = () => {
    setSearch("");
    setCategoryId(ALL);
    setPage(1);
    setSelected(new Map());
  };

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) reset();
  };

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

  const confirm = () => {
    onAdd([...selected.values()]);
    close(false);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="flex max-h-[92vh] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="border-b border-slate-100 px-5 pt-5 pb-4 dark:border-slate-800">
          <DialogTitle className="text-lg font-bold">Choose Items to Add</DialogTitle>
          <DialogDescription>
            Select items from your store&apos;s catalogue. You can set quantities after adding them.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search items by name, UPC or item number"
                className="h-10 rounded-xl pl-10"
                autoFocus
              />
            </div>
            <Select value={categoryId} onValueChange={(v) => changeCategory(v ?? ALL)}>
              <SelectTrigger className="h-10 w-full rounded-xl sm:w-56">
                <SelectValue>{categoryName ?? "All Categories"}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {categories.length > 0 && (
            <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1">
              {[{ id: ALL, categoryName: "All" }, ...categories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => changeCategory(c.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all",
                    categoryId === c.id
                      ? "bg-primary text-white shadow-sm shadow-emerald-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
                  )}
                >
                  {c.categoryName}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {categoryId !== ALL && (
            <div className="flex items-center justify-between gap-2 bg-emerald-50/60 px-5 py-2 text-xs dark:bg-emerald-950/20">
              <span className="text-slate-600 dark:text-slate-300">
                Showing <strong>{categoryName}</strong> · {data?.pagination.total ?? 0} items
              </span>
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
                Select All in Category
              </Button>
            </div>
          )}

          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:bg-slate-900">
              <tr>
                <th className="w-12 px-5 py-2.5 text-left">
                  <Checkbox
                    checked={allPageSelected}
                    indeterminate={pageSelectedCount > 0 && !allPageSelected}
                    disabled={selectable.length === 0}
                    onCheckedChange={(checked) => togglePage(Boolean(checked))}
                    aria-label="Select all items on this page"
                  />
                </th>
                <th className="w-16 py-2.5 text-left">Image</th>
                <th className="py-2.5 text-left">Product Name</th>
                <th className="hidden py-2.5 text-left sm:table-cell">Category</th>
                <th className="px-5 py-2.5 text-right">Price</th>
              </tr>
            </thead>
            <tbody
              className={cn(
                "divide-y divide-slate-100 dark:divide-slate-800",
                isFetching && !isLoading && "opacity-60 transition-opacity",
              )}
            >
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3" colSpan={5}>
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </td>
                  </tr>
                ))}
              {rows.map((item) => {
                const isAdded = addedIds.has(item.id);
                const disabled = isAdded || !item.isAvailable;
                const checked = isAdded || selected.has(item.id);
                const size = formatItemSize(item);
                return (
                  <tr
                    key={item.id}
                    onClick={() => !disabled && toggle(item, !checked)}
                    className={cn(
                      "transition-colors",
                      disabled
                        ? "cursor-not-allowed opacity-60"
                        : "cursor-pointer hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20",
                      checked && !isAdded && "bg-emerald-50/70 dark:bg-emerald-950/30",
                    )}
                  >
                    <td className="px-5 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onCheckedChange={(value) => toggle(item, Boolean(value))}
                        aria-label={`Select ${item.productName}`}
                      />
                    </td>
                    <td className="py-2.5">
                      <ProductThumb
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="size-11 rounded-lg"
                        sizes="88px"
                      />
                    </td>
                    <td className="py-2.5 pr-3">
                      <p className="line-clamp-2 font-semibold text-slate-900 dark:text-white">
                        {item.productName}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {isAdded
                          ? "Already in basket"
                          : !item.isAvailable
                            ? "Unavailable"
                            : size || "\u00A0"}
                        <span className="sm:hidden">
                          {item.category ? ` · ${item.category.categoryName}` : ""}
                        </span>
                      </p>
                    </td>
                    <td className="hidden py-2.5 text-slate-600 sm:table-cell dark:text-slate-300">
                      {item.category?.categoryName ?? "—"}
                    </td>
                    <td className="px-5 py-2.5 text-right whitespace-nowrap">
                      <p className="font-bold text-slate-900 tabular-nums dark:text-white">
                        {formatMoney(item.discountedVendorPrice, symbol)}
                      </p>
                      {item.discountPercent > 0 && (
                        <p className="flex items-center justify-end gap-1">
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatMoney(item.vendorPrice, symbol)}
                          </span>
                          <DiscountBadge size="xs" percent={item.discountPercent} />
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!isLoading && rows.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
              <PackageSearch className="size-12 text-slate-300" />
              <p className="font-semibold">No items found</p>
              <p className="text-muted-foreground max-w-xs text-sm">
                {debouncedSearch || categoryId !== ALL
                  ? "Try a different search or category."
                  : "Your store has no active items yet. Add items in Product Catalogue first."}
              </p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-2 text-xs dark:border-slate-800">
            <span className="text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1.5">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 rounded-lg"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 rounded-lg"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="flex-row items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-5 py-3 sm:justify-between dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-sm">
            <span
              key={selected.size}
              className="animate-in zoom-in text-primary inline-block font-black tabular-nums duration-200"
            >
              {selected.size}
            </span>{" "}
            <span className="text-muted-foreground">
              {selected.size === 1 ? "item" : "items"} selected
            </span>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setSelected(new Map())}
                className="ml-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
              >
                Clear
              </button>
            )}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => close(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="h-10 rounded-xl px-4"
              disabled={selected.size === 0}
              onClick={confirm}
            >
              <Plus className="size-4" />
              Add Selected Items
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
