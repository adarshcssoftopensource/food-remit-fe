import { ArrowDownLeft, ArrowUpRight, CheckCircle2, ShoppingBag } from "lucide-react";

import { Card } from "@/components/ui/card";

import type { CustomerReportDetailData } from "../hooks/use-get-customer-report-detail";

interface CustomerOrderStatCardsProps {
  stats?: CustomerReportDetailData["stats"];
  selectedOrderType: number | undefined;
  onSelectOrderType: (type: number | undefined) => void;
}

export function CustomerOrderStatCards({
  stats,
  selectedOrderType,
  onSelectOrderType,
}: CustomerOrderStatCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card
        onClick={() => onSelectOrderType(undefined)}
        className={`cursor-pointer rounded-2xl border p-4 shadow-2xs transition hover:shadow-xs dark:bg-slate-900 ${
          selectedOrderType === undefined
            ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 dark:border-blue-500/40 dark:bg-blue-950/20"
            : "border-slate-200/80 bg-white dark:border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Orders</p>
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {stats?.totalOrders ?? 0}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <ShoppingBag className="size-5" />
          </div>
        </div>
      </Card>

      <Card
        onClick={() => onSelectOrderType(1)}
        className={`cursor-pointer rounded-2xl border p-4 shadow-2xs transition hover:shadow-xs dark:bg-slate-900 ${
          selectedOrderType === 1
            ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 dark:border-emerald-500/40 dark:bg-emerald-950/20"
            : "border-slate-200/80 bg-white dark:border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Orders Sent</p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {stats?.ordersSent ?? 0}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
            <ArrowUpRight className="size-5" />
          </div>
        </div>
      </Card>

      <Card
        onClick={() => onSelectOrderType(2)}
        className={`cursor-pointer rounded-2xl border p-4 shadow-2xs transition hover:shadow-xs dark:bg-slate-900 ${
          selectedOrderType === 2
            ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 dark:border-amber-500/40 dark:bg-amber-950/20"
            : "border-slate-200/80 bg-white dark:border-slate-800"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Orders Requested
            </p>
            <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {stats?.ordersRequested ?? 0}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
            <ArrowDownLeft className="size-5" />
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Received Orders
            </p>
            <p className="text-2xl font-bold tracking-tight text-violet-600 dark:text-violet-400">
              {stats?.completedOrders ?? 0}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
            <CheckCircle2 className="size-5" />
          </div>
        </div>
      </Card>

      {/* <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Spent</p>
          <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {stats?.totalSpent || "$0.00"}
          </p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <CreditCard className="size-5" />
        </div>
      </div>
    </Card> */}
    </div>
  );
}
