"use client";

import { useSyncExternalStore } from "react";
import {
  ArrowLeft,
  BadgeDollarSign,
  Calendar,
  CreditCard,
  Receipt,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  Store,
  UserX,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { VendorSettlementData } from "./order-financial-breakdown";
import type { OrderDetailResponse } from "./order-report-detail.types";
import { OrderStatusBadge } from "./order-status-badge";

const subscribeNoop = () => () => {};

function OrderDateText({ orderDate }: { orderDate: string }) {
  const formatted = useSyncExternalStore(
    subscribeNoop,
    () => new Date(orderDate).toLocaleString(),
    () => "",
  );
  return <>{formatted}</>;
}

interface OrderReportErrorProps {
  error: unknown;
  onBack: () => void;
  onRetry: () => void;
}

export function OrderReportError({ error, onBack, onRetry }: OrderReportErrorProps) {
  return (
    <div className="space-y-6">
      <Button variant="outline" size="sm" onClick={onBack} className="gap-2 rounded-xl">
        <ArrowLeft className="size-4" /> Back to Orders
      </Button>
      <Card className="rounded-2xl border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/50">
          <UserX className="size-6 text-rose-600 dark:text-rose-400" />
        </div>
        <h3 className="mt-4 text-lg font-bold text-rose-900 dark:text-rose-200">
          Failed to Load Order Details
        </h3>
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
          {(error as Error)?.message || "Order information could not be retrieved."}
        </p>
        <Button
          onClick={onRetry}
          className="mt-4 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
        >
          Retry Loading
        </Button>
      </Card>
    </div>
  );
}

interface OrderReportHeaderProps {
  order: OrderDetailResponse["order"];
  storeName: string;
  vendorSettlement?: VendorSettlementData;
  isRefundPending: boolean;
  isRefundSuccess: boolean;
  onRefund: () => void;
  onBack: () => void;
}

export function OrderReportHeader({
  order,
  storeName,
  vendorSettlement,
  isRefundPending,
  isRefundSuccess,
  onRefund,
  onBack,
}: OrderReportHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          aria-label="Back to orders"
          className="size-9 rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="size-4 text-slate-700 dark:text-slate-300" />
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Order #{order.refrenceNumber}
            </h1>
            <OrderStatusBadge status={order.orderStatus} label={order.statusLabel} />
          </div>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
            <Calendar className="size-3.5" /> Ordered on{" "}
            <OrderDateText orderDate={order.orderDate} />
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Process Refund button — only for partial orders with pending refund */}
        {(order.orderStatus === 9 || order.orderStatus === 5) &&
          vendorSettlement?.customerRefundTotal &&
          !isRefundSuccess && (
            <Button
              id="btn-process-partial-refund"
              size="sm"
              onClick={onRefund}
              disabled={isRefundPending}
              className="h-8 gap-2 rounded-xl bg-rose-600 px-3 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
            >
              {isRefundPending ? (
                <RefreshCw className="size-3.5 animate-spin" />
              ) : (
                <RotateCcw className="size-3.5" />
              )}
              {isRefundPending
                ? "Processing..."
                : `Process Refund ${vendorSettlement.customerRefundTotal}`}
            </Button>
          )}
        <Badge
          variant="outline"
          className="rounded-xl border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300"
        >
          <Store className="mr-1 size-3.5" /> {storeName}
        </Badge>
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20 rounded-xl px-3 py-1.5 text-xs font-bold"
        >
          <ShoppingBag className="mr-1 size-3.5" /> {order.foodType}
        </Badge>
      </div>
    </div>
  );
}

interface OrderReportSummaryCardsProps {
  canViewPlatformFees: boolean;
  totalDisplay: string;
  paymentMode: string;
  markupDisplay: string;
  processingFeeDisplay: string;
  itemTaxDisplay: string;
  refundedDisplay: string;
  isRefunded: boolean;
  currencySymbol: string;
  orderStatus: number;
}

export function OrderReportSummaryCards({
  canViewPlatformFees,
  totalDisplay,
  paymentMode,
  markupDisplay,
  processingFeeDisplay,
  itemTaxDisplay,
  refundedDisplay,
  isRefunded,
  currencySymbol,
  orderStatus,
}: OrderReportSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <Card className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-xs dark:bg-emerald-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              Total Transaction
            </p>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <CreditCard className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
            {totalDisplay}
          </h3>
          <p className="text-muted-foreground mt-0.5 truncate text-[11px]">{paymentMode}</p>
        </CardContent>
      </Card>

      {canViewPlatformFees && (
        <>
          <Card className="overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-500/5 shadow-xs dark:bg-purple-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                  Markup
                </p>
                <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <BadgeDollarSign className="size-4" />
                </div>
              </div>
              <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
                {markupDisplay}
              </h3>
              <p className="text-muted-foreground mt-0.5 truncate text-[11px]">Food Remit Share</p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-xs dark:bg-blue-950/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                  Processing Fee
                </p>
                <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                  <Receipt className="size-4" />
                </div>
              </div>
              <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
                {processingFeeDisplay}
              </h3>
              <p className="text-muted-foreground mt-0.5 truncate text-[11px]">Platform Fee</p>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 shadow-xs dark:bg-indigo-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
              Store Govt Tax
            </p>
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Receipt className="size-4" />
            </div>
          </div>
          <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
            {itemTaxDisplay}
          </h3>
          <p className="text-muted-foreground mt-0.5 truncate text-[11px]">Govt Store Tax</p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 shadow-xs dark:bg-rose-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
              Refunded Amount
            </p>
            <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <RotateCcw className="size-4" />
            </div>
          </div>
          <h3
            className={`mt-2 truncate text-xl font-black ${isRefunded ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}
          >
            {isRefunded ? `-${refundedDisplay}` : `${currencySymbol}0.00`}
          </h3>
          <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
            {orderStatus === 0 || orderStatus === 7
              ? "Order Cancelled / Refunded"
              : isRefunded
                ? "Partial Refund"
                : "No Refund"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
