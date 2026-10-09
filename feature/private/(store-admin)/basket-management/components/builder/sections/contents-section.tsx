"use client";

import { AlertTriangle, ArrowLeft, ChevronDown, ShoppingBasket, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { QuantityStepper } from "@/components/common/quantity-stepper";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { useBasketItemSelection } from "../../../hooks/use-basket-item-selection";
import { basketLineKey, type SelectedBasketItem } from "../../../schema/basket-form.schema";
import type { BasketPricingLine, BasketPricingPreview } from "../../../types/basket.types";
import { formatItemSize, formatMoney } from "../../../utils/basket-format";
import { ProductThumb } from "../../shared/product-thumb";
import { SectionCard } from "../section-card";
import { CataloguePanel } from "./catalogue-panel";

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Unit prices from the server pricing, falling back to catalogue prices captured on add */
function unitPrices(entry: SelectedBasketItem, line?: BasketPricingLine) {
  const { item } = entry;
  const vendorRegular = line?.vendorUnitPrice ?? item.vendorPrice ?? 0;
  const vendor = line?.discountedUnitPrice ?? item.discountedVendorPrice ?? vendorRegular;
  const customer = line?.customerUnitPrice ?? item.customerPrice ?? vendor;
  return {
    vendorRegular,
    vendor,
    markup: line?.markupUnitAmount ?? round2(customer - vendor),
    customer,
    isAvailable: line?.isAvailable ?? true,
    unavailableReason: line?.unavailableReason ?? null,
  };
}

/** Switches the line's size in place when the variants are known, otherwise shows the size name */
function LineVariant({
  entry,
  symbol,
  onChange,
}: {
  entry: SelectedBasketItem;
  symbol: string;
  onChange: (variantId: string) => void;
}) {
  const variants = entry.item.variants ?? [];
  const name = entry.optionName ?? entry.item.optionName;
  if (variants.length > 1) {
    return (
      <span className="relative inline-flex max-w-full">
        <select
          value={entry.itemOptionId ?? ""}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`Size of ${entry.item.productName}`}
          className="max-w-full cursor-pointer appearance-none truncate rounded-md border border-violet-200 bg-violet-50 py-0.5 pr-6 pl-2 text-[11px] font-semibold text-violet-700 transition-colors outline-none hover:border-violet-300 focus-visible:ring-2 focus-visible:ring-violet-300 dark:border-violet-900 dark:bg-violet-950/50 dark:text-violet-300"
        >
          {variants.map((v) => (
            <option key={v.id} value={v.id} disabled={!v.isAvailable}>
              {v.optionName} — {formatMoney(v.vendorPrice, symbol)}
              {v.isAvailable ? "" : " (unavailable)"}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-1.5 size-3 -translate-y-1/2 text-violet-600" />
      </span>
    );
  }
  if (!name) return null;
  return (
    <span className="inline-flex max-w-full truncate rounded-md bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
      {name}
    </span>
  );
}

interface ContentsSectionProps {
  storeId?: string;
  pricing?: BasketPricingPreview;
  hasIssue?: boolean;
}

export function ContentsSection({ storeId, pricing, hasIssue }: ContentsSectionProps) {
  const { items, addMany, removeMany, setQuantity, setVariant } = useBasketItemSelection();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const symbol = pricing?.currencySymbol ?? "";
  const markupPercent = pricing?.markupPercent ?? 10;
  const lineByKey = useMemo(
    () => new Map(pricing?.lines.map((l) => [l.lineKey, l])),
    [pricing?.lines],
  );
  const addedKeys = useMemo(() => new Set(items.map(basketLineKey)), [items]);
  const rows = items.map((entry) => {
    const key = basketLineKey(entry);
    const line = lineByKey.get(key);
    const unit = unitPrices(entry, line);
    const vendorLineTotal = line?.discountedLineTotal ?? round2(unit.vendor * entry.quantity);
    const customerLineTotal = line?.customerLineTotal ?? round2(unit.customer * entry.quantity);
    return {
      key,
      entry,
      unit,
      vendorLineTotal,
      customerLineTotal,
      lineTotal: vendorLineTotal,
    };
  });
  const totalUnits = items.reduce((acc, i) => acc + i.quantity, 0);
  const vendorTotal =
    pricing?.itemsVendorTotal ??
    round2(rows.reduce((acc, r) => acc + (r.unit.isAvailable ? r.vendorLineTotal : 0), 0));
  const customerTotal =
    pricing?.customerItemsTotal ??
    round2(rows.reduce((acc, r) => acc + (r.unit.isAvailable ? r.customerLineTotal : 0), 0));
  const checkedIds = [...checked].filter((key) => addedKeys.has(key));
  const allChecked = items.length > 0 && checkedIds.length === items.length;

  const toggle = (id: string, value: boolean) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (value) next.add(id);
      else next.delete(id);
      return next;
    });

  const removeChecked = () => {
    removeMany(checkedIds);
    setChecked(new Set());
  };

  return (
    <SectionCard
      id="contents"
      step={2}
      title="Add Items & Quantities"
      description="Pick items from your store on the left. They appear in Basket Contents on the right, where you set quantities."
      hasIssue={hasIssue}
    >
      <div className="grid gap-4 lg:h-[min(680px,calc(100dvh-220px))] lg:min-h-130 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <CataloguePanel
          storeId={storeId}
          addedKeys={addedKeys}
          className="lg:h-full"
          onAdd={(selected) => {
            const count = addMany(selected);
            if (count) {
              successToast({
                description: `${count} ${count === 1 ? "item" : "items"} added to the basket`,
              });
            }
          }}
        />

        <section
          aria-label="Basket contents"
          className={cn(
            "@container flex flex-col overflow-hidden rounded-2xl border bg-white lg:h-full dark:bg-slate-950",
            hasIssue && !items.length
              ? "border-amber-300 dark:border-amber-800"
              : "border-slate-200/80 dark:border-slate-800",
          )}
        >
          <header className="flex items-center justify-between gap-2 border-b border-slate-100 bg-emerald-50/50 px-4 py-3 dark:border-slate-800 dark:bg-emerald-950/20">
            <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
              <span className="bg-primary flex size-8 items-center justify-center rounded-lg text-white">
                <ShoppingBasket className="size-4" />
              </span>
              Basket Contents
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-bold tabular-nums">
                {items.length}
              </span>
            </h3>
            {items.length > 0 &&
              (checkedIds.length > 0 ? (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={removeChecked}
                  className="animate-in fade-in h-8 cursor-pointer rounded-lg text-rose-600 duration-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  <Trash2 className="size-4" /> Remove {checkedIds.length}
                </Button>
              ) : (
                <label className="hidden cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 @xl:flex dark:text-slate-300">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={(v) =>
                      setChecked(v ? new Set(items.map(basketLineKey)) : new Set())
                    }
                    aria-label="Select all basket items"
                  />
                  Select all
                </label>
              ))}
          </header>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-14 text-center">
              <span className="relative flex size-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                <ShoppingBasket className="text-primary size-9" />
                <span className="bg-primary/20 absolute inset-0 animate-ping rounded-full [animation-duration:2.5s]" />
              </span>
              <div>
                <p className="font-bold">Your basket is empty</p>
                <p className="text-muted-foreground mt-1 max-w-xs text-sm">
                  Tick items in Store Items and press Add Selected, or use the Add button on a row.
                </p>
              </div>
              <p className="text-primary hidden items-center gap-1.5 text-xs font-semibold lg:flex">
                <ArrowLeft className="size-4 animate-pulse" /> Start from the list on the left
              </p>
            </div>
          ) : (
            <>
              <div className="hidden items-center justify-between gap-2 border-b border-slate-100 px-4 py-2 text-[10px] font-bold tracking-wide text-slate-600 uppercase @xl:flex dark:border-slate-800 dark:text-slate-300">
                <span className="truncate">
                  Item · Your price + Markup ({markupPercent}%) = Customer price
                </span>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="w-23 text-center">Qty</span>
                  <span className="w-20 text-right">Line total</span>
                  <span className="w-8" />
                </div>
              </div>
              <ul className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                {rows.map(({ key, entry, unit, vendorLineTotal, customerLineTotal }) => (
                  <li
                    key={key}
                    className={cn(
                      "animate-in fade-in slide-in-from-left-2 flex flex-wrap items-center gap-x-2.5 gap-y-2 px-3 py-3 duration-300 @xl:flex-nowrap @xl:gap-x-3 @xl:px-4",
                      !unit.isAvailable && "bg-amber-50/70 dark:bg-amber-950/20",
                      checked.has(key) && "bg-emerald-50/60 dark:bg-emerald-950/20",
                    )}
                  >
                    <span className="hidden @xl:flex">
                      <Checkbox
                        checked={checked.has(key)}
                        onCheckedChange={(v) => toggle(key, Boolean(v))}
                        aria-label={`Select ${entry.item.productName}`}
                      />
                    </span>
                    <ProductThumb
                      src={entry.item.productImageUrl}
                      alt={entry.item.productName}
                      className="size-11 shrink-0 self-start rounded-xl @xl:size-12 @xl:self-center"
                      sizes="96px"
                    />
                    <div className="min-w-0 flex-1 basis-[calc(100%-3.5rem)] @xl:basis-0">
                      <p className="line-clamp-2 text-sm leading-snug font-semibold text-slate-900 @xl:truncate dark:text-white">
                        {entry.item.productName}
                      </p>
                      <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                        <LineVariant
                          entry={entry}
                          symbol={symbol}
                          onChange={(variantId) => {
                            const variant = entry.item.variants?.find((v) => v.id === variantId);
                            if (variant) setVariant(key, variant);
                          }}
                        />
                        <span className="text-muted-foreground min-w-0 truncate text-[11px]">
                          {entry.item.category?.categoryName ?? "—"}
                          {formatItemSize(entry.item) ? ` · ${formatItemSize(entry.item)}` : ""}
                        </span>
                      </div>
                      {unit.isAvailable ? (
                        <p className="mt-1 flex flex-wrap items-center gap-x-1 text-[11px] tabular-nums">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {formatMoney(unit.vendor, symbol)}
                          </span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            + {formatMoney(unit.markup, symbol)}
                          </span>
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            =
                          </span>
                          <span className="text-primary font-bold">
                            {formatMoney(unit.customer, symbol)}
                          </span>
                        </p>
                      ) : (
                        <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                          <AlertTriangle className="size-3" />
                          {unit.unavailableReason ?? "Unavailable"}
                        </p>
                      )}
                    </div>
                    <div className="flex w-full items-center gap-3 pl-13.5 @xl:w-auto @xl:shrink-0 @xl:pl-0">
                      <div className="flex @xl:w-23 @xl:justify-center">
                        <QuantityStepper
                          size="sm"
                          value={entry.quantity}
                          onChange={(q) => setQuantity(key, q)}
                        />
                      </div>
                      <div className="ml-auto text-right leading-tight @xl:ml-0 @xl:w-20">
                        <span className="block text-sm font-bold text-slate-900 tabular-nums dark:text-white">
                          {formatMoney(vendorLineTotal, symbol)}
                        </span>
                        <span
                          className="text-primary block text-[10px] font-semibold tabular-nums"
                          title={`Customer line total with ${markupPercent}% markup`}
                        >
                          = {formatMoney(customerLineTotal, symbol)}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant={"outline"}
                        onClick={() => removeMany([key])}
                        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                        aria-label={`Remove ${entry.item.productName}`}
                        title="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              {pricing?.hasUnavailableItems && (
                <p className="flex items-center gap-2 border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                  <AlertTriangle className="size-4 shrink-0" />
                  Some items are no longer available. Remove them before publishing.
                </p>
              )}
              <footer className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/80 px-3 py-3 @md:flex-row @md:items-center @md:justify-between @md:gap-3 @xl:px-4 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">{items.length}</strong> items ·{" "}
                  <strong className="text-slate-900 dark:text-white">{totalUnits}</strong> units
                </span>
                <div className="grid grid-cols-2 gap-3 @md:flex @md:items-center @md:gap-4 @md:text-right">
                  <div>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase">
                      Items total (Your price)
                    </span>
                    <span className="text-lg font-black text-slate-900 tabular-nums dark:text-white">
                      {formatMoney(vendorTotal, symbol)}
                    </span>
                  </div>
                  <div className="border-l border-slate-200 pl-3 @md:pl-4 dark:border-slate-700">
                    <span className="text-primary block text-[10px] font-semibold uppercase">
                      Customer total (+{markupPercent}%)
                    </span>
                    <span className="text-primary text-base font-black tabular-nums">
                      {formatMoney(customerTotal, symbol)}
                    </span>
                  </div>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>
    </SectionCard>
  );
}
