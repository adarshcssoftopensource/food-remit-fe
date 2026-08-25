"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BadgePercent, CircleDollarSign, Hash, Receipt, Tags } from "lucide-react";
import type { ItemData } from "../types/item.types";

interface ItemProductPricingCardProps {
  item: ItemData;
}

function formatMoney(amount: number, symbol: string) {
  return `${symbol}${amount.toFixed(2)}`;
}

export function ItemProductPricingCard({ item }: ItemProductPricingCardProps) {
  const pricing = item.pricing;
  const symbol = pricing?.currencySymbol || pricing?.currency || "$";

  const rows = [
    {
      label: "Product Base Price",
      value: pricing ? formatMoney(pricing.basePrice, symbol) : "—",
      hint: pricing?.currency ? pricing.currency : undefined,
      icon: <CircleDollarSign className="size-4" />,
    },
    {
      label: "Tax",
      value: pricing ? `${formatMoney(pricing.taxAmount, symbol)} (${pricing.taxPercent}%)` : "—",
      icon: <Receipt className="size-4" />,
    },
    {
      label: "Net Price Amount (Including Tax)",
      value: pricing ? formatMoney(pricing.netPriceIncludingTax, symbol) : "—",
      icon: <Tags className="size-4" />,
    },
    {
      label: "Discount",
      value: pricing
        ? pricing.discountEnabled
          ? `${formatMoney(pricing.discountAmount, symbol)} (${pricing.discountPercent}%)`
          : "Not available"
        : "—",
      icon: <BadgePercent className="size-4" />,
    },
    {
      label: "Price After Discount",
      value: pricing ? formatMoney(pricing.priceAfterDiscount, symbol) : "—",
      icon: <CircleDollarSign className="size-4" />,
    },
    {
      label: "Total Price (Including Foodremit Commission)",
      value: pricing ? formatMoney(pricing.totalPriceIncludingCommission, symbol) : "—",
      hint: pricing?.adminShareEnabled
        ? `Commission ${formatMoney(pricing.commissionAmount, symbol)} (${pricing.commissionPercent}%)`
        : "Commission not applied",
      icon: <Receipt className="size-4" />,
      highlight: true,
    },
    {
      label: "UPC Code",
      value: item.upcCode || "N/A",
      icon: <Hash className="size-4" />,
      mono: true,
    },
  ];

  return (
    <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-xl shadow-slate-200/40 dark:bg-slate-950 dark:shadow-none">
      <CardHeader className="border-b border-slate-100/80 px-5 py-4 sm:px-6 dark:border-slate-800/80">
        <CardTitle className="flex items-center gap-3 text-base font-bold text-slate-900 dark:text-white">
          <div className="bg-primary h-4 w-1.5 rounded-full" />
          Product Information
        </CardTitle>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Pricing breakdown and UPC for this product.
        </p>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((row) => (
            <div
              key={row.label}
              className={cn(
                "rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 sm:p-4 dark:border-slate-800 dark:bg-slate-900/40",
                row.highlight &&
                  "border-primary/20 from-primary/8 dark:from-primary/10 bg-linear-to-br to-emerald-50/50 sm:col-span-2 lg:col-span-1 dark:to-slate-900",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                  {row.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                    {row.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-sm font-semibold break-all text-slate-900 sm:text-base dark:text-white",
                      row.mono && "font-mono text-xs sm:text-sm",
                    )}
                  >
                    {row.value}
                  </p>
                  {row.hint ? <p className="mt-0.5 text-xs text-slate-500">{row.hint}</p> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
