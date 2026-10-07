"use client";

import { AlertTriangle, ListOrdered, Plus, Trash2 } from "lucide-react";

import { QuantityStepper } from "@/components/common/quantity-stepper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useBasketItemSelection } from "../../../hooks/use-basket-item-selection";
import type { BasketPricingPreview } from "../../../types/basket.types";
import { formatItemSize, formatMoney } from "../../../utils/basket-format";
import { DiscountBadge, PriceStack } from "../../shared/price-display";
import { ProductThumb } from "../../shared/product-thumb";
import { StepHeader } from "../step-header";

interface QuantitiesStepProps {
  pricing?: BasketPricingPreview;
  onAddMore: () => void;
}

export function QuantitiesStep({ pricing, onAddMore }: QuantitiesStepProps) {
  const { items, remove, setQuantity } = useBasketItemSelection();
  const lineById = new Map(pricing?.lines.map((l) => [l.itemId, l]));
  const symbol = pricing?.currencySymbol ?? "$";
  const totalUnits = items.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="space-y-6">
      <StepHeader
        step={4}
        icon={ListOrdered}
        title="Set item quantities"
        description="Choose how many of each item go into one basket. Totals update instantly."
        action={
          <Button
            type="button"
            variant="outline"
            onClick={onAddMore}
            className="h-10 rounded-xl text-sm font-semibold"
          >
            <Plus className="size-4" /> Add more items
          </Button>
        }
      />

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="hidden grid-cols-[minmax(0,1fr)_130px_140px_140px_44px] gap-4 bg-slate-50 px-5 py-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase lg:grid dark:bg-slate-900">
          <span>Item</span>
          <span className="text-right">Your unit price</span>
          <span className="text-center">Quantity</span>
          <span className="text-right">Line total</span>
          <span />
        </div>

        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map(({ itemId, quantity, item }) => {
            const line = lineById.get(itemId);
            const unavailable = line && !line.isAvailable;
            const hasDiscount = !!line && line.discountPercent > 0;
            return (
              <li
                key={itemId}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-4 py-4 transition-colors sm:px-5 lg:grid-cols-[minmax(0,1fr)_130px_140px_140px_44px]",
                  unavailable && "bg-amber-50/50 dark:bg-amber-950/10",
                )}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <ProductThumb
                    src={item.productImageUrl}
                    alt={item.productName}
                    className="size-14 rounded-xl"
                  />
                  <div className="min-w-0 space-y-1">
                    <p className="truncate text-sm font-semibold">{item.productName}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {formatItemSize(item) && (
                        <span className="text-muted-foreground text-[11px]">
                          {formatItemSize(item)}
                        </span>
                      )}
                      {hasDiscount && <DiscountBadge size="xs" percent={line.discountPercent} />}
                    </div>
                    {hasDiscount && (
                      <p className="text-[11px] font-medium text-rose-600">
                        Save {formatMoney(line.discountUnitAmount, symbol)} each ·{" "}
                        {formatMoney(line.discountLineTotal, symbol)} total
                      </p>
                    )}
                    {unavailable && (
                      <p className="flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        <AlertTriangle className="size-3" /> {line.unavailableReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="hidden lg:block">
                  {line ? (
                    <PriceStack
                      price={line.discountedUnitPrice}
                      originalPrice={line.vendorUnitPrice}
                      currencySymbol={symbol}
                    />
                  ) : (
                    <span className="block text-right text-slate-400">…</span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1 lg:justify-center">
                  <QuantityStepper value={quantity} onChange={(q) => setQuantity(itemId, q)} />
                </div>

                <div className="col-span-2 flex items-center justify-between lg:col-span-1 lg:block">
                  <span className="text-muted-foreground text-xs lg:hidden">
                    {line ? `${formatMoney(line.discountedUnitPrice, symbol)} × ${quantity}` : ""}
                  </span>
                  <div className="text-right">
                    <p className="text-base font-black tabular-nums">
                      {line ? formatMoney(line.discountedLineTotal, symbol) : "…"}
                    </p>
                    {line && (
                      <p className="text-[10px] text-slate-400 tabular-nums">
                        Customer pays {formatMoney(line.customerLineTotal, symbol)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => remove(itemId)}
                  className="hidden justify-self-end rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 lg:block"
                  aria-label={`Remove ${item.productName}`}
                >
                  <Trash2 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => remove(itemId)}
                  className="col-span-2 -mt-1 justify-self-start text-xs font-semibold text-rose-600 lg:hidden"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>

        <div className="grid gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:grid-cols-3 dark:border-slate-800 dark:bg-slate-900/60">
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Basket contents</p>
            <p className="text-sm font-bold">
              {items.length} items · {totalUnits} units
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Your subtotal</p>
            <p className="text-sm font-bold tabular-nums">
              {formatMoney(pricing?.discountedSubtotal, symbol)}
              {pricing && pricing.discountAmount > 0 && (
                <span className="ml-1.5 text-xs font-semibold text-rose-600">
                  (−{formatMoney(pricing.discountAmount, symbol)} discount)
                </span>
              )}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Customer price</p>
            <PriceStack
              price={pricing?.customerPrice}
              originalPrice={pricing?.customerOriginalPrice}
              currencySymbol={symbol}
              size="lg"
              align="right"
              className="items-start sm:items-end"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
