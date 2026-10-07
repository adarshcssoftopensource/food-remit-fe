"use client";

import { Info, Receipt, Wallet } from "lucide-react";
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { BasketPricingTotals } from "../../types/basket.types";
import { formatMoney } from "../../utils/basket-format";

type Tone = "default" | "muted" | "discount" | "deduct" | "add";

function Row({
  label,
  hint,
  value,
  tone = "default",
}: {
  label: ReactNode;
  hint?: string;
  value: string;
  tone?: Tone;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p
          className={cn(
            "text-sm",
            tone === "muted" ? "text-slate-500" : "text-slate-700 dark:text-slate-300",
          )}
        >
          {label}
        </p>
        {hint && <p className="text-[11px] leading-snug text-slate-400">{hint}</p>}
      </div>
      <span
        className={cn(
          "shrink-0 text-sm font-semibold tabular-nums",
          tone === "discount" && "text-rose-600 dark:text-rose-400",
          tone === "deduct" && "text-rose-600 dark:text-rose-400",
          tone === "add" && "text-slate-800 dark:text-slate-200",
          tone === "muted" && "text-slate-500",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Receipt; children: ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
      <Icon className="size-3.5" />
      {children}
    </h4>
  );
}

interface BasketPricingBreakdownProps {
  pricing?: BasketPricingTotals | null;
  loading?: boolean;
  hidePayout?: boolean;
  className?: string;
}

export function BasketPricingBreakdown({
  pricing,
  loading,
  hidePayout,
  className,
}: BasketPricingBreakdownProps) {
  if (loading && !pricing) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full rounded" />
        ))}
      </div>
    );
  }
  if (!pricing) {
    return (
      <p className={cn("text-muted-foreground py-6 text-center text-sm", className)}>
        Add items to see the basket price.
      </p>
    );
  }

  const money = (v: number) => formatMoney(v, pricing.currencySymbol);
  const hasItemDiscount = pricing.itemDiscountAmount > 0;
  const vendorDiscount = pricing.vendorDiscountAmount;
  const discountLabel =
    pricing.pricingMode === "DISCOUNT_PERCENT"
      ? `Vendor discount (${pricing.vendorDiscountPercent}%)`
      : pricing.pricingMode === "MANUAL_PRICE"
        ? "Manual basket price adjustment"
        : null;

  return (
    <div className={cn("space-y-5", loading && "opacity-60 transition-opacity", className)}>
      <section className="space-y-3">
        <SectionTitle icon={Receipt}>Basket price</SectionTitle>
        <Row
          label="Basket subtotal"
          hint={`${pricing.itemCount} items · ${pricing.totalUnits} units at your prices${
            hasItemDiscount ? `, incl. ${money(pricing.itemDiscountAmount)} item discounts` : ""
          }`}
          value={money(pricing.itemsVendorTotal)}
        />
        {discountLabel && (
          <Row
            label={discountLabel}
            value={vendorDiscount >= 0 ? `−${money(vendorDiscount)}` : `+${money(-vendorDiscount)}`}
            tone={vendorDiscount > 0 ? "discount" : "add"}
          />
        )}
        <Row label="Vendor basket price" value={money(pricing.vendorBasketPrice)} tone="add" />
        <Row
          label="Food Remit markup"
          hint={`${Number(pricing.effectiveMarkupPercent.toFixed(2))}% added on top · vendor/admin only`}
          value={`+${money(pricing.markupAmount)}`}
          tone="add"
        />

        <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 p-3.5 ring-1 ring-emerald-200/70 dark:from-emerald-950/40 dark:to-slate-900 dark:ring-emerald-900">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Final customer price
              </p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/70">
                Shown to customers as one price
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl leading-none font-black text-emerald-700 tabular-nums dark:text-emerald-300">
                {money(pricing.customerPrice)}
              </p>
              {pricing.customerSavings > 0 && (
                <p className="mt-1 text-xs text-slate-400 tabular-nums line-through">
                  {money(pricing.customerOriginalPrice)}
                </p>
              )}
            </div>
          </div>
          {pricing.customerSavings > 0 && (
            <p className="mt-2.5 rounded-lg bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
              Customers save {money(pricing.customerSavings)} ({pricing.savingsPercent}% off)
            </p>
          )}
        </div>

        <Row
          label="Tax"
          hint={`${pricing.taxPercent}% store tax, added at checkout`}
          value={`+${money(pricing.estimatedTax)}`}
          tone="muted"
        />
        <Row
          label="Processing fee"
          hint="Charged once per order, not per basket"
          value={`+${money(pricing.processingFee)}`}
          tone="muted"
        />
        <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 dark:border-slate-700">
          <span className="text-sm font-bold">Estimated checkout total</span>
          <span className="text-base font-black tabular-nums">
            {money(pricing.estimatedCustomerTotal)}
          </span>
        </div>
      </section>

      {!hidePayout && (
        <section className="space-y-3 rounded-2xl bg-slate-50 p-3.5 ring-1 ring-slate-200/70 dark:bg-slate-900 dark:ring-slate-800">
          <SectionTitle icon={Wallet}>Your estimated earnings</SectionTitle>
          <Row label="Vendor basket price" value={money(pricing.vendorBasketPrice)} />
          {pricing.commissionAmount > 0 && (
            <Row
              label="Food Remit commission"
              hint={`${pricing.commissionPercent}% of the vendor basket price`}
              value={`−${money(pricing.commissionAmount)}`}
              tone="deduct"
            />
          )}
          <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-200/70 dark:bg-slate-950 dark:ring-slate-800">
            <span className="text-sm font-bold">Estimated vendor payout</span>
            <span className="text-lg font-black text-slate-900 tabular-nums dark:text-white">
              {money(pricing.estimatedPayout)}
            </span>
          </div>
        </section>
      )}

      <p className="text-muted-foreground flex gap-2 text-[11px] leading-relaxed">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        Customers see one basket price. The markup never reduces your payout and is never shown to
        customers as a separate line. Estimates use today&apos;s item prices and update
        automatically.
      </p>
    </div>
  );
}
