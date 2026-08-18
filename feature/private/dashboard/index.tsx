"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
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
import { DASHBOARD_ROUTES } from "./constants/dashboard.constants";
import { useDashboardFilters } from "./hooks/use-dashboard-filters";
import { useGetDashboardStats } from "./hooks/use-get-dashboard-stats";

export function Dashboard() {
  const { filters, hasFilters, activeFilterCount, setCountryId, setCityId, resetFilters } =
    useDashboardFilters();
  const { dashboardData, isLoading, isFetching, isError, error, refetch } =
    useGetDashboardStats(filters);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      {/* Subtle modern background ambient layers */}
      <div className="bg-primary/4 pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-indigo-500/4 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-emerald-500/3 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Dashboard Overview"
          description="Real-time performance analytics, logistics dispatch, and regional management metrics."
        />
      </div>

      {/* Filter Toolbar */}
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

      {/* Error state */}
      {isError && (
        <DashboardErrorState
          message={
            (error as Error)?.message ||
            "Unable to fetch the latest dashboard statistics. Please check your network connection and retry."
          }
          onRetry={() => refetch()}
        />
      )}

      {/* Main Dashboard Grid */}
      <div className="relative max-w-full min-w-0 space-y-6">
        {/* KPI Overview (Food Sent, Food Requested, Registered Users) */}
        <OverviewStats stats={dashboardData.overviewStats} isLoading={isLoading} />

        {/* Management Counts (Country, City, Store Managers, Sub-Admins, Employees) */}
        <ManagementStats stats={dashboardData.managementStats} isLoading={isLoading} />

        {/* Financial and Sales Overview */}
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">
          <FinancialStats stats={dashboardData.financialStats} isLoading={isLoading} />
          <SalesOverview stats={dashboardData.salesOverview} isLoading={isLoading} />
        </div>

        {/* Recent Requested Orders & Support Tickets */}
        <DataTablesSection
          recentOrdersRequested={dashboardData.recentOrdersRequested}
          recentTickets={dashboardData.recentTickets}
          isLoading={isLoading}
        />

        {/* Trending Items / Orders */}
        <TrendingOrders orders={dashboardData.trendingOrders} isLoading={isLoading} />

        {/* Recently Placed Orders & Monthly Revenue */}
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

        {/* New Store Listings */}
        <StoreListings
          stores={dashboardData.storesSummary?.newStoreListings}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
