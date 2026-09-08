"use client";

import { Card } from "@/components/ui/card";
import { BarChart3, CreditCard, Landmark } from "lucide-react";
import type { OrderData } from "../types/order.types";

interface FinancialRowProps {
  label: string;
  value: string;
  highlight?: "red" | "green";
}

function FinancialRow({ label, value, highlight }: FinancialRowProps) {
  const valueClass =
    highlight === "red"
      ? "font-bold text-rose-500"
      : highlight === "green"
        ? "font-bold text-emerald-700 dark:text-emerald-300"
        : "font-semibold text-slate-900 dark:text-white";
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}

interface FinancialCardProps {
  step: number;
  title: string;
  icon: React.ReactNode;
  headerBg: string;
  headerBorder: string;
  borderColor: string;
  totalLabel: string;
  totalColor: string;
  totalValue: string;
  rows: FinancialRowProps[];
  refundDeduction?: string;
  actualLabel?: string;
  actualValue?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  refundAmount?: string;
}

function FinancialCard({
  step,
  title,
  icon,
  headerBg,
  headerBorder,
  borderColor,
  totalLabel,
  totalColor,
  totalValue,
  rows,
  refundDeduction,
  actualLabel,
  actualValue,
  paymentMethod,
  paymentStatus,
  refundAmount,
}: FinancialCardProps) {
  return (
    <Card className={`rounded-2xl border bg-white shadow-sm dark:bg-slate-900 ${borderColor}`}>
      <div
        className={`flex items-center justify-between border-b px-5 py-3 ${headerBg} ${headerBorder}`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex size-6 items-center justify-center rounded-full text-xs font-bold text-white ${totalColor.replace("text-", "bg-").split(" ")[0]}`}
          >
            {step}
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        </div>
        {icon}
      </div>
      <div className="flex flex-col gap-3 p-5">
        {rows.map((row, i) => (
          <FinancialRow key={i} {...row} />
        ))}
        <hr className="my-1 border-dashed border-slate-200 dark:border-slate-700" />
        <div>
          <p className={`text-xs font-semibold ${totalColor}`}>{totalLabel}</p>
          <p className={`text-xl font-black ${totalColor}`}>{totalValue}</p>
          {refundAmount && (
            <div className="mt-1 flex items-center justify-between text-xs text-rose-500">
              <span className="font-semibold">Refunded (Out of stock)</span>
              <span className="font-bold">-{refundAmount}</span>
            </div>
          )}
          {refundDeduction && (
            <div className="mt-1 flex items-center justify-between text-xs text-rose-500">
              <span className="font-semibold">Refund Deduction</span>
              <span className="font-bold">-{refundDeduction}</span>
            </div>
          )}
          {actualLabel && actualValue && (
            <div className={`mt-1 flex items-center justify-between text-xs ${totalColor}`}>
              <span className="font-semibold">{actualLabel}</span>
              <span className="font-bold">{actualValue}</span>
            </div>
          )}
        </div>
        {(paymentMethod || paymentStatus) && (
          <div className="mt-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            {paymentMethod && (
              <>
                <p className="text-[10px] font-medium text-slate-400">Payment Method</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{paymentMethod}</p>
              </>
            )}
            {paymentStatus && (
              <>
                <p className="mt-2 text-[10px] font-medium text-slate-400">Paid</p>
                <span className="mt-1 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {paymentStatus}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

interface OrderFinancialsProps {
  order: OrderData;
}

export function OrderFinancials({ order }: OrderFinancialsProps) {
  const cp = order.customerPayment;
  const fr = order.foodRemitEarnings;
  const vs = order.vendorSettlement;

  const showDiscount =
    cp?.discountAmount && cp.discountAmount !== "₹0.00" && cp.discountAmount !== "$0.00";

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <FinancialCard
        step={1}
        title="Customer Payment"
        icon={<CreditCard className="size-4 text-blue-500" />}
        headerBg="bg-blue-50/30 dark:bg-blue-950/20"
        headerBorder="border-blue-50/50 dark:border-blue-900/20"
        borderColor="border-blue-100 dark:border-blue-900/30"
        totalLabel="Order Total"
        totalColor="text-blue-600 dark:text-blue-400"
        totalValue={cp?.totalCustomerPaid || "0.00"}
        rows={[
          {
            label: `Item Price (Including Markup ${cp?.itemMarkupPercent || "0%"})`,
            value: cp?.merchandiseSubtotal || "0.00",
          },
          ...(showDiscount
            ? [
                {
                  label: "Discount Applied",
                  value: `-${cp!.discountAmount}`,
                  highlight: "green" as const,
                },
              ]
            : []),
          {
            label: `Store Govt tax (${cp?.storeTaxPercent || "0%"})`,
            value: cp?.storeTax || "0.00",
          },
          { label: "Processing Fee", value: cp?.processingFee || "0.00" },
        ]}
        refundAmount={cp?.refundAmount}
        actualLabel="Actual Amount Retained"
        actualValue={cp?.actualRetainedAmount}
        paymentMethod={cp?.paymentMethod}
        paymentStatus={cp?.paymentStatus}
      />

      <FinancialCard
        step={2}
        title="Food Remit Earnings"
        icon={<BarChart3 className="size-4 text-purple-500" />}
        headerBg="bg-purple-50/30 dark:bg-purple-950/20"
        headerBorder="border-purple-50/50 dark:border-purple-900/20"
        borderColor="border-purple-100 dark:border-purple-900/30"
        totalLabel="Total"
        totalColor="text-purple-600 dark:text-purple-400"
        totalValue={fr?.totalFoodRemitRevenue || "0.00"}
        rows={[
          {
            label: `Food Remit Markup(${fr?.markupPercent || "0%"})`,
            value: fr?.markupAmount || "0.00",
          },
          {
            label: `Food Remit commissions(${fr?.commissionPercent || "0%"})`,
            value: fr?.commissionAmount || "0.00",
          },
          { label: "Processing Fee", value: fr?.processingFee || "0.00" },
        ]}
        refundDeduction={fr?.refundDeduction}
        actualLabel="Actual Revenue"
        actualValue={fr?.actualRevenue}
      />

      <FinancialCard
        step={3}
        title="Vendor Settlement"
        icon={<Landmark className="size-4 text-emerald-500" />}
        headerBg="bg-emerald-50/30 dark:bg-emerald-950/20"
        headerBorder="border-emerald-50/50 dark:border-emerald-900/20"
        borderColor="border-emerald-100 dark:border-emerald-900/30"
        totalLabel="Total"
        totalColor="text-emerald-600 dark:text-emerald-400"
        totalValue={vs?.totalVendorSettlement || vs?.vendorProceeds || "0.00"}
        rows={[
          {
            label: "Number of Items:",
            value:
              vs?.inStockItemsCount !== undefined && vs?.totalItemsCount !== undefined
                ? `${vs.inStockItemsCount} of ${vs.totalItemsCount}`
                : String(order.items?.length || 0),
          },
          { label: "Base Price", value: vs?.vendorBaseAmount || "0.00" },
          ...(vs?.govtTax
            ? [{ label: `Store Govt tax(${cp?.storeTaxPercent || "0%"})`, value: vs.govtTax }]
            : []),
          {
            label: `Food Remit Commission(${vs?.commissionPercent || "0%"})`,
            value: vs?.commissionAmount || "0.00",
          },
        ]}
        refundDeduction={vs?.refundDeduction}
        actualLabel="Actual Settlement"
        actualValue={vs?.actualVendorEarnings}
      />
    </div>
  );
}
