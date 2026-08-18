"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { orderColumns } from "./components/columns/columns";
import { DataTablesSection } from "./components/data-tables-section";
import { FinancialStats } from "./components/financial-stats";
import { ManagementStats } from "./components/management-stats";
import { MonthlyRevenue } from "./components/monthly-revenue";
import { OverviewStats } from "./components/overview-stats";
import { SalesOverview } from "./components/sales-overview";
import { StoreListings } from "./components/store-listings";
import { TrendingOrders } from "./components/trending-orders";
import { useGetDashboardStats } from "./hooks/use-get-dashboard-stats";

export function Dashboard() {
  const { dashboardData, isLoading } = useGetDashboardStats();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Overview of your platform's performance and recent activities."
      />

      <div className="space-y-6">
        <OverviewStats stats={dashboardData.overviewStats} isLoading={isLoading} />

        <ManagementStats stats={dashboardData.managementStats} isLoading={isLoading} />

        <div className="grid gap-6 lg:grid-cols-2">
          <FinancialStats stats={dashboardData.financialStats} isLoading={isLoading} />
          <SalesOverview stats={dashboardData.salesOverview} isLoading={isLoading} />
        </div>

        <DataTablesSection
          recentOrdersRequested={dashboardData.recentOrdersRequested}
          recentTickets={dashboardData.recentTickets}
          isLoading={isLoading}
        />

        <TrendingOrders orders={dashboardData.trendingOrders} isLoading={isLoading} />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="col-span-full overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <CardTitle className="text-sm font-bold tracking-wider text-slate-800 uppercase">
                Recently Placed Orders
              </CardTitle>
              <Button asChild size="sm" className="h-8 rounded-full px-5 text-xs font-semibold">
                <Link href="/order-management/completed-orders">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="bg-white p-4">
              <DataTable
                columns={orderColumns}
                data={dashboardData.recentlyPlacedOrders}
                loading={isLoading}
                hidePagination={true}
              />
            </CardContent>
          </Card>

          <div className="col-span-full lg:col-span-1">
            <MonthlyRevenue />
          </div>
        </div>

        <StoreListings
          stores={dashboardData.storesSummary.newStoreListings}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
