"use client";

import { Card } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import type { OrderData } from "@/feature/private/order-management/types/order.types";

interface EmployeeOrderFinancialsProps {
  order: OrderData;
}

export function EmployeeOrderFinancials({ order }: EmployeeOrderFinancialsProps) {
  const cp = order.customerPayment;

  if (!cp) return null;

  const showDiscount =
    cp.discountAmount && cp.discountAmount !== "₹0.00" && cp.discountAmount !== "$0.00";

  return (
    <Card className="rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/30 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-blue-50/50 bg-blue-50/30 px-6 py-4 dark:border-blue-900/20 dark:bg-blue-950/20">
        <CreditCard className="size-5 text-blue-500" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Order Payment Summary
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Item Price
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
            {cleanCurrencyDisplay(cp.merchandiseSubtotal || "0.00")}
          </p>
        </div>

        {showDiscount && (
          <div>
            <p className="text-[10px] font-bold tracking-wider text-emerald-500 uppercase">
              Discount Applied
            </p>
            <p className="mt-1 font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
              -{cp.discountAmount}
            </p>
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Store Govt Tax ({cp.storeTaxPercent || "0%"})
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
            {cleanCurrencyDisplay(cp.storeTax || "0.00")}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-wider text-blue-500 uppercase">
            Order Total
          </p>
          <p className="mt-1 font-mono text-lg font-black text-blue-600 dark:text-blue-400">
            {cleanCurrencyDisplay(cp.totalCustomerPaid || "0.00")}
          </p>
          {cp.refundAmount && (
            <p className="mt-1 text-xs font-semibold text-rose-500">
              Refunded: -{cleanCurrencyDisplay(cp.refundAmount)}
            </p>
          )}
        </div>

        {cp.paymentMethod && (
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Payment Method
            </p>
            <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white">
              {cp.paymentMethod}
            </p>
          </div>
        )}

        {cp.paymentStatus && (
          <div>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Status</p>
            <div className="mt-1">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                {cp.paymentStatus}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
