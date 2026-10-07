"use client";

import {
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  ImageIcon,
  LayoutGrid,
  Percent,
  ShoppingBasket,
  Tag,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { BASKET_TYPE_MAP } from "../../../../../../../constants/basket.constants";
import type {
  BasketFormValues,
  BasketSectionId,
  PublishIssue,
} from "../../../schema/basket-form.schema";
import type { BasketPricingPreview } from "../../../types/basket.types";
import { formatMoney } from "../../../utils/basket-format";
import { formatAvailability } from "../../../utils/basket-availability";
import { SectionCard } from "../section-card";

function SummaryTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 p-3 dark:border-slate-800">
      <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-slate-500">{label}</p>
        <p className="truncate text-sm font-bold text-slate-900 dark:text-white" title={value}>
          {value}
        </p>
      </div>
    </div>
  );
}

interface SummarySectionProps {
  pricing?: BasketPricingPreview;
  issues: PublishIssue[];
  onJump: (section: BasketSectionId) => void;
  /** Status the basket will have after saving */
  statusNote: string;
}

export function SummarySection({ pricing, issues, onJump, statusNote }: SummarySectionProps) {
  const { control } = useFormContext<BasketFormValues>();
  const values = useWatch({ control }) as BasketFormValues;
  const symbol = pricing?.currencySymbol ?? "";
  const categories = pricing?.categoryNames ?? [];
  const itemCount = values.items?.length ?? 0;

  const finalPrice = pricing
    ? `${formatMoney(pricing.customerPrice, symbol)}${
        pricing.savingsPercent > 0 ? ` (${pricing.savingsPercent}% off)` : ""
      }`
    : "—";

  return (
    <SectionCard
      id="summary"
      step={7}
      title="Basket Summary"
      description="Review your basket details before creating. You can still make changes above."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile
          icon={LayoutGrid}
          label="Template"
          value={values.basketType ? BASKET_TYPE_MAP[values.basketType].label : "Not selected"}
        />
        <SummaryTile icon={Type} label="Basket Name" value={values.name?.trim() || "—"} />
        <SummaryTile
          icon={ShoppingBasket}
          label="Items"
          value={`${itemCount} ${itemCount === 1 ? "item" : "items"}${
            pricing ? ` · ${pricing.totalUnits} units` : ""
          }`}
        />
        <SummaryTile
          icon={Tag}
          label="Category"
          value={
            categories.length > 1
              ? "Multiple categories"
              : (categories[0] ?? (itemCount ? "—" : "No items yet"))
          }
        />
        <SummaryTile icon={Percent} label="Final Price" value={finalPrice} />
        <SummaryTile icon={CalendarClock} label="Availability" value={formatAvailability(values)} />
        <SummaryTile
          icon={ImageIcon}
          label="Image"
          value={values.image ? "Uploaded image" : "Template image"}
        />
        <SummaryTile icon={CheckCircle2} label="Status after saving" value={statusNote} />
      </div>

      <div
        className={
          issues.length
            ? "mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/20"
            : "mt-4 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300"
        }
      >
        {issues.length ? (
          <>
            <p className="flex items-center gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
              <CircleAlert className="size-4" /> Complete these to create the basket
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {issues.map((issue) => (
                <li key={issue.message}>
                  <button
                    type="button"
                    onClick={() => onJump(issue.section)}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-amber-800 shadow-xs ring-1 ring-amber-200 transition-colors hover:bg-amber-100 dark:bg-slate-900 dark:text-amber-300 dark:ring-amber-900"
                  >
                    {issue.message}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-amber-700/80 dark:text-amber-400/80">
              You can save as a draft at any time and finish later.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="size-5" /> Everything looks good. Your basket is ready to
            create.
          </>
        )}
      </div>
    </SectionCard>
  );
}
