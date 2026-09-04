"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES } from "@/config/routes";
import { getInitials } from "@/lib/get-initials";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Clock, DollarSign, HandPlatter, ShoppingBag } from "lucide-react";
import { useGetDashboardStats } from "../hooks/use-get-dashboard-stats";
import { placedOrdersColumns } from "./columns/placed-orders-columns";
import { DashboardStatCard } from "./common/dashboard-stat-card";
import { DashboardActionButton, DashboardCard, DashboardErrorState } from "./index";

interface SalesOrder {
  id: string;
  referenceNumber: string;
  customerName: string;
  date: string;
  orderAmount: string;
}

const salesColumns: ColumnDef<SalesOrder>[] = [
  {
    accessorKey: "referenceNumber",
    header: "Reference Number",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
        {row.getValue("referenceNumber")}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Sender Name",
    cell: ({ row }) => {
      const name: string = row.getValue("customerName") || "Customer";
      const initials = getInitials(name);
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            {initials}
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {row.getValue("date") || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "orderAmount",
    header: "Order Amount",
    cell: ({ row }) => (
      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
        {row.getValue("orderAmount")}
      </div>
    ),
  },
];

export function StoreManagerDashboard() {
  const { profile } = useProfile();
  const { dashboardData: rawData, isLoading, isError, error, refetch } = useGetDashboardStats();
  const dashboardData = rawData as any; // Cast to bypass type errors for new structure

  const welcomeMessage = profile?.name ? `Welcome, ${profile.name}` : undefined;

  const topCards = [
    {
      title: "Total Pending Orders",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: Clock,
      accentColor: "amber" as const,
      iconBgClassName: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      mainValue: dashboardData?.totalPendingOrders?.total ?? 0,
      subStats: [
        { label: "Today", value: dashboardData?.totalPendingOrders?.today ?? 0 },
        { label: "This Week", value: dashboardData?.totalPendingOrders?.thisWeek ?? 0 },
      ],
    },
    {
      title: "Total Requested Orders",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: HandPlatter,
      accentColor: "cyan" as const,
      iconBgClassName: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400",
      mainValue: dashboardData?.totalRequestedOrders?.total ?? 0,
      subStats: [
        { label: "Today", value: dashboardData?.totalRequestedOrders?.today ?? 0 },
        { label: "This Week", value: dashboardData?.totalRequestedOrders?.thisWeek ?? 0 },
      ],
    },
    {
      title: "Total Orders Completed",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: CheckCircle2,
      accentColor: "emerald" as const,
      iconBgClassName:
        "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      mainValue: dashboardData?.totalOrdersCompleted?.total ?? 0,
      subStats: [
        { label: "Today", value: dashboardData?.totalOrdersCompleted?.today ?? 0 },
        { label: "This Week", value: dashboardData?.totalOrdersCompleted?.thisWeek ?? 0 },
      ],
    },
    {
      title: "Total Earning",
      href: ROUTES.ADMIN.ORDER_MANAGEMENT.ROOT,
      icon: DollarSign,
      accentColor: "indigo" as const,
      iconBgClassName:
        "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
      mainValue: dashboardData?.totalEarnings?.total ?? "0.00",
      mainLabel: "All Time",
      subStats: [
        { label: "Today", value: dashboardData?.totalEarnings?.today ?? "0.00" },
        { label: "This Week", value: dashboardData?.totalEarnings?.thisWeek ?? "0.00" },
      ],
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-8rem)] space-y-6">
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Store Overview"
          description="Real-time performance analytics and metrics for your assigned stores."
          welcomeMessage={welcomeMessage}
        />
      </div>

      {isError && (
        <DashboardErrorState
          message={(error as Error)?.message || "Unable to fetch the latest dashboard statistics."}
          onRetry={() => refetch()}
        />
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {topCards.map((card) => (
          <DashboardStatCard key={card.title} {...card} isLoading={isLoading} />
        ))}
      </div>

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
            {dashboardData?.sales && dashboardData.sales.length > 0 ? (
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
                  <TabsContent
                    key={day.tabLabel}
                    value={day.tabLabel}
                    className="mt-0 outline-none"
                  >
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
            ) : (
              <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                {isLoading ? "Loading sales data..." : "No sales data available for this week."}
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
