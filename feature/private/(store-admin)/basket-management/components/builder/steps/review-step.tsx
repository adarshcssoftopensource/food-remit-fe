"use client";

import { CheckCircle2, CircleAlert, Eye, EyeOff, Pencil, ScanEye } from "lucide-react";
import type { ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";

import type { BasketFormValues } from "../../../schema/basket-form.schema";
import type { BasketPricingPreview } from "../../../types/basket.types";
import { BasketPricingBreakdown } from "../../shared/basket-pricing-breakdown";
import { BasketSummaryCard } from "../../shared/basket-summary-card";
import { DiscountBadge, PriceStack } from "../../shared/price-display";
import { ProductThumb } from "../../shared/product-thumb";
import { StepHeader } from "../step-header";

export type BuilderStepId =
  "type" | "info" | "items" | "quantities" | "pricing" | "image" | "review";

function Section({
  title,
  onEdit,
  children,
  className,
}: {
  title: string;
  onEdit?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">{title}</h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-primary inline-flex items-center gap-1 text-xs font-semibold hover:underline"
          >
            <Pencil className="size-3" /> Edit
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

interface ReviewStepProps {
  pricing?: BasketPricingPreview;
  pricingLoading: boolean;
  onEditStep: (step: BuilderStepId) => void;
}

export function ReviewStep({ pricing, pricingLoading, onEditStep }: ReviewStepProps) {
  const { control } = useFormContext<BasketFormValues>();
  const values = useWatch({ control }) as BasketFormValues;
  const symbol = pricing?.currencySymbol ?? "$";
  const lineById = new Map(pricing?.lines.map((l) => [l.itemId, l]));

  const checklist = [
    { label: "Basket type selected", done: !!values.basketType },
    { label: "Basket information added", done: (values.name ?? "").trim().length >= 2 },
    { label: "Items and quantities set", done: values.items.length > 0 },
    { label: "All items available", done: !!pricing && !pricing.hasUnavailableItems },
    { label: "Price calculated", done: !!pricing && pricing.customerPrice > 0 },
  ];
  const ready = checklist.every((c) => c.done);

  return (
    <div className="space-y-6">
      <StepHeader
        step={7}
        icon={ScanEye}
        title="Preview your basket"
        description="Review everything before publishing. You can jump back to any step without losing your work."
        action={
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1",
              ready
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900"
                : "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
            )}
          >
            {ready ? <CheckCircle2 className="size-3.5" /> : <CircleAlert className="size-3.5" />}
            {ready ? "Ready to publish" : "Needs attention"}
          </span>
        }
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <Section title="Basket information" onEdit={() => onEditStep("info")}>
            <BasketSummaryCard
              layout="horizontal"
              name={values.name}
              shortDescription={values.shortDescription}
              basketType={values.basketType ?? "CUSTOM"}
              householdSize={values.householdSize}
              image={values.image}
              itemCount={values.items.length}
              totalUnits={pricing?.totalUnits}
              price={pricing?.customerPrice}
              originalPrice={pricing?.customerOriginalPrice}
              currencySymbol={symbol}
            />
            {values.description && (
              <p className="text-muted-foreground mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed whitespace-pre-line dark:border-slate-800">
                {values.description}
              </p>
            )}
          </Section>
          <Section
            title={`Basket items (${values.items.length})`}
            onEdit={() => onEditStep("quantities")}
          >
            <ul className="max-h-[560px] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
              {values.items.map(({ itemId, quantity, item }, index) => {
                const line = lineById.get(itemId);
                return (
                  <li key={itemId} className="flex items-center gap-3 py-2.5">
                    <span className="w-5 text-xs text-slate-400 tabular-nums">{index + 1}</span>
                    <ProductThumb
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="size-9"
                    />
                    <span
                      className={cn(
                        "min-w-0 flex-1 truncate text-sm font-medium",
                        line && !line.isAvailable && "line-through opacity-60",
                      )}
                    >
                      {item.productName}
                    </span>
                    {line && line.discountPercent > 0 && (
                      <DiscountBadge size="xs" percent={line.discountPercent} />
                    )}
                    <span className="text-xs text-slate-500">×{quantity}</span>
                    <div className="w-20 text-right">
                      {line ? (
                        <PriceStack
                          price={line.customerLineTotal}
                          originalPrice={line.customerOriginalLineTotal}
                          currencySymbol={symbol}
                        />
                      ) : (
                        "—"
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Section>
          <div className="grid gap-5 md:grid-cols-2">
            <Section title="Availability" onEdit={() => onEditStep("image")}>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-lg",
                    values.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {values.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {values.isActive ? "Active when published" : "Hidden when published"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Follows your store&apos;s operating schedule
                  </p>
                </div>
              </div>
            </Section>
            <Section title="Publish checklist">
              <ul className="space-y-2">
                {checklist.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-sm">
                    {c.done ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <CircleAlert className="size-4 text-amber-500" />
                    )}
                    <span className={c.done ? "" : "text-amber-700 dark:text-amber-400"}>
                      {c.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <Section title="Pricing summary" onEdit={() => onEditStep("pricing")}>
            <BasketPricingBreakdown pricing={pricing} loading={pricingLoading} />
          </Section>
        </div>
      </div>
    </div>
  );
}
