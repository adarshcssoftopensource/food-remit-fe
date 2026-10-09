"use client";

import { AlertTriangle, Info, Loader2, PencilLine, Percent, Tag, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { NumericInput } from "@/components/common/numeric-input";
import { cn } from "@/lib/utils";

import { BASKET_DISCOUNT_PERCENT_MAX } from "../../../../../../../constants/basket.constants";
import type { BasketFormValues } from "../../../schema/basket-form.schema";
import type { BasketPricingPreview } from "../../../types/basket.types";
import { formatMoney } from "../../../utils/basket-format";
import { SectionCard } from "../section-card";

const toInput = (value: number | null | undefined) =>
  value === null || value === undefined ? "" : String(value);

function OptionCard({
  active,
  icon,
  title,
  description,
  onActivate,
  children,
}: {
  active: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onActivate: () => void;
  children: ReactNode;
}) {
  return (
    <div
      onClick={onActivate}
      className={cn(
        "cursor-text rounded-2xl border-2 p-3.5 transition-all sm:p-4",
        active
          ? "border-primary bg-emerald-50/60 shadow-sm dark:bg-emerald-950/20"
          : "border-slate-200/80 bg-slate-50/50 hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-900/40",
      )}
    >
      <div className="flex items-start gap-2.5 sm:gap-3">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors sm:size-9",
            active ? "bg-primary text-white" : "bg-white text-slate-500 dark:bg-slate-800",
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
          <p className="text-muted-foreground text-xs">{description}</p>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  hint,
  value,
  tone = "default",
  emphasis,
}: {
  label: ReactNode;
  hint?: ReactNode;
  value: ReactNode;
  tone?: "default" | "negative" | "positive" | "primary";
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 px-3.5 py-3 sm:gap-4 sm:px-4",
        emphasis && "bg-emerald-50/70 dark:bg-emerald-950/30",
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "font-semibold text-slate-800 dark:text-slate-100",
            emphasis ? "text-base" : "text-sm",
            tone === "primary" && "text-primary",
          )}
        >
          {label}
        </p>
        {hint && <p className="text-muted-foreground mt-0.5 text-[11px] leading-snug">{hint}</p>}
      </div>
      <p
        className={cn(
          "shrink-0 font-black tabular-nums",
          emphasis ? "text-lg sm:text-xl" : "text-[15px] sm:text-base",
          tone === "negative" && "text-rose-600",
          tone === "positive" && "text-slate-700 dark:text-slate-200",
          tone === "primary" && "text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}

interface PricingSectionProps {
  pricing?: BasketPricingPreview;
  loading?: boolean;
  hasIssue?: boolean;
}

export function PricingSection({ pricing, loading, hasIssue }: PricingSectionProps) {
  const { control, setValue, getValues } = useFormContext<BasketFormValues>();
  const pricingMode = useWatch({ control, name: "pricingMode" });
  const [discountInput, setDiscountInput] = useState(() =>
    toInput(getValues("vendorDiscountPercent")),
  );
  const [manualInput, setManualInput] = useState(() => toInput(getValues("manualVendorPrice")));

  const symbol = pricing?.currencySymbol ?? "";
  const money = (n: number | undefined) => (pricing ? formatMoney(n, symbol) : "—");
  const opts = { shouldDirty: true };

  const applyMode = (
    mode: BasketFormValues["pricingMode"],
    discount: number | null,
    manual: number | null,
  ) => {
    setValue("pricingMode", mode, opts);
    setValue("vendorDiscountPercent", discount, opts);
    setValue("manualVendorPrice", manual, opts);
  };

  const onDiscountChange = (raw: string) => {
    let value = raw;
    if (Number(value) > BASKET_DISCOUNT_PERCENT_MAX) value = String(BASKET_DISCOUNT_PERCENT_MAX);
    setDiscountInput(value);
    setManualInput("");
    if (value === "") applyMode("STANDARD", null, null);
    else applyMode("DISCOUNT_PERCENT", Number(value), null);
  };

  const onManualChange = (value: string) => {
    setManualInput(value);
    setDiscountInput("");
    if (value === "") applyMode("STANDARD", null, null);
    else applyMode("MANUAL_PRICE", null, Number(value));
  };

  const clearOption = () => {
    setDiscountInput("");
    setManualInput("");
    applyMode("STANDARD", null, null);
  };

  const discountLabel =
    pricingMode === "DISCOUNT_PERCENT" && pricing
      ? `Vendor Discount (${pricing.vendorDiscountPercent}%)`
      : pricingMode === "MANUAL_PRICE"
        ? "Vendor Discount (manual price)"
        : "Vendor Discount";
  const priceAboveItems = pricing && pricing.vendorDiscountAmount < 0;
  const markupPercentLabel = pricing ? Number(pricing.effectiveMarkupPercent.toFixed(2)) : 10;

  return (
    <SectionCard
      id="pricing"
      step={3}
      title="Basket Pricing Summary"
      description="Set a discount to offer a great value basket for your customers."
      hasIssue={hasIssue}
      action={
        pricingMode !== "STANDARD" && (
          <button
            type="button"
            onClick={clearOption}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
          >
            <X className="size-3.5" /> Use items total
          </button>
        )
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          <OptionCard
            active={pricingMode === "DISCOUNT_PERCENT"}
            icon={<Tag className="size-4" />}
            title="Set a vendor discount percentage"
            description="Apply a percentage discount to the vendor subtotal."
            onActivate={() => document.getElementById("basket-discount-percent")?.focus()}
          >
            <label
              htmlFor="basket-discount-percent"
              className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between min-[420px]:gap-3"
            >
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Discount Percentage
              </span>
              <span className="relative w-full min-[420px]:w-36">
                <NumericInput
                  id="basket-discount-percent"
                  value={discountInput}
                  onValueChange={onDiscountChange}
                  decimals={2}
                  placeholder="0"
                  className="h-10 rounded-xl bg-white pr-9 text-right font-semibold tabular-nums dark:bg-slate-900"
                />
                <Percent className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-slate-400" />
              </span>
            </label>
          </OptionCard>

          <OptionCard
            active={pricingMode === "MANUAL_PRICE"}
            icon={<PencilLine className="size-4" />}
            title="Or set a manual vendor basket price"
            description="Set your own vendor price for this basket."
            onActivate={() => document.getElementById("basket-manual-price")?.focus()}
          >
            <label
              htmlFor="basket-manual-price"
              className="flex flex-col gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between min-[420px]:gap-3"
            >
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Manual Vendor Basket Price{symbol ? ` (${symbol})` : ""}
              </span>
              <span className="relative w-full min-[420px]:w-36">
                {symbol && (
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    {symbol}
                  </span>
                )}
                <NumericInput
                  id="basket-manual-price"
                  value={manualInput}
                  onValueChange={onManualChange}
                  decimals={2}
                  placeholder="0.00"
                  className="h-10 rounded-xl bg-white pl-8 text-right font-semibold tabular-nums dark:bg-slate-900"
                />
              </span>
            </label>
            {priceAboveItems && (
              <p className="mt-2 flex items-start gap-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                <AlertTriangle className="mt-px size-3.5 shrink-0" />
                This price is higher than the items total, so customers pay more than buying the
                items separately.
              </p>
            )}
          </OptionCard>

          <div className="flex gap-3 rounded-2xl border border-sky-200/80 bg-sky-50/70 p-3.5 sm:p-4 dark:border-sky-900/60 dark:bg-sky-950/20">
            <Info className="mt-0.5 size-5 shrink-0 text-sky-600" />
            <div className="space-y-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                How Food Remit markup works
              </p>
              <p>
                Food Remit adds a markup on top of the vendor basket price to create the final
                customer price. This markup is for the customer-facing price and does not reduce the
                vendor payout.
              </p>
              <p className="text-slate-500">
                The markup is visible to vendors only and is never shown to customers as a separate
                line. Taxes are calculated separately at checkout.
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "relative h-fit divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950",
            loading && "opacity-80",
          )}
        >
          {loading && (
            <Loader2 className="text-primary absolute top-3 right-3 size-4 animate-spin" />
          )}
          <SummaryRow
            label="Basket Subtotal (Vendor Items Total)"
            hint={
              pricing && pricing.itemDiscountAmount > 0
                ? `Total cost of items in this basket (your prices), including ${formatMoney(pricing.itemDiscountAmount, symbol)} of item discounts.`
                : "Total cost of items in this basket (your prices)."
            }
            value={money(pricing?.itemsVendorTotal)}
          />
          <SummaryRow
            label={discountLabel}
            hint={
              priceAboveItems
                ? "Your manual price is above the items total."
                : "Discount applied to vendor subtotal."
            }
            value={
              !pricing
                ? "—"
                : priceAboveItems
                  ? `+${formatMoney(-pricing.vendorDiscountAmount, symbol)}`
                  : pricing.vendorDiscountAmount > 0
                    ? `−${formatMoney(pricing.vendorDiscountAmount, symbol)}`
                    : formatMoney(0, symbol)
            }
            tone={pricing && pricing.vendorDiscountAmount > 0 ? "negative" : "default"}
          />
          <SummaryRow
            label="Vendor Basket Price"
            hint="Your price for the basket after the vendor discount."
            value={money(pricing?.vendorBasketPrice)}
            tone="primary"
            emphasis
          />
          <SummaryRow
            label={`Food Remit Markup (${markupPercentLabel}%)`}
            hint="Added on top of your basket price to create the customer price."
            value={pricing ? `+${formatMoney(pricing.markupAmount, symbol)}` : "—"}
            tone="positive"
          />
          <SummaryRow
            label="Final Customer Basket Price"
            hint={
              pricing && pricing.customerSavings > 0
                ? `This is the price customers will pay. They save ${formatMoney(pricing.customerSavings, symbol)} (${pricing.savingsPercent}% off).`
                : "This is the price customers will pay."
            }
            value={money(pricing?.customerPrice)}
            tone="primary"
            emphasis
          />
          {pricing && pricing.commissionAmount > 0 && (
            <SummaryRow
              label={`Food Remit Commission (${pricing.commissionPercent}%)`}
              hint="Deducted from your vendor basket price. It doesn't change the customer price."
              value={`−${formatMoney(pricing.commissionAmount, symbol)}`}
              tone="negative"
            />
          )}
          <SummaryRow
            label="Estimated Vendor Payout"
            hint={
              pricing && pricing.commissionAmount > 0
                ? "Vendor basket price minus Food Remit commission. Markup and taxes are not deducted from you."
                : "You receive the full vendor basket price. Markup and taxes are not deducted from you."
            }
            value={money(pricing?.estimatedPayout)}
          />
          {!pricing && (
            <p className="text-muted-foreground bg-slate-50 px-4 py-2.5 text-center text-xs dark:bg-slate-900">
              Add items to the basket to see pricing.
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
