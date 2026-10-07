"use client";

import { Check, PackageSearch, Plus, Search, ShoppingBasket, Store, Trash2 } from "lucide-react";
import { useState } from "react";

import { QuantityStepper } from "@/components/common/quantity-stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";

import { useBasketItemSelection } from "../../../hooks/use-basket-item-selection";
import { useGetBasketCatalogue } from "../../../hooks/use-get-basket-catalogue";
import type { BasketPricingPreview, CatalogueItem } from "../../../types/basket.types";
import { formatItemSize, formatMoney } from "../../../utils/basket-format";
import { DiscountBadge, PriceStack } from "../../shared/price-display";
import { ProductThumb } from "../../shared/product-thumb";
import { StepHeader } from "../step-header";

const PAGE_SIZE = 12;

function StockLabel({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="font-semibold text-rose-600">Out of stock</span>;
  if (stock < 10) return <span className="font-semibold text-amber-600">Only {stock} left</span>;
  return <span>{stock} in stock</span>;
}

function CatalogueCard({
  item,
  symbol,
  quantity,
  onAdd,
  onRemove,
  onQuantity,
}: {
  item: CatalogueItem;
  symbol: string;
  quantity: number | null;
  onAdd: () => void;
  onRemove: () => void;
  onQuantity: (q: number) => void;
}) {
  const isAdded = quantity !== null;
  const size = formatItemSize(item);
  return (
    <li
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-white p-3 transition-all duration-300 dark:bg-slate-900",
        isAdded
          ? "border-primary/60 ring-primary/10 shadow-md ring-2"
          : "border-slate-200/80 hover:border-emerald-200 hover:shadow-md dark:border-slate-800",
      )}
    >
      <div className="relative mb-3">
        <ProductThumb
          src={item.productImageUrl}
          alt={item.productName}
          className="aspect-square h-auto w-full rounded-xl bg-white ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700"
          sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 280px"
          iconClassName="size-10"
        />
        <DiscountBadge percent={item.discountPercent} className="absolute top-2 left-2" />
        {isAdded && (
          <span className="bg-primary animate-in zoom-in absolute top-2 right-2 flex size-7 items-center justify-center rounded-full text-white shadow-md duration-300">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
        )}
      </div>
      <p className="line-clamp-2 min-h-10 text-sm leading-snug font-semibold">{item.productName}</p>
      <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
        {[size, item.category?.categoryName].filter(Boolean).join(" · ") || "—"}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500">
        <StockLabel stock={item.stockQuantity} />
      </p>

      <div className="mt-3 flex items-end justify-between gap-2">
        <PriceStack
          align="left"
          price={item.discountedVendorPrice}
          originalPrice={item.vendorPrice}
          currencySymbol={symbol}
          size="md"
          caption="your price"
        />
        <div className="text-right">
          <p className="text-xs font-bold text-slate-700 tabular-nums dark:text-slate-200">
            {formatMoney(item.customerPrice, symbol)}
          </p>
          <p className="text-[10px] text-slate-400">customer pays</p>
        </div>
      </div>

      <div className="mt-3">
        {isAdded ? (
          <div className="animate-in fade-in zoom-in-95 flex h-9 items-center justify-between gap-2 duration-200">
            <QuantityStepper size="sm" value={quantity} onChange={onQuantity} />
            <button
              type="button"
              onClick={onRemove}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              aria-label={`Remove ${item.productName}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={onAdd}
            className="h-9 w-full rounded-xl text-xs font-semibold transition-transform active:scale-95"
            aria-label={`Add ${item.productName}`}
          >
            <Plus className="size-4" /> Add to basket
          </Button>
        )}
      </div>
    </li>
  );
}

interface ItemsStepProps {
  storeId?: string;
  storeName?: string;
  pricing?: BasketPricingPreview;
}

export function ItemsStep({ storeId, storeName, pricing }: ItemsStepProps) {
  const { items, add, remove, setQuantity, clear } = useBasketItemSelection();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 350);
  const [categoryId, setCategoryId] = useState("ALL");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetBasketCatalogue({
    storeId,
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch.trim() || undefined,
    categoryId: categoryId === "ALL" ? undefined : categoryId,
  });

  const catalogue = data?.data ?? [];
  const categories = data?.categories ?? [];
  const symbol = data?.currencySymbol ?? pricing?.currencySymbol ?? "$";
  const totalPages = data?.pagination.totalPages ?? 1;
  const quantityById = new Map(items.map((i) => [i.itemId, i.quantity]));
  const lineById = new Map(pricing?.lines.map((l) => [l.itemId, l]));

  return (
    <div className="space-y-6">
      <StepHeader
        step={3}
        icon={ShoppingBasket}
        title="Add items to the basket"
        description="Pick items from your store's catalogue. Discounts on items are applied to the basket price automatically."
        action={
          storeName && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Store className="size-3.5" /> {storeName}
            </span>
          )
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 space-y-4">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by item name, UPC or item number"
              className="h-11 rounded-xl pl-10"
            />
          </div>

          {categories.length > 0 && (
            <div className="scrollbar-hide -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {[{ id: "ALL", categoryName: "All items" }, ...categories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCategoryId(c.id);
                    setPage(1);
                  }}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all",
                    categoryId === c.id
                      ? "bg-primary text-white shadow-md shadow-emerald-600/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
                  )}
                >
                  {c.categoryName}
                </button>
              ))}
            </div>
          )}

          <ul
            className={cn(
              "grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-4",
              isFetching && !isLoading && "opacity-60 transition-opacity",
            )}
          >
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <li
                  key={i}
                  className="space-y-2 rounded-2xl border border-slate-100 p-3 dark:border-slate-800"
                >
                  <Skeleton className="aspect-square w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </li>
              ))}
            {catalogue.map((item) => (
              <CatalogueCard
                key={item.id}
                item={item}
                symbol={symbol}
                quantity={quantityById.get(item.id) ?? null}
                onAdd={() => add(item)}
                onRemove={() => remove(item.id)}
                onQuantity={(q) => setQuantity(item.id, q)}
              />
            ))}
          </ul>

          {!isLoading && catalogue.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 px-4 py-14 text-center dark:border-slate-700">
              <PackageSearch className="size-12 text-slate-300" />
              <p className="font-semibold">No items found</p>
              <p className="text-muted-foreground max-w-xs text-sm">
                {debouncedSearch || categoryId !== "ALL"
                  ? "Try a different search or category."
                  : "Your store has no active items yet. Add items in Catalogue Management first."}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Page {page} of {totalPages} · {data?.pagination.total ?? 0} items
              </span>
              <div className="flex gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>

        <aside className="h-fit overflow-hidden rounded-3xl border border-emerald-200/70 bg-linear-to-b from-emerald-50/80 to-white xl:sticky xl:top-24 dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-slate-950">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary relative flex size-9 items-center justify-center rounded-xl text-white">
                <ShoppingBasket className="size-4.5" />
                {items.length > 0 && (
                  <span
                    key={items.length}
                    className="animate-in zoom-in absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold ring-2 ring-white duration-300 dark:ring-slate-950"
                  >
                    {items.length}
                  </span>
                )}
              </span>
              <div>
                <p className="text-sm font-bold">Your basket</p>
                <p className="text-muted-foreground text-[11px]">
                  {items.length} items · {items.reduce((a, i) => a + i.quantity, 0)} units
                </p>
              </div>
            </div>
            {items.length > 0 && (
              <Button
                type="button"
                variant={"ghost"}
                onClick={clear}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Clear all
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 pt-6 pb-10 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-white shadow-inner dark:bg-slate-900">
                <ShoppingBasket className="text-primary/40 size-8" />
              </span>
              <p className="text-sm font-semibold">Your basket is empty</p>
              <p className="text-muted-foreground text-xs">
                Add items from the catalogue to get started.
              </p>
            </div>
          ) : (
            <>
              <ul className="max-h-110 space-y-2 overflow-y-auto px-3 pb-3">
                {[...items].reverse().map(({ itemId, quantity, item }) => {
                  const line = lineById.get(itemId);
                  return (
                    <li
                      key={itemId}
                      className="animate-in fade-in slide-in-from-right-4 flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-xs ring-1 ring-slate-100 duration-300 dark:bg-slate-900 dark:ring-slate-800"
                    >
                      <ProductThumb
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="size-11"
                        sizes="88px"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">{item.productName}</p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold tabular-nums">
                            {line ? formatMoney(line.discountedLineTotal, symbol) : "…"}
                          </span>
                          {line && line.discountPercent > 0 && (
                            <DiscountBadge size="xs" percent={line.discountPercent} />
                          )}
                        </div>
                      </div>
                      <QuantityStepper
                        size="sm"
                        value={quantity}
                        onChange={(q) => setQuantity(itemId, q)}
                      />
                    </li>
                  );
                })}
              </ul>
              <div className="space-y-1.5 border-t border-emerald-100 bg-white/70 px-4 py-3 dark:border-emerald-900/50 dark:bg-slate-950/60">
                {pricing && pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Item discounts</span>
                    <span className="font-semibold text-rose-600 tabular-nums">
                      −{formatMoney(pricing.discountAmount, symbol)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Your subtotal</span>
                  <span className="font-semibold tabular-nums">
                    {formatMoney(pricing?.discountedSubtotal, symbol)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Customer price</span>
                  <PriceStack
                    price={pricing?.customerPrice}
                    originalPrice={pricing?.customerOriginalPrice}
                    currencySymbol={symbol}
                    size="md"
                  />
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
