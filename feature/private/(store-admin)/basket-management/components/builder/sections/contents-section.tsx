"use client";

import { AlertTriangle, ArrowLeft, ShoppingBasket, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { QuantityStepper } from "@/components/common/quantity-stepper";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { useBasketItemSelection } from "../../../hooks/use-basket-item-selection";
import type { SelectedBasketItem } from "../../../schema/basket-form.schema";
import type { BasketPricingLine, BasketPricingPreview } from "../../../types/basket.types";
import { formatItemSize, formatMoney } from "../../../utils/basket-format";
import { DiscountBadge } from "../../shared/price-display";
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
    discountPercent: line?.discountPercent ?? item.discountPercent ?? 0,
    markup: line?.markupUnitAmount ?? round2(customer - vendor),
    customer,
    isAvailable: line?.isAvailable ?? true,
    unavailableReason: line?.unavailableReason ?? null,
  };
}

interface ContentsSectionProps {
  storeId?: string;
  pricing?: BasketPricingPreview;
  hasIssue?: boolean;
}

export function ContentsSection({ storeId, pricing, hasIssue }: ContentsSectionProps) {
  const { items, addMany, removeMany, setQuantity } = useBasketItemSelection();
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const symbol = pricing?.currencySymbol ?? "";
  const markupPercent = pricing?.markupPercent ?? 10;
  const lineById = useMemo(
    () => new Map(pricing?.lines.map((l) => [l.itemId, l])),
    [pricing?.lines],
  );
  const addedIds = useMemo(() => new Set(items.map((i) => i.itemId)), [items]);
  const rows = items.map((entry) => {
    const unit = unitPrices(entry, lineById.get(entry.itemId));
    return { entry, unit, lineTotal: round2(unit.customer * entry.quantity) };
  });
  const totalUnits = items.reduce((acc, i) => acc + i.quantity, 0);
  const total = round2(rows.reduce((acc, r) => acc + (r.unit.isAvailable ? r.lineTotal : 0), 0));
  const checkedIds = [...checked].filter((id) => addedIds.has(id));
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
          addedIds={addedIds}
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
            "flex flex-col overflow-hidden rounded-2xl border bg-white lg:h-full dark:bg-slate-950",
            hasIssue && !items.length
              ? "border-amber-300 dark:border-amber-800"
              : "border-slate-200/80 dark:border-slate-800",
          )}
        >
          <header className="flex items-center justify-between gap-2 border-b border-slate-100 bg-emerald-50/50 px-4 py-3 dark:border-slate-800 dark:bg-emerald-950/20">
            <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
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
                  className="animate-in fade-in h-8 rounded-lg text-rose-600 duration-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  <Trash2 className="size-4" /> Remove {checkedIds.length}
                </Button>
              ) : (
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={(v) =>
                      setChecked(v ? new Set(items.map((i) => i.itemId)) : new Set())
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
              <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-slate-100 px-4 py-1.5 text-[10px] font-semibold tracking-wide text-slate-500 uppercase dark:border-slate-800">
                <span className="truncate">
                  Item · Your price + Markup ({markupPercent}%) = Customer price
                </span>
                <span>Qty · Line total</span>
              </div>
              <ul className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                {rows.map(({ entry, unit, lineTotal }) => (
                  <li
                    key={entry.itemId}
                    className={cn(
                      "animate-in fade-in slide-in-from-left-2 flex items-center gap-2.5 px-3 py-3 duration-300 sm:gap-3 sm:px-4",
                      !unit.isAvailable && "bg-amber-50/70 dark:bg-amber-950/20",
                      checked.has(entry.itemId) && "bg-emerald-50/60 dark:bg-emerald-950/20",
                    )}
                  >
                    <span className="hidden sm:flex">
                      <Checkbox
                        checked={checked.has(entry.itemId)}
                        onCheckedChange={(v) => toggle(entry.itemId, Boolean(v))}
                        aria-label={`Select ${entry.item.productName}`}
                      />
                    </span>
                    <ProductThumb
                      src={entry.item.productImageUrl}
                      alt={entry.item.productName}
                      className="size-11 shrink-0 rounded-xl sm:size-12"
                      sizes="96px"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {entry.item.productName}
                      </p>
                      <p className="text-muted-foreground truncate text-[11px]">
                        {entry.item.category?.categoryName ?? "—"}
                        {formatItemSize(entry.item) ? ` · ${formatItemSize(entry.item)}` : ""}
                      </p>
                      {unit.isAvailable ? (
                        <p className="mt-1 flex flex-wrap items-center gap-x-1 text-[11px] tabular-nums">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {formatMoney(unit.vendor, symbol)}
                          </span>
                          {unit.discountPercent > 0 && (
                            <DiscountBadge size="xs" percent={unit.discountPercent} />
                          )}
                          <span className="text-slate-400">
                            + {formatMoney(unit.markup, symbol)}
                          </span>
                          <span className="text-slate-400">=</span>
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
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <QuantityStepper
                        size="sm"
                        value={entry.quantity}
                        onChange={(q) => setQuantity(entry.itemId, q)}
                      />
                      <span className="text-sm font-black text-slate-900 tabular-nums dark:text-white">
                        {formatMoney(lineTotal, symbol)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMany([entry.itemId])}
                      className="-mr-1 shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      aria-label={`Remove ${entry.item.productName}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
              {pricing?.hasUnavailableItems && (
                <p className="flex items-center gap-2 border-t border-amber-200 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
                  <AlertTriangle className="size-4 shrink-0" />
                  Some items are no longer available. Remove them before publishing.
                </p>
              )}
              <footer className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">{items.length}</strong> items ·{" "}
                  <strong className="text-slate-900 dark:text-white">{totalUnits}</strong> units
                </span>
                <span className="text-right">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase">
                    Items total
                  </span>
                  <span className="text-lg font-black tabular-nums">
                    {formatMoney(total, symbol)}
                  </span>
                </span>
              </footer>
            </>
          )}
        </section>
      </div>
    </SectionCard>
  );
}
