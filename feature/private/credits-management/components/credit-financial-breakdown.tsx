"use client";

import { AlertCircle, CheckCircle2, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import type { CreditFinancialBreakdownProps } from "../types/credits.types";

export function CreditFinancialBreakdown({ financials }: CreditFinancialBreakdownProps) {
  const isFeeRefundable = financials.isFeeRefundable ?? true;

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-xs backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      <CardHeader className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Receipt className="size-3.5" />
            </div>
            <CardTitle className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              Refund Calculation Breakdown
            </CardTitle>
          </div>
          <span className="text-[11px] font-medium text-slate-400">Standard Order Policy</span>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="space-y-3 text-xs">
          {/* Original Paid */}
          <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Original Customer Paid (Charged)</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
              {cleanCurrencyDisplay(financials.totalCustomerPaid)}
            </span>
          </div>

          <Separator className="bg-slate-100 dark:bg-slate-800" />

          {/* Out of Stock Base */}
          <div className="flex items-center justify-between text-slate-500">
            <span>Out-of-Stock Items Base Price</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              {cleanCurrencyDisplay(financials.unmarkedItemsBaseTotal)}
            </span>
          </div>

          {/* Food Remit Markup */}
          <div className="flex items-center justify-between text-slate-500">
            <span>Food Remit Markup Refund ({financials.markupPercent})</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              +{cleanCurrencyDisplay(financials.refundedMarkup)}
            </span>
          </div>

          {/* Store Govt Tax */}
          <div className="flex items-center justify-between text-slate-500">
            <span>Store Govt Tax Refund ({financials.taxPercent})</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
              +{cleanCurrencyDisplay(financials.refundedTax)}
            </span>
          </div>

          {/* Cancellation Policy */}
          {financials.cancellationPolicy && (
            <div className="flex items-center justify-between py-1 text-slate-500">
              <span className="flex items-center gap-1.5">Cancellation Policy</span>
              <Badge
                variant="outline"
                className={`text-[10px] font-semibold ${
                  isFeeRefundable
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                }`}
              >
                {isFeeRefundable ? (
                  <CheckCircle2 className="mr-1 size-3 text-emerald-600" />
                ) : (
                  <AlertCircle className="mr-1 size-3 text-amber-600" />
                )}
                {financials.cancellationPolicy}
              </Badge>
            </div>
          )}

          {/* If Fee is non-refundable */}
          {!isFeeRefundable && financials.recordedFee ? (
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-amber-600 dark:text-amber-400">
                Processing Fee Retained (Non-refundable)
              </span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                -${Number(financials.recordedFee).toFixed(2)}
              </span>
            </div>
          ) : null}

          {/* Highlighted Refund Amount Box */}
          <div className="mt-4 rounded-2xl border border-rose-200/70 bg-rose-50/50 p-4 dark:border-rose-900/30 dark:bg-rose-950/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold tracking-wider text-rose-700 uppercase dark:text-rose-400">
                  Total Customer Refund
                </p>
                <p className="text-[10px] text-slate-500">
                  Amount returning to original payment card
                </p>
              </div>
              <p className="font-mono text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
                {cleanCurrencyDisplay(financials.totalRefundCustomer)}
              </p>
            </div>
          </div>

          {/* Retained Amount */}
          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span>Actual Customer Retained Amount:</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              {cleanCurrencyDisplay(financials.actualRetainedAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
