"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/config/routes";
import { DollarSign, ShoppingBag } from "lucide-react";
import { placedOrdersColumns } from "../columns/placed-orders-columns";
import { salesColumns } from "../columns/sales-columns";
import { DashboardActionButton } from "./dashboard-action-button";
import { DashboardCard } from "./dashboard-card";

interface DashboardOrdersSectionsProps {
  dashboardData: any;
  isLoading: boolean;
}

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
                hidePagination={true}
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
  return (
    <div className="flex flex-col gap-6">
      <div className="w-full space-y-6">
        {/* Recently Placed Orders */}
        <DashboardCard
          title="Recently Placed Orders"
          subtitle="Latest processed and paid marketplace orders"
          accentColor="emerald"
          className="min-w-0 overflow-hidden"
          icon={
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
          }
          action={
            <DashboardActionButton href={ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT} label="View All" />
          }
          contentClassName="p-0 overflow-x-auto"
        >
          <div className="w-full min-w-0 overflow-x-auto">
            <DataTable
              columns={placedOrdersColumns}
              data={dashboardData?.recentlyPlacedOrders || []}
              loading={isLoading}
              hidePagination={true}
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
