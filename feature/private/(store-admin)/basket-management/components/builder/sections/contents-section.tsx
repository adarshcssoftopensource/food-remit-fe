"use client";

import { AlertTriangle, Plus, ShoppingBasket, Trash2 } from "lucide-react";
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
import { AddItemsDialog } from "./add-items-dialog";

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
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const addButton = (
    <Button
      type="button"
      onClick={() => setDialogOpen(true)}
      disabled={!storeId}
      className="h-10 rounded-xl px-4 shadow-md shadow-emerald-600/20"
    >
      <Plus className="size-4" /> Add Items
    </Button>
  );

  return (
    <SectionCard
      id="contents"
      step={3}
      title="Basket Contents"
      description="Add products to this basket from your store's catalogue and set quantities."
      action={items.length > 0 ? addButton : undefined}
      hasIssue={hasIssue}
    >
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 px-6 py-12 text-center dark:border-slate-700">
          <span className="flex size-16 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
            <ShoppingBasket className="text-primary size-8" />
          </span>
          <div>
            <p className="font-semibold">No items in this basket yet</p>
            <p className="text-muted-foreground mt-1 max-w-sm text-sm">
              Choose items from your catalogue. You can adjust quantities once they&apos;re added.
            </p>
          </div>
          {addButton}
        </div>
      ) : (
        <div className="space-y-3">
          {checkedIds.length > 0 && (
            <div className="animate-in fade-in slide-in-from-top-1 flex items-center justify-between rounded-xl bg-rose-50 px-3 py-2 text-sm duration-200 dark:bg-rose-950/30">
              <span className="font-medium text-rose-700 dark:text-rose-300">
                {checkedIds.length} selected
              </span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={removeChecked}
                className="h-8 rounded-lg text-rose-600 hover:bg-rose-100 hover:text-rose-700"
              >
                <Trash2 className="size-4" /> Remove selected
              </Button>
            </div>
          )}

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-200/80 md:block dark:border-slate-800">
            <table className="w-full min-w-215 text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold tracking-wide text-slate-500 uppercase dark:bg-slate-900">
                <tr>
                  <th className="w-10 py-3 pl-4 text-left">
                    <Checkbox
                      checked={allChecked}
                      indeterminate={checkedIds.length > 0 && !allChecked}
                      onCheckedChange={(v) =>
                        setChecked(v ? new Set(items.map((i) => i.itemId)) : new Set())
                      }
                      aria-label="Select all basket items"
                    />
                  </th>
                  <th className="w-16 py-3 text-left">Image</th>
                  <th className="py-3 text-left">Product Name</th>
                  <th className="py-3 text-left">Category</th>
                  <th className="py-3 text-right">
                    Vendor Price
                    <span className="block text-[10px] font-medium normal-case">(Your Price)</span>
                  </th>
                  <th className="py-3 text-right">
                    Food Remit
                    <span className="block text-[10px] font-medium normal-case">
                      Markup ({markupPercent}%)
                    </span>
                  </th>
                  <th className="py-3 text-right">Customer Price</th>
                  <th className="py-3 text-center">Quantity</th>
                  <th className="py-3 text-right">Line Total</th>
                  <th className="w-14 py-3 pr-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map(({ entry, unit, lineTotal }) => (
                  <tr
                    key={entry.itemId}
                    className={cn(
                      "animate-in fade-in slide-in-from-bottom-1 duration-300",
                      !unit.isAvailable && "bg-amber-50/60 dark:bg-amber-950/20",
                      checked.has(entry.itemId) && "bg-emerald-50/50 dark:bg-emerald-950/20",
                    )}
                  >
                    <td className="py-2.5 pl-4">
                      <Checkbox
                        checked={checked.has(entry.itemId)}
                        onCheckedChange={(v) => toggle(entry.itemId, Boolean(v))}
                        aria-label={`Select ${entry.item.productName}`}
                      />
                    </td>
                    <td className="py-2.5">
                      <ProductThumb
                        src={entry.item.productImageUrl}
                        alt={entry.item.productName}
                        className="size-12 rounded-lg"
                        sizes="96px"
                      />
                    </td>
                    <td className="py-2.5 pr-3">
                      <p className="line-clamp-2 font-semibold text-slate-900 dark:text-white">
                        {entry.item.productName}
                      </p>
                      {unit.isAvailable ? (
                        <p className="text-muted-foreground text-[11px]">
                          {formatItemSize(entry.item) || "\u00A0"}
                        </p>
                      ) : (
                        <p className="flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                          <AlertTriangle className="size-3" />
                          {unit.unavailableReason ?? "Unavailable"}
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 pr-3 text-slate-600 dark:text-slate-300">
                      {entry.item.category?.categoryName ?? "—"}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <p className="font-bold tabular-nums">{formatMoney(unit.vendor, symbol)}</p>
                      {unit.discountPercent > 0 && (
                        <p className="flex items-center justify-end gap-1">
                          <span className="text-[11px] text-slate-400 line-through">
                            {formatMoney(unit.vendorRegular, symbol)}
                          </span>
                          <DiscountBadge size="xs" percent={unit.discountPercent} />
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 text-right text-slate-600 tabular-nums dark:text-slate-300">
                      {formatMoney(unit.markup, symbol)}
                    </td>
                    <td className="py-2.5 text-right font-bold tabular-nums">
                      {formatMoney(unit.customer, symbol)}
                    </td>
                    <td className="py-2.5">
                      <div className="flex justify-center">
                        <QuantityStepper
                          size="sm"
                          value={entry.quantity}
                          onChange={(q) => setQuantity(entry.itemId, q)}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-slate-900 tabular-nums dark:text-white">
                      {formatMoney(lineTotal, symbol)}
                    </td>
                    <td className="py-2.5 pr-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeMany([entry.itemId])}
                        className="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                        aria-label={`Remove ${entry.item.productName}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/70 text-sm dark:bg-slate-900/60">
                <tr>
                  <td colSpan={7} className="py-3 pl-4 text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">{items.length}</strong> items
                    · <strong className="text-slate-900 dark:text-white">{totalUnits}</strong> units
                  </td>
                  <td className="py-3 text-center text-xs font-semibold text-slate-500 uppercase">
                    Total
                  </td>
                  <td className="py-3 text-right text-base font-black tabular-nums">
                    {formatMoney(total, symbol)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="space-y-2.5 md:hidden">
            {rows.map(({ entry, unit, lineTotal }) => (
              <li
                key={entry.itemId}
                className={cn(
                  "animate-in fade-in slide-in-from-bottom-1 rounded-2xl border p-3 duration-300",
                  unit.isAvailable
                    ? "border-slate-200/80 dark:border-slate-800"
                    : "border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20",
                )}
              >
                <div className="flex gap-3">
                  <ProductThumb
                    src={entry.item.productImageUrl}
                    alt={entry.item.productName}
                    className="size-16 shrink-0 rounded-xl"
                    sizes="128px"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-semibold">{entry.item.productName}</p>
                      <button
                        type="button"
                        onClick={() => removeMany([entry.itemId])}
                        className="-mt-1 -mr-1 rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                        aria-label={`Remove ${entry.item.productName}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-muted-foreground text-[11px]">
                      {entry.item.category?.categoryName ?? "—"}
                    </p>
                    {!unit.isAvailable && (
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                        <AlertTriangle className="size-3" />
                        {unit.unavailableReason ?? "Unavailable"}
                      </p>
                    )}
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2 text-center text-[11px] dark:bg-slate-900">
                  <div>
                    <dt className="text-slate-500">Your price</dt>
                    <dd className="font-bold tabular-nums">{formatMoney(unit.vendor, symbol)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Markup</dt>
                    <dd className="font-bold tabular-nums">{formatMoney(unit.markup, symbol)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Customer</dt>
                    <dd className="font-bold tabular-nums">{formatMoney(unit.customer, symbol)}</dd>
                  </div>
                </dl>
                <div className="mt-3 flex items-center justify-between">
                  <QuantityStepper
                    size="sm"
                    value={entry.quantity}
                    onChange={(q) => setQuantity(entry.itemId, q)}
                  />
                  <p className="text-right">
                    <span className="block text-[10px] text-slate-500 uppercase">Line total</span>
                    <span className="font-black tabular-nums">
                      {formatMoney(lineTotal, symbol)}
                    </span>
                  </p>
                </div>
              </li>
            ))}
            <li className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-900">
              <span className="text-slate-600 dark:text-slate-300">
                {items.length} items · {totalUnits} units
              </span>
              <span className="text-base font-black tabular-nums">
                {formatMoney(total, symbol)}
              </span>
            </li>
          </ul>

          {pricing?.hasUnavailableItems && (
            <p className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
              <AlertTriangle className="size-4 shrink-0" />
              Some items are no longer available. Remove them before publishing the basket.
            </p>
          )}
        </div>
      )}

      <AddItemsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        storeId={storeId}
        addedIds={addedIds}
        onAdd={(selected) => {
          const count = addMany(selected);
          if (count) {
            successToast({
              description: `${count} ${count === 1 ? "item" : "items"} added to the basket`,
            });
          }
        }}
      />
    </SectionCard>
  );
}
