"use client";

import { useMemo, useState } from "react";
import { DataTable } from "@/components/common/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/config/routes";
import {
  DollarSign,
  ShoppingBag,
  Search,
  X,
  CheckCircle2,
  Clock,
  HandPlatter,
  AlertOctagon,
} from "lucide-react";
import { placedOrdersColumns } from "../columns/placed-orders-columns";
import { salesColumns } from "../columns/sales-columns";
import { DashboardActionButton } from "./dashboard-action-button";
import { DashboardCard } from "./dashboard-card";
import { Input } from "@/components/ui/input";

interface DashboardOrdersSectionsProps {
  dashboardData: any;
  isLoading: boolean;
}

type StatusFilterType = "all" | "closed" | "pending" | "requested" | "abandoned";

function DashboardSalesContent({ dashboardData, isLoading }: DashboardOrdersSectionsProps) {
  if (dashboardData?.sales && dashboardData.sales.length > 0) {
    return (
      <Tabs defaultValue={dashboardData.sales[0].tabLabel} className="w-full">
        <TabsList className="mb-4 flex w-full justify-start overflow-x-auto bg-slate-100/50 p-1 dark:bg-slate-800/50">
          {dashboardData.sales.map((day: any) => (
            <TabsTrigger
              key={day.tabLabel}
              value={day.tabLabel}
              className="min-w-20 rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-indigo-400"
            >
              {day.tabLabel}
            </TabsTrigger>
          ))}
        </TabsList>
        {dashboardData.sales.map((day: any) => (
          <TabsContent key={day.tabLabel} value={day.tabLabel} className="mt-0 outline-none">
            <div className="mb-4 flex items-center justify-between rounded-xl bg-indigo-50/50 px-4 py-3 dark:bg-indigo-900/10">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Amount for {day.dateStr}
              </span>
              <span className="text-lg font-bold text-indigo-700 dark:text-indigo-400">
                {day.formattedTotalAmount || day.totalAmount}
              </span>
            </div>
            <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <DataTable
                columns={salesColumns}
                data={day.orders || []}
                loading={isLoading}
                hidePagination={day.orders?.length <= 10}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  return (
    <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
      {isLoading ? "Loading sales data..." : "No sales data available for this week."}
    </div>
  );
}

export function DashboardOrdersSections({
  dashboardData,
  isLoading,
}: DashboardOrdersSectionsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all");

  const rawOrders: any[] = useMemo(() => {
    return dashboardData?.recentlyPlacedOrders || [];
  }, [dashboardData]);

  // Compute status counts for filter badges
  const counts = useMemo(() => {
    let closed = 0;
    let pending = 0;
    let requested = 0;
    let abandoned = 0;

    for (const order of rawOrders) {
      const s = (order.status || "").toLowerCase();
      if (
        s.includes("closed") ||
        s.includes("completed") ||
        s.includes("ready") ||
        s.includes("accepted")
      ) {
        closed++;
      } else if (s.includes("abandoned") || s.includes("rejected") || s.includes("cancelled")) {
        abandoned++;
      } else if (s.includes("requested")) {
        requested++;
      } else {
        pending++;
      }
    }

    return {
      all: rawOrders.length,
      closed,
      pending,
      requested,
      abandoned,
    };
  }, [rawOrders]);

  // Filtered orders with search and status filter
  const filteredOrders = useMemo(() => {
    return rawOrders.filter((order) => {
      // 1. Status filter
      if (statusFilter !== "all") {
        const s = (order.status || "").toLowerCase();
        if (
          statusFilter === "closed" &&
          !(
            s.includes("closed") ||
            s.includes("completed") ||
            s.includes("ready") ||
            s.includes("accepted")
          )
        ) {
          return false;
        }
        if (
          statusFilter === "pending" &&
          (s.includes("closed") ||
            s.includes("completed") ||
            s.includes("abandoned") ||
            s.includes("rejected") ||
            s.includes("cancelled") ||
            s.includes("requested"))
        ) {
          return false;
        }
        if (statusFilter === "requested" && !s.includes("requested")) {
          return false;
        }
        if (
          statusFilter === "abandoned" &&
          !(s.includes("abandoned") || s.includes("rejected") || s.includes("cancelled"))
        ) {
          return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const ref = (order.referenceNumber || order.id || "").toLowerCase();
        const customer = (order.customerName || "").toLowerCase();
        const location = (order.location || "").toLowerCase();
        const status = (order.status || "").toLowerCase();
        const price = (order.price || "").toLowerCase();

        return (
          ref.includes(q) ||
          customer.includes(q) ||
          location.includes(q) ||
          status.includes(q) ||
          price.includes(q)
        );
      }

      return true;
    });
  }, [rawOrders, statusFilter, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full space-y-6">
        {/* Recently Placed Orders */}
        <DashboardCard
          title="Recently Placed Orders"
          subtitle="Real-time order feed with quick filter and search capabilities"
          accentColor="emerald"
          className="min-w-0 overflow-hidden"
          icon={
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
          }
          action={
            <DashboardActionButton
              href={ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT}
              label="View Full Management"
            />
          }
          contentClassName="p-0 overflow-hidden flex flex-col"
        >
          {/* Search & Status Filter Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800 dark:bg-slate-900/40">
            {/* Quick Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === "all"
                    ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <span>All Orders</span>
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] ${statusFilter === "all" ? "bg-slate-700 text-white dark:bg-slate-200 dark:text-slate-900" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"}`}
                >
                  {counts.all}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("closed")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === "closed"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <CheckCircle2 className="size-3" />
                <span>Closed / Paid</span>
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] ${statusFilter === "closed" ? "bg-emerald-700 text-white" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"}`}
                >
                  {counts.closed}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === "pending"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <Clock className="size-3" />
                <span>Pending</span>
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] ${statusFilter === "pending" ? "bg-amber-700 text-white" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400"}`}
                >
                  {counts.pending}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("requested")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === "requested"
                    ? "bg-cyan-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <HandPlatter className="size-3" />
                <span>Requested</span>
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] ${statusFilter === "requested" ? "bg-cyan-700 text-white" : "bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-400"}`}
                >
                  {counts.requested}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("abandoned")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  statusFilter === "abandoned"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                <AlertOctagon className="size-3" />
                <span>Abandoned</span>
                <span
                  className={`py-0.2 rounded-full px-1.5 text-[10px] ${statusFilter === "abandoned" ? "bg-rose-700 text-white" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400"}`}
                >
                  {counts.abandoned}
                </span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs lg:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search orders, customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8.5 rounded-lg border-slate-200 bg-white pr-8 pl-8.5 text-xs dark:border-slate-800 dark:bg-slate-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Orders Table with Responsive Scroll & Pagination */}
          <div className="w-full min-w-0 overflow-x-auto">
            <DataTable
              columns={placedOrdersColumns}
              data={filteredOrders}
              loading={isLoading}
              hidePagination={true}
              emptyMessage={
                searchQuery || statusFilter !== "all"
                  ? "No orders match the selected filter criteria."
                  : "No placed orders found for your store."
              }
            />
          </div>
        </DashboardCard>

        {/* Sales Tab Section */}
        <DashboardCard
          title="Sales"
          subtitle="Daily completed sales and order breakdown"
          accentColor="indigo"
          className="min-w-0 overflow-hidden"
          icon={
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          }
          contentClassName="p-4"
        >
          <DashboardSalesContent dashboardData={dashboardData} isLoading={isLoading} />
        </DashboardCard>
      </div>
    </div>
  );
}
