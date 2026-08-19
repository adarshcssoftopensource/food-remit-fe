"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { DASHBOARD_ROUTES } from "@/constants/dashboard";
import { ShoppingBag } from "lucide-react";
import {
  DashboardActionButton,
  DashboardCard,
  DashboardErrorState,
  DashboardFilters,
  DataTablesSection,
  FinancialStats,
  ManagementStats,
  MonthlyRevenue,
  OverviewStats,
  placedOrdersColumns,
  SalesOverview,
  StoreListings,
  TrendingOrders,
} from "./components";
import { useDashboardFilters } from "./hooks/use-dashboard-filters";
import { useGetDashboardStats } from "./hooks/use-get-dashboard-stats";

export function Dashboard() {
  const { filters, hasFilters, activeFilterCount, setCountryId, setCityId, resetFilters } =
    useDashboardFilters();

  const { dashboardData, isLoading, isFetching, isError, error, refetch } =
    useGetDashboardStats(filters);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Dashboard Overview"
          description="Real-time performance analytics, logistics dispatch, and regional management metrics."
        />
      </div>

      <DashboardFilters
        filters={filters}
        hasFilters={hasFilters}
        activeFilterCount={activeFilterCount}
        onCountryChange={setCountryId}
        onCityChange={setCityId}
        onReset={resetFilters}
        onRefresh={() => refetch()}
        isFetching={isFetching}
      />

      {isError && (
        <DashboardErrorState
          message={
            (error as Error)?.message ||
            "Unable to fetch the latest dashboard statistics. Please check your network connection and retry."
          }
          onRetry={() => refetch()}
        />
      )}

      <div className="relative max-w-full min-w-0 space-y-6">
        <OverviewStats stats={dashboardData.overviewStats} isLoading={isLoading} />
        <ManagementStats stats={dashboardData.managementStats} isLoading={isLoading} />

        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
          <FinancialStats stats={dashboardData.financialStats} isLoading={isLoading} />
          <SalesOverview stats={dashboardData.salesOverview} isLoading={isLoading} />
        </div>

        <DataTablesSection
          recentOrdersRequested={dashboardData.recentOrdersRequested}
          recentTickets={dashboardData.recentTickets}
          isLoading={isLoading}
        />

        <TrendingOrders orders={dashboardData.trendingOrders} isLoading={isLoading} />

        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-full min-w-0 lg:col-span-2">
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
                <DashboardActionButton href={DASHBOARD_ROUTES.COMPLETED_ORDERS} label="View All" />
              }
              contentClassName="p-0 overflow-x-auto"
            >
              <div className="w-full min-w-0 overflow-x-auto">
                <DataTable
                  columns={placedOrdersColumns}
                  data={dashboardData.recentlyPlacedOrders}
                  loading={isLoading}
                  hidePagination={true}
                />
              </div>
            </DashboardCard>
          </div>

          <div className="col-span-full min-w-0 lg:col-span-1">
            <MonthlyRevenue isLoading={isLoading} />
          </div>
        </div>

        <StoreListings
          stores={dashboardData.storesSummary?.newStoreListings}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
