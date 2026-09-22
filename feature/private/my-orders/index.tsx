"use client";

import { useState } from "react";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { myOrderColumns } from "@/feature/private/order-management/columns/my-order-columns";
import { OrderInfoBanner } from "@/feature/private/order-management/components/order-info-banner";
import { useOrderManagement } from "@/feature/private/order-management/hooks/use-order-management";
import { useWorkflowCounts } from "@/feature/private/order-management/hooks/use-workflow-counts";
import { OrderData } from "@/feature/private/order-management/types/order.types";
import { OrderSectionKey } from "@/constants/order-management";
import { cn } from "@/lib/utils";

const EMPLOYEE_TABS: { label: string; value: OrderSectionKey }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "History", value: "history" },
];

export function OrdersManagementPage() {
  const { profile } = useProfile();
  const welcomeMessage = profile?.name ? `Welcome, ${profile.name}` : undefined;
  const [activeTab, setActiveTab] = useState<OrderSectionKey>("all");

  const { data: counts } = useWorkflowCounts();

  const {
    filteredData,
    fromDate,
    setFromDate,
    setToDate,
    toDate,
    searchQuery,
    setSearchQuery,
    setSorting,
    page,
    setPage,
    limit,
    setLimit,
    pagination,
    isLoading,
    applyFilters,
    cancelFilters,
    clearFilters,
    hasFilters,
  } = useOrderManagement(activeTab);

  const activeFilterCount = fromDate || toDate ? 1 : 0;

  const tabCounts: Record<string, number | undefined> = {
    all: counts?.all,
    pending: counts?.pending,
    processing: counts?.processing,
    completed: counts?.completed,
    history: counts?.history,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Orders"
        welcomeMessage={welcomeMessage}
        description="Start pending store orders, prepare them, then mark ready for pickup."
      />

      <ModuleFilters
        title="Filter Orders"
        description="Filter your orders by date range"
        hideCountryFilter
        hideCityFilter
        hasFilters={hasFilters || Boolean(fromDate || toDate)}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
        onCancelFilters={cancelFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-75 flex-1">
          <DateRangeFilter
            fromLabel="From"
            toLabel="To"
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            maxDate={new Date()}
          />
        </div>
      </ModuleFilters>

      <OrderInfoBanner variant="employee-start" />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderSectionKey)}>
        <div className="overflow-x-auto">
          <TabsList className="inline-flex h-11 gap-1 rounded-full bg-slate-100/90 p-1 shadow-inner">
            {EMPLOYEE_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-slate-600 data-active:bg-emerald-600 data-active:text-white data-active:shadow-md"
              >
                {tab.label}
                {typeof tabCounts[tab.value] === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      activeTab === tab.value
                        ? "bg-white/25 text-white"
                        : "bg-slate-200 text-slate-600",
                    )}
                  >
                    {tabCounts[tab.value]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {EMPLOYEE_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4 border-0 p-0">
            <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  {tab.label === "All" ? "Store Orders" : tab.label}
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({pagination?.total || 0})
                  </span>
                </CardTitle>
                <p className="text-xs text-slate-500">
                  {tab.value === "pending"
                    ? "Paid orders waiting to be started — tap Start Order to claim one."
                    : tab.value === "processing"
                      ? "Orders you are preparing. Mark Completed when ready for pickup."
                      : tab.value === "completed"
                        ? "Ready for pickup — verify reference to mark Picked Up."
                        : tab.value === "history"
                          ? "Closed orders (Picked Up or Abandoned)."
                          : "Your active store queue."}
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <DataTable
                  columns={myOrderColumns}
                  data={filteredData}
                  searchKey="id"
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  currentPage={page}
                  totalPages={pagination?.totalPages || 1}
                  rowsPerPage={limit}
                  onPageChange={setPage}
                  onRowsPerPageChange={setLimit}
                  onSortingChange={setSorting}
                  loading={isLoading}
                  manualSorting
                  manualFiltering
                  getRowId={(row: OrderData) => row.id}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
