"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Hash, Info, MapPin, Receipt, Wallet } from "lucide-react";
import type { ItemData } from "../types/item.types";

interface ItemProductPricingCardProps {
  item: ItemData;
  viewerCountryCode?: string | null;
  viewerCountryName?: string | null;
  selectedCountryId?: string;
  onSelectCountryId?: (countryId: string) => void;
}

function formatMoney(amount: number, currencySymbol: string) {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

type ReceiptLine = {
  label: string;
  value: string;
  muted?: boolean;
  negative?: boolean;
  addon?: boolean;
  subtotal?: boolean;
};

export function ItemProductPricingCard({
  item,
  viewerCountryCode,
  viewerCountryName,
  selectedCountryId,
  onSelectCountryId,
}: ItemProductPricingCardProps) {
  const pricing = item.pricing;
  const currencySymbol = pricing?.currencySymbol || "-";
  const countryLabel = pricing?.countryName || item.pricingCountry?.name || "your location";
  const currency = pricing?.currency || "—";

  const placementCountries = (item.placements || []).reduce<
    { id: string; name: string; countryCode?: string | null }[]
  >((acc, row) => {
    if (!row.country?.id) return acc;
    if (acc.some((c) => c.id === row.country!.id)) return acc;
    acc.push({
      id: row.country.id,
      name: row.country.name,
      countryCode: row.country.countryCode,
    });
    return acc;
  }, []);

  const lines: ReceiptLine[] = pricing
    ? [
        {
          label: "Item base price",
          value: formatMoney(pricing.basePrice, currencySymbol),
          muted: true,
        },
        {
          label: pricing.discountEnabled ? `Discount (${pricing.discountPercent}%)` : "Discount",
          value: pricing.discountEnabled
            ? `− ${formatMoney(pricing.discountAmount, currencySymbol)}`
            : "N/A",
          negative: pricing.discountEnabled,
          muted: !pricing.discountEnabled,
        },
        {
          label: "Price After Discount",
          value: formatMoney(
            pricing.basePrice - (pricing.discountEnabled ? pricing.discountAmount : 0),
            currencySymbol,
          ),
          subtotal: true,
        },
        ...(item.storeId
          ? [
              {
                label: `Store Govt tax (${pricing.taxPercent}%)`,
                value: `+ ${formatMoney(pricing.taxAmount, currencySymbol)}`,
                addon: true,
              },
            ]
          : []),
        {
          label: `Food Remit Markup (${pricing.markupPercent}%)`,
          value: `+ ${formatMoney(pricing.markupAmount, currencySymbol)}`,
          addon: true,
        },
      ]
    : [];

  const itemTotal = pricing
    ? formatMoney(
        pricing.itemTotal ?? pricing.priceAfterDiscount ?? pricing.grandTotal,
        currencySymbol,
      )
    : "—";

  return (
    <Card className="w-full overflow-hidden rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="border-b border-slate-100/80 px-5 py-4 sm:px-8 dark:border-slate-800/80">
        <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 sm:text-lg dark:text-white">
          <div className="bg-primary h-4 w-1.5 rounded-full" />
          Product Information
        </CardTitle>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Price for your IP location
          {viewerCountryName || viewerCountryCode
            ? ` (${[viewerCountryName, viewerCountryCode].filter(Boolean).join(" · ")})`
            : ""}
          . No price for that country → receipt stays hidden.
        </p>
        {placementCountries.length > 0 && onSelectCountryId ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {placementCountries.map((c) => {
              const active = selectedCountryId === c.id || item.pricingCountry?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectCountryId(c.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  {c.name}
                  {c.countryCode ? ` · ${c.countryCode}` : ""}
                </button>
              );
            })}
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6 lg:p-8">
        {!pricing ? (
          <div className="flex gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 dark:border-slate-700 dark:bg-slate-900/40">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No price for your location
              </p>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                This item has no placement price for{" "}
                {item.pricingCountry?.name ||
                  viewerCountryName ||
                  (viewerCountryCode ? `country ${viewerCountryCode}` : "your detected location")}
                . Add a country price below, or pick another country above.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#fafaf8] shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <div className="border-b border-dashed border-slate-200 bg-white px-5 py-5 sm:px-8 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                      <Receipt className="size-5" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Item Price Receipt
                      </p>
                      <p className="text-xs text-slate-500 sm:text-sm">{item.productName}</p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                      Currency
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {currencySymbol} · {countryLabel}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-0 px-5 py-1 sm:px-8">
                {lines.map((line) => (
                  <div
                    key={line.label}
                    className={cn(
                      "flex items-center justify-between gap-4 border-b border-dashed border-slate-200/80 py-3.5 last:border-0 dark:border-slate-800",
                      line.subtotal && "-mx-2 rounded-lg bg-slate-50/90 px-2 dark:bg-slate-800/40",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm text-slate-600 sm:text-[15px] dark:text-slate-300",
                        line.subtotal && "font-medium text-slate-800 dark:text-slate-100",
                        line.muted && "text-slate-500",
                      )}
                    >
                      {line.label}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-sm font-semibold text-slate-900 tabular-nums sm:text-base dark:text-white",
                        line.addon && "text-emerald-700 dark:text-emerald-400",
                        line.negative && "text-rose-600 dark:text-rose-400",
                        line.muted && !line.negative && "font-medium text-slate-400",
                        line.subtotal && "text-base sm:text-lg",
                      )}
                    >
                      {line.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="dark:border-primary dark:bg-primary border-primary/20 bg-primary/5 border-t-2 px-5 py-5 sm:px-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-medium tracking-wider uppercase">Item Total</p>
                    <p className="mt-0.5 text-xs">Per item (processing fee not included)</p>
                  </div>
                  <p className="font-mono text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                    {itemTotal}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-dashed border-slate-200 bg-white px-5 py-3.5 sm:px-8 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <Hash className="size-3.5 text-slate-400" />
                  <p className="text-[11px] text-slate-500 sm:text-xs">
                    UPC{" "}
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
                      {item.upcCode || "N/A"}
                    </span>
                  </p>
                </div>
                <p className="text-[11px] text-slate-400 sm:text-xs">
                  Tax = Set Food Remit Markup Per Item
                </p>
              </div>
            </div>

            <div className="flex gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4 sm:p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Wallet className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-amber-950 dark:text-amber-100">
                    Processing Fee (per order)
                  </p>
                  <p className="font-mono text-lg font-bold text-amber-900 tabular-nums dark:text-amber-50">
                    {formatMoney(pricing.processingFeeAmount, currencySymbol)}
                  </p>
                </div>
                <p className="mt-1 flex items-start gap-1.5 text-xs text-amber-800/90 dark:text-amber-200/80">
                  <Info className="mt-0.5 size-3.5 shrink-0" />
                  Added once on the whole order for {countryLabel} — not on each item. Order payable
                  = sum of item totals + this fee.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
