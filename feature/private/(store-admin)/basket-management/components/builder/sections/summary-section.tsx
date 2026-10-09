"use client";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  ImageIcon,
  LayoutGrid,
  Package,
  Tag,
  Type,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { cn } from "@/lib/utils";

import { BASKET_TYPE_MAP } from "../../../../../../../constants/basket.constants";
import {
  basketLineKey,
  type BasketFormValues,
  type BasketSectionId,
  type PublishIssue,
} from "../../../schema/basket-form.schema";
import type { BasketPricingPreview } from "../../../types/basket.types";
import { formatItemSize, formatMoney } from "../../../utils/basket-format";
import { formatAvailability } from "../../../utils/basket-availability";
import { BasketPricingBreakdown } from "../../shared/basket-pricing-breakdown";
import { BasketSummaryCard } from "../../shared/basket-summary-card";
import { DiscountBadge } from "../../shared/price-display";
import { ProductThumb } from "../../shared/product-thumb";
import { SectionCard } from "../section-card";

function ProductDetailsTable({
  values,
  pricing,
}: {
  values: BasketFormValues;
  pricing?: BasketPricingPreview;
}) {
  const symbol = pricing?.currencySymbol ?? "";
  const money = (n: number | undefined) => (pricing ? formatMoney(n, symbol) : "—");
  const lineByKey = new Map(pricing?.lines.map((l) => [l.lineKey, l]));
  const rows = (values.items ?? []).map((entry) => ({
    key: basketLineKey(entry),
    entry,
    line: lineByKey.get(basketLineKey(entry)),
  }));
  const sum = (pick: (l: NonNullable<(typeof rows)[number]["line"]>) => number) =>
    rows.reduce((acc, r) => acc + (r.line ? pick(r.line) : 0), 0);

  if (!rows.length) {
    return (
      <p className="text-muted-foreground rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm dark:border-slate-700">
        No items in this basket yet.
      </p>
    );
  }

  const th = "px-3 py-2.5 text-right font-semibold whitespace-nowrap";
  const td = "px-3 py-3 text-right tabular-nums whitespace-nowrap";

  return (
    <>
      <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 md:hidden dark:divide-slate-800 dark:border-slate-800">
        {rows.map(({ key, entry, line }) => {
          const item = entry.item;
          const optionName = entry.optionName ?? item.optionName;
          const size = formatItemSize(item);
          const unavailable = line && !line.isAvailable;
          return (
            <li
              key={key}
              className={cn(
                "space-y-2.5 p-3",
                unavailable && "bg-amber-50/70 dark:bg-amber-950/20",
              )}
            >
              <div className="flex items-start gap-3">
                <ProductThumb
                  src={item.productImageUrl}
                  alt={item.productName}
                  className="size-12 shrink-0 rounded-lg"
                  sizes="96px"
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm leading-snug font-semibold text-slate-900 dark:text-white">
                    {item.productName}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                    {optionName && (
                      <span className="max-w-full truncate rounded-md bg-violet-50 px-1.5 py-px font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                        {optionName}
                      </span>
                    )}
                    <span className="text-muted-foreground truncate">
                      {[item.category?.categoryName, size].filter(Boolean).join(" · ") || "—"}
                    </span>
                  </div>
                  {unavailable && (
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-amber-700">
                      <AlertTriangle className="size-3" />
                      {line.unavailableReason ?? "Unavailable"}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-slate-900 tabular-nums dark:text-white">
                    {money(line?.customerLineTotal)}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500">× {entry.quantity}</p>
                </div>
              </div>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 rounded-xl bg-slate-50 px-3 py-2 text-[11px] tabular-nums min-[420px]:grid-cols-3 dark:bg-slate-900">
                {(
                  [
                    ["Vendor / unit", money(line?.discountedUnitPrice)],
                    ["Markup / unit", `+${money(line?.markupUnitAmount)}`],
                    ["Customer / unit", money(line?.customerUnitPrice)],
                    ["Vendor total", money(line?.discountedLineTotal)],
                    ["Tax", money(line?.taxLineTotal)],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="truncate text-slate-500">{label}</dt>
                    <dd className="font-semibold text-slate-800 dark:text-slate-100">{value}</dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
        <li className="flex items-center justify-between gap-3 bg-slate-50/80 p-3 text-sm dark:bg-slate-900/60">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            {rows.length} items · {pricing?.totalUnits ?? "—"} units
          </span>
          <span className="text-right">
            <span className="block text-[10px] text-slate-500">Before basket discount</span>
            <span className="font-black tabular-nums">
              {money(sum((l) => l.customerLineTotal))}
            </span>
          </span>
        </li>
      </ul>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200/80 md:block dark:border-slate-800">
        <table className="w-full min-w-245 text-sm">
          <thead className="bg-slate-50 text-[10px] tracking-wide text-slate-500 uppercase dark:bg-slate-900">
            <tr>
              <th className="px-3 py-2.5 text-left font-semibold">Product</th>
              <th className="px-3 py-2.5 text-left font-semibold">Category</th>
              <th className={th}>Qty</th>
              <th className={th}>
                Vendor price
                <span className="block text-[9px] font-medium normal-case">per unit</span>
              </th>
              <th className={th}>
                Markup
                <span className="block text-[9px] font-medium normal-case">per unit</span>
              </th>
              <th className={th}>
                Customer price
                <span className="block text-[9px] font-medium normal-case">per unit</span>
              </th>
              <th className={th}>
                Tax
                <span className="block text-[9px] font-medium normal-case">
                  {pricing ? `${pricing.taxPercent}% · line` : "line"}
                </span>
              </th>
              <th className={th}>
                Vendor total
                <span className="block text-[9px] font-medium normal-case">line</span>
              </th>
              <th className={th}>
                Line total
                <span className="block text-[9px] font-medium normal-case">customer</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map(({ key, entry, line }) => {
              const item = entry.item;
              const size = formatItemSize(item);
              const unavailable = line && !line.isAvailable;
              return (
                <tr
                  key={key}
                  className={unavailable ? "bg-amber-50/70 dark:bg-amber-950/20" : undefined}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <ProductThumb
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="size-11 shrink-0 rounded-lg"
                        sizes="88px"
                      />
                      <div className="min-w-0">
                        <p className="max-w-56 truncate font-semibold text-slate-900 dark:text-white">
                          {item.productName}
                        </p>
                        {(entry.optionName ?? item.optionName) && (
                          <span className="mt-0.5 inline-flex max-w-56 truncate rounded-md bg-violet-50 px-1.5 py-px text-[10px] font-semibold text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                            {entry.optionName ?? item.optionName}
                          </span>
                        )}
                        <p className="text-muted-foreground text-[11px]">
                          {size || "—"}
                          {unavailable ? (
                            <span className="ml-1 inline-flex items-center gap-0.5 font-semibold text-amber-700">
                              <AlertTriangle className="size-3" />
                              {line.unavailableReason ?? "Unavailable"}
                            </span>
                          ) : (
                            <span className="ml-1">· {item.stockQuantity} in stock</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600 dark:text-slate-300">
                    {item.category?.categoryName ?? "—"}
                  </td>
                  <td className={`${td} font-bold`}>× {entry.quantity}</td>
                  <td className={td}>
                    <p className="font-semibold">{money(line?.discountedUnitPrice)}</p>
                    {line && line.discountPercent > 0 && (
                      <p className="flex items-center justify-end gap-1">
                        <span className="text-[10px] text-slate-400 line-through">
                          {money(line.vendorUnitPrice)}
                        </span>
                        <DiscountBadge size="xs" percent={line.discountPercent} />
                      </p>
                    )}
                  </td>
                  <td className={`${td} text-slate-600 dark:text-slate-300`}>
                    <p>+{money(line?.markupUnitAmount)}</p>
                    {line && (
                      <p className="text-[10px] text-slate-400">
                        {Number(line.markupPercent.toFixed(2))}%
                      </p>
                    )}
                  </td>
                  <td className={`${td} font-semibold`}>{money(line?.customerUnitPrice)}</td>
                  <td className={`${td} text-slate-500`}>{money(line?.taxLineTotal)}</td>
                  <td className={`${td} text-slate-600 dark:text-slate-300`}>
                    {money(line?.discountedLineTotal)}
                  </td>
                  <td className={`${td} font-black text-slate-900 dark:text-white`}>
                    {money(line?.customerLineTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50/80 text-sm dark:bg-slate-900/60">
            <tr>
              <td
                colSpan={2}
                className="px-3 py-3 font-semibold text-slate-600 dark:text-slate-300"
              >
                {rows.length} items
              </td>
              <td className={`${td} font-bold`}>{pricing?.totalUnits ?? "—"}</td>
              <td colSpan={3} className="px-3 py-3 text-right text-[11px] text-slate-500">
                Totals before basket discount
              </td>
              <td className={`${td} font-semibold`}>{money(sum((l) => l.taxLineTotal))}</td>
              <td className={`${td} font-semibold`}>{money(sum((l) => l.discountedLineTotal))}</td>
              <td className={`${td} text-base font-black`}>
                {money(sum((l) => l.customerLineTotal))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

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

  return (
    <SectionCard
      id="summary"
      step={6}
      title="Basket Summary"
      description="Review your basket details before creating. Go back to any step to make changes."
    >
      <div className="mb-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200/80 p-4 dark:border-slate-800">
            <BasketSummaryCard
              layout="horizontal"
              name={values.name?.trim() ?? ""}
              shortDescription={values.description?.trim() || null}
              basketType={values.basketType ?? "CUSTOM"}
              householdSize={values.householdSize || null}
              image={values.image}
              libraryImage={values.libraryImage}
              itemCount={itemCount}
              totalUnits={pricing?.totalUnits}
              price={pricing?.customerPrice}
              originalPrice={pricing?.customerOriginalPrice}
              currencySymbol={symbol}
            />
          </div>
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              <CheckCircle2 className="text-primary size-4" /> Basket details
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
              <SummaryTile
                icon={LayoutGrid}
                label="Template"
                value={
                  values.basketType ? BASKET_TYPE_MAP[values.basketType].label : "Not selected"
                }
              />
              <SummaryTile icon={Type} label="Basket Name" value={values.name?.trim() || "—"} />
              <SummaryTile
                icon={Tag}
                label="Category"
                value={
                  categories.length > 1
                    ? "Multiple categories"
                    : (categories[0] ?? (itemCount ? "—" : "No items yet"))
                }
              />
              <SummaryTile
                icon={CalendarClock}
                label="Availability"
                value={formatAvailability(values)}
              />
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
                  ? "rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/20"
                  : "flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm font-semibold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-300"
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
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 p-4 lg:sticky lg:top-20 dark:border-slate-800">
          <BasketPricingBreakdown pricing={pricing} />
        </div>
      </div>

      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
        <Package className="text-primary size-4" /> Products in this basket
      </h3>
      <ProductDetailsTable values={values} pricing={pricing} />
    </SectionCard>
  );
}
