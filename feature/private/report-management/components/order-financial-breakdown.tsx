"use client";

import { Card } from "@/components/ui/card";
import { BarChart3, CreditCard, Landmark } from "lucide-react";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";

interface FinancialRowProps {
  label: string;
  value: string;
  highlight?: "red" | "green";
}

function FinancialRow({ label, value, highlight }: FinancialRowProps) {
  const isSpecialText = value.includes("%") || value.includes(" of ") || value === "All";
  const displayValue = isSpecialText ? value : cleanCurrencyDisplay(value);
  const valueClass =
    highlight === "red"
      ? "font-bold text-rose-500"
      : highlight === "green"
        ? "font-bold text-emerald-700 dark:text-emerald-300"
        : "font-semibold text-slate-900 dark:text-white";
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={valueClass}>{displayValue}</span>
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
    <Card className={`rounded-2xl border bg-white shadow-xs dark:bg-slate-900 ${borderColor}`}>
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
        <hr className="my-1 border-dashed border-slate-200 dark:border-slate-800" />
        <div>
          <p className={`text-xs font-semibold ${totalColor}`}>{totalLabel}</p>
          <p className={`text-xl font-black ${totalColor}`}>{cleanCurrencyDisplay(totalValue)}</p>
          {refundAmount && (
            <div className="mt-1 flex items-center justify-between text-xs text-rose-500">
              <span className="font-semibold">Refunded Amount</span>
              <span className="font-bold">-{cleanCurrencyDisplay(refundAmount)}</span>
            </div>
          )}
          {refundDeduction && (
            <div className="mt-1 flex items-center justify-between text-xs text-rose-500">
              <span className="font-semibold">Refund Deduction</span>
              <span className="font-bold">-{cleanCurrencyDisplay(refundDeduction)}</span>
            </div>
          )}
          {actualLabel && actualValue && (
            <div className={`mt-1 flex items-center justify-between text-xs ${totalColor}`}>
              <span className="font-semibold">{actualLabel}</span>
              <span className="font-bold">{cleanCurrencyDisplay(actualValue)}</span>
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
                <p className="mt-2 text-[10px] font-medium text-slate-400">Payment Status</p>
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

export interface CustomerPaymentData {
  vendorBaseSubtotal?: string;
  discountAmount?: string;
  itemMarkupPercent?: string;
  itemMarkupAmount?: string;
  merchandiseSubtotal?: string;
  storeTaxPercent?: string;
  storeTax?: string;
  processingFee?: string;
  totalCustomerPaid?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  refundAmount?: string;
  actualRetainedAmount?: string;
}

export interface FoodRemitEarningsData {
  markupPercent?: string;
  markupAmount?: string;
  commissionPercent?: string;
  commissionAmount?: string;
  processingFee?: string;
  totalFoodRemitRevenue?: string;
  cancellationStatus?: string;
  refundDeduction?: string;
  actualRevenue?: string;
}

export interface VendorSettlementData {
  vendorBaseAmount?: string;
  commissionPercent?: string;
  commissionAmount?: string;
  vendorProceeds?: string;
  govtTax?: string;
  totalVendorSettlement?: string;
  settlementStatus?: string;
  refundDeduction?: string;
  actualVendorEarnings?: string;
  inStockItemsCount?: number;
  totalItemsCount?: number;
}

interface OrderFinancialBreakdownProps {
  customerPayment?: CustomerPaymentData;
  foodRemitEarnings?: FoodRemitEarningsData;
  vendorSettlement?: VendorSettlementData;
}

export function OrderFinancialBreakdown({
  customerPayment,
  foodRemitEarnings,
  vendorSettlement,
}: OrderFinancialBreakdownProps) {
  const cp = customerPayment;
  const fr = foodRemitEarnings;
  const vs = vendorSettlement;

  const showDiscount =
    cp?.discountAmount &&
    cp.discountAmount !== "₹0.00" &&
    cp.discountAmount !== "$0.00" &&
    !cp.discountAmount.includes("0.00");

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* STEP 1: Customer Payment */}
      <FinancialCard
        step={1}
        title="Customer Payment"
        icon={<CreditCard className="size-4 text-blue-500" />}
        headerBg="bg-blue-50/40 dark:bg-blue-950/30"
        headerBorder="border-blue-100 dark:border-blue-900/30"
        borderColor="border-blue-100 dark:border-blue-900/30"
        totalLabel="Total Customer Paid"
        totalColor="text-blue-600 dark:text-blue-400"
        totalValue={cp?.totalCustomerPaid || "₹0.00"}
        rows={[
          {
            label: `Item Price (Incl. Markup ${cp?.itemMarkupPercent || "0%"})`,
            value: cp?.merchandiseSubtotal || "₹0.00",
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
            label: `Store Govt Tax (${cp?.storeTaxPercent || "0%"})`,
            value: cp?.storeTax || "₹0.00",
          },
          { label: "Processing Fee", value: cp?.processingFee || "₹0.00" },
        ]}
        refundAmount={cp?.refundAmount}
        actualLabel="Actual Retained Amount"
        actualValue={cp?.actualRetainedAmount}
        paymentMethod={cp?.paymentMethod}
        paymentStatus={cp?.paymentStatus}
      />

      {/* STEP 2: Food Remit Earnings */}
      <FinancialCard
        step={2}
        title="Food Remit Earnings"
        icon={<BarChart3 className="size-4 text-purple-500" />}
        headerBg="bg-purple-50/40 dark:bg-purple-950/30"
        headerBorder="border-purple-100 dark:border-purple-900/30"
        borderColor="border-purple-100 dark:border-purple-900/30"
        totalLabel="Total Food Remit Revenue"
        totalColor="text-purple-600 dark:text-purple-400"
        totalValue={fr?.totalFoodRemitRevenue || "₹0.00"}
        rows={[
          {
            label: `Food Remit Markup (${fr?.markupPercent || "0%"})`,
            value: fr?.markupAmount || "₹0.00",
          },
          {
            label: `Food Remit Commission (${fr?.commissionPercent || "0%"})`,
            value: fr?.commissionAmount || "₹0.00",
          },
          { label: "Processing Fee", value: fr?.processingFee || "₹0.00" },
        ]}
        refundDeduction={fr?.refundDeduction}
        actualLabel="Actual Revenue"
        actualValue={fr?.actualRevenue}
      />

      {/* STEP 3: Vendor Settlement */}
      <FinancialCard
        step={3}
        title="Vendor Settlement"
        icon={<Landmark className="size-4 text-emerald-500" />}
        headerBg="bg-emerald-50/40 dark:bg-emerald-950/30"
        headerBorder="border-emerald-100 dark:border-emerald-900/30"
        borderColor="border-emerald-100 dark:border-emerald-900/30"
        totalLabel="Total Vendor Settlement"
        totalColor="text-emerald-600 dark:text-emerald-400"
        totalValue={vs?.totalVendorSettlement || vs?.vendorProceeds || "₹0.00"}
        rows={[
          {
            label: "Items Count",
            value:
              vs?.inStockItemsCount !== undefined && vs?.totalItemsCount !== undefined
                ? `${vs.inStockItemsCount} of ${vs.totalItemsCount}`
                : "All",
          },
          { label: "Base Price", value: vs?.vendorBaseAmount || "₹0.00" },
          ...(vs?.govtTax
            ? [{ label: `Store Govt Tax (${cp?.storeTaxPercent || "0%"})`, value: vs.govtTax }]
            : []),
          {
            label: `Food Remit Commission (${vs?.commissionPercent || "0%"})`,
            value: vs?.commissionAmount || "₹0.00",
          },
        ]}
        refundDeduction={vs?.refundDeduction}
        actualLabel="Actual Settlement"
        actualValue={vs?.actualVendorEarnings}
      />
    </div>
  );
}
