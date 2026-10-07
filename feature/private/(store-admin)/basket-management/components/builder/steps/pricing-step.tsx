"use client";

import { AlertTriangle, Calculator, Equal, Minus, Percent, Plus, Tag, Wallet } from "lucide-react";
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { BasketPricingPreview } from "../../../types/basket.types";
import { formatMoney } from "../../../utils/basket-format";
import { BasketPricingBreakdown } from "../../shared/basket-pricing-breakdown";
import { DiscountBadge } from "../../shared/price-display";
import { ProductThumb } from "../../shared/product-thumb";
import { StepHeader } from "../step-header";

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: typeof Tag;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone: "emerald" | "rose" | "sky" | "slate";
}) {
  const tones = {
    emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/25",
    rose: "from-rose-500 to-pink-500 shadow-rose-500/25",
    sky: "from-sky-500 to-indigo-500 shadow-sky-500/25",
    slate: "from-slate-700 to-slate-900 shadow-slate-700/25",
  };
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-xl bg-linear-to-br text-white shadow-md",
            tones[tone],
          )}
        >
          <Icon className="size-4.5" />
        </span>
        <p className="text-xs font-semibold text-slate-500">{label}</p>
      </div>
      <div className="mt-3 text-2xl font-black tracking-tight tabular-nums">{value}</div>
      {sub && <div className="text-muted-foreground mt-0.5 text-[11px]">{sub}</div>}
    </div>
  );
}

function EquationChip({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "rose" | "result";
}) {
  return (
    <div
      className={cn(
        "flex min-w-28 flex-1 flex-col rounded-xl px-3 py-2",
        tone === "result"
          ? "bg-primary text-white shadow-lg shadow-emerald-600/25"
          : "bg-white ring-1 ring-slate-200/80 dark:bg-slate-900 dark:ring-slate-800",
      )}
    >
      <span
        className={cn(
          "text-[10px] font-semibold uppercase",
          tone === "result" ? "text-white/80" : "text-slate-500",
        )}
      >
        {label}
      </span>
      <span className={cn("text-base font-black tabular-nums", tone === "rose" && "text-rose-600")}>
        {value}
      </span>
    </div>
  );
}

const Operator = ({ icon: Icon }: { icon: typeof Plus }) => (
  <span className="flex size-6 shrink-0 items-center justify-center self-center rounded-full bg-slate-200/70 text-slate-500 dark:bg-slate-800">
    <Icon className="size-3.5" strokeWidth={3} />
  </span>
);

interface PricingStepProps {
  pricing?: BasketPricingPreview;
  loading: boolean;
}

export function PricingStep({ pricing, loading }: PricingStepProps) {
  const symbol = pricing?.currencySymbol ?? "$";
  const money = (v: number | undefined) => formatMoney(v, symbol);
  const hasDiscount = !!pricing && pricing.discountAmount > 0;

  return (
    <div className="space-y-6">
      <StepHeader
        step={5}
        icon={Calculator}
        title="Basket pricing"
        description="Calculated automatically from your item prices, discounts and quantities. Nothing to enter here, just check it."
      />

      {pricing?.hasUnavailableItems && (
        <div className="flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Some items are no longer available and are left out of the price. Remove them in the
          Quantities step before publishing.
        </div>
      )}

      {loading && !pricing ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        pricing && (
          <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", loading && "opacity-60")}>
            <Kpi
              icon={Tag}
              tone="emerald"
              label="Basket price"
              value={money(pricing.customerPrice)}
              sub={
                hasDiscount ? (
                  <span className="line-through">{money(pricing.customerOriginalPrice)}</span>
                ) : (
                  "What customers pay"
                )
              }
            />
            <Kpi
              icon={Percent}
              tone="rose"
              label="Customer saves"
              value={money(pricing.customerSavings)}
              sub={
                hasDiscount
                  ? `${pricing.discountedItemCount} discounted items`
                  : "No item discounts"
              }
            />
            <Kpi
              icon={Plus}
              tone="sky"
              label="Food Remit markup"
              value={money(pricing.markupAmount)}
              sub={`${pricing.markupPercent}% · not shown to customers`}
            />
            <Kpi
              icon={Wallet}
              tone="slate"
              label="Your estimated payout"
              value={money(pricing.estimatedPayout)}
              sub={`After ${pricing.commissionPercent}% commission`}
            />
          </div>
        )
      )}

      {pricing && (
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-900/60">
          <p className="mb-2 px-1 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            How the basket price is built
          </p>
          <div className="flex flex-wrap items-stretch gap-2">
            <EquationChip label="Your price" value={money(pricing.vendorSubtotal)} />
            {hasDiscount && (
              <>
                <Operator icon={Minus} />
                <EquationChip label="Discounts" value={money(pricing.discountAmount)} tone="rose" />
              </>
            )}
            <Operator icon={Plus} />
            <EquationChip
              label={`Markup ${pricing.markupPercent}%`}
              value={money(pricing.markupAmount)}
            />
            <Operator icon={Equal} />
            <EquationChip label="Basket price" value={money(pricing.customerPrice)} tone="result" />
          </div>
        </div>
      )}

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
            <p className="text-sm font-bold">Price per item</p>
            <p className="text-muted-foreground text-[11px]">
              Line totals, with per-unit amounts below
            </p>
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-180 text-sm">
              <thead className="bg-slate-50 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-900">
                <tr>
                  <th className="px-5 py-2.5 text-left">Item</th>
                  <th className="px-3 py-2.5 text-center">Qty</th>
                  <th className="px-3 py-2.5 text-right">Your price</th>
                  <th className="px-3 py-2.5 text-right">Discount</th>
                  <th className="px-3 py-2.5 text-right">Markup</th>
                  <th className="px-5 py-2.5 text-right">Customer pays</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading && !pricing
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={6} className="px-5 py-3">
                          <Skeleton className="h-9 w-full" />
                        </td>
                      </tr>
                    ))
                  : pricing?.lines.map((line) => (
                      <tr
                        key={line.itemId}
                        className={cn("align-top", !line.isAvailable && "opacity-50")}
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <ProductThumb
                              src={line.item?.productImageUrl}
                              alt={line.item?.productName ?? ""}
                              className="size-10"
                            />
                            <div className="min-w-0">
                              <p className="max-w-56 truncate font-semibold">
                                {line.item?.productName ?? "Unavailable item"}
                              </p>
                              {line.discountPercent > 0 && (
                                <DiscountBadge
                                  size="xs"
                                  percent={line.discountPercent}
                                  className="mt-0.5"
                                />
                              )}
                              {!line.isAvailable && (
                                <p className="text-[11px] text-amber-600">
                                  {line.unavailableReason}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-bold">{line.quantity}</td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          <p className="font-semibold">{money(line.vendorLineTotal)}</p>
                          <p className="text-[10px] text-slate-400">
                            {money(line.vendorUnitPrice)} each
                          </p>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {line.discountLineTotal > 0 ? (
                            <>
                              <p className="font-semibold text-rose-600">
                                −{money(line.discountLineTotal)}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {line.discountPercent}% · −{money(line.discountUnitAmount)} each
                              </p>
                            </>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">
                          {line.markupLineTotal > 0 ? (
                            <>
                              <p className="font-semibold">+{money(line.markupLineTotal)}</p>
                              <p className="text-[10px] text-slate-400">
                                {line.markupPercent}% · +{money(line.markupUnitAmount)} each
                              </p>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              {line.isAvailable ? "No markup" : "—"}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right tabular-nums">
                          <p className="font-black">{money(line.customerLineTotal)}</p>
                          <p className="text-[10px] text-slate-400">
                            {line.discountLineTotal > 0 && (
                              <span className="mr-1 line-through">
                                {money(line.customerOriginalUnitPrice)}
                              </span>
                            )}
                            {money(line.customerUnitPrice)} each
                          </p>
                        </td>
                      </tr>
                    ))}
              </tbody>
              {pricing && (
                <tfoot className="border-t-2 border-slate-200 bg-slate-50/80 font-bold dark:border-slate-700 dark:bg-slate-900/60">
                  <tr>
                    <td className="px-5 py-3">Total</td>
                    <td className="px-3 py-3 text-center">{pricing.totalUnits}</td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {money(pricing.vendorSubtotal)}
                    </td>
                    <td className="px-3 py-3 text-right text-rose-600 tabular-nums">
                      {hasDiscount ? `−${money(pricing.discountAmount)}` : "—"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      +{money(pricing.markupAmount)}
                    </td>
                    <td className="text-primary px-5 py-3 text-right text-base font-black tabular-nums">
                      {money(pricing.customerPrice)}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
            {pricing?.lines.map((line) => (
              <li
                key={line.itemId}
                className={cn("space-y-2.5 p-4", !line.isAvailable && "opacity-50")}
              >
                <div className="flex items-center gap-3">
                  <ProductThumb
                    src={line.item?.productImageUrl}
                    alt={line.item?.productName ?? ""}
                    className="size-11"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {line.item?.productName ?? "Unavailable item"}
                    </p>
                    <p className="text-muted-foreground text-[11px]">Qty {line.quantity}</p>
                  </div>
                  <DiscountBadge size="xs" percent={line.discountPercent} />
                </div>
                <dl className="space-y-1 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-900">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Your price</dt>
                    <dd className="font-semibold tabular-nums">{money(line.vendorLineTotal)}</dd>
                  </div>
                  {line.discountLineTotal > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Discount ({line.discountPercent}%)</dt>
                      <dd className="font-semibold text-rose-600 tabular-nums">
                        −{money(line.discountLineTotal)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Markup ({line.markupPercent}%)</dt>
                    <dd className="font-semibold tabular-nums">+{money(line.markupLineTotal)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 dark:border-slate-700">
                    <dt className="font-bold">Customer pays</dt>
                    <dd className="font-black tabular-nums">{money(line.customerLineTotal)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-fit rounded-3xl border border-slate-200/80 p-5 2xl:sticky 2xl:top-24 dark:border-slate-800">
          <BasketPricingBreakdown pricing={pricing} loading={loading} />
        </div>
      </div>
    </div>
  );
}
