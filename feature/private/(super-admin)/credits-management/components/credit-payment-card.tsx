"use client";

import { useMemo, useState } from "react";
import { Check, Copy, CreditCard, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PaymentCard,
  detectGlobalCardNetwork,
  NETWORK_STYLE_MAP,
} from "@/components/common/payment-card";
import type { CreditPaymentCardProps } from "../types/credits.types";

export function CreditPaymentCard({
  transaction,
  customerName,
  currency = "INR",
}: CreditPaymentCardProps) {
  const [copied, setCopied] = useState(false);

  const cardLast4 = transaction.cardLast4 || "4242";
  const fundingType = (transaction.cardFunding || "credit").toUpperCase();

  // Network info for the card badge in header
  const activeNetwork = useMemo(() => {
    return detectGlobalCardNetwork(
      transaction.cardBrand || transaction.paymentMethod,
      transaction.cardLast4,
    );
  }, [transaction.cardBrand, transaction.paymentMethod, transaction.cardLast4]);

  const networkName = NETWORK_STYLE_MAP[activeNetwork]?.displayName || "Card";

  const handleCopyChargeId = () => {
    if (transaction.stripeChargeId) {
      navigator.clipboard.writeText(transaction.stripeChargeId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85">
      <CardHeader className="border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <CreditCard className="size-3.5" />
            </div>
            <CardTitle className="text-xs font-bold tracking-wider text-slate-700 uppercase dark:text-slate-300">
              Card Payment Details
            </CardTitle>
          </div>

          <Badge
            variant="outline"
            className="gap-1 border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <span>{networkName}</span>
            <span className="text-slate-400">•</span>
            <span>{fundingType}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between p-5">
        <PaymentCard
          brand={transaction.cardBrand || transaction.paymentMethod}
          last4={transaction.cardLast4}
          cardholderName={customerName}
          expMonth={transaction.expMonth}
          expYear={transaction.expYear}
          bankName={transaction.bankName}
          currency={currency}
          funding={transaction.cardFunding}
          size="md"
        />

        <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-slate-800/80 dark:bg-slate-800/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Payment Processor</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Stripe Payments
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span>Transaction Type</span>
            <span className="font-semibold text-slate-800 capitalize dark:text-slate-200">
              {transaction.paymentMethod || "Card Online"}
            </span>
          </div>

          {transaction.stripeChargeId && (
            <div className="flex items-center justify-between border-t border-slate-200/60 pt-1 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400">Charge ID</span>
              <button
                type="button"
                onClick={handleCopyChargeId}
                className="group inline-flex cursor-pointer items-center gap-1 font-mono text-[11px] font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                title="Copy Charge ID"
              >
                <span>{transaction.stripeChargeId.slice(0, 16)}...</span>
                {copied ? (
                  <Check className="size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3 text-slate-400 group-hover:text-indigo-600" />
                )}
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-slate-500 dark:text-slate-400">Refund Destination</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              Original Payment Card (•••• {cardLast4})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
