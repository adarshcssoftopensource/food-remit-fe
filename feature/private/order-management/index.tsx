"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ORDER_SECTION_META,
  ORDER_TABS,
  type OrderSectionKey,
  normalizeOrderTab,
} from "@/constants/order-management";
import { historyOrderColumns, orderColumns } from "./columns/order-columns";
import { useOrderManagement } from "./hooks/use-order-management";
import { useWorkflowCounts } from "./hooks/use-workflow-counts";
import { useProfile } from "@/components/providers/profile-provider";
import { WorkflowSummaryCards } from "./components/workflow-summary-cards";
import { OrderInfoBanner } from "./components/order-info-banner";
import { HistorySubFilter } from "./utils/order-workflow";
import { OrderData } from "./types/order.types";
import { cn } from "@/lib/utils";

export function OrdersManagementPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab = normalizeOrderTab(tabParam);

  const [activeTab, setActiveTab] = useState<OrderSectionKey>(initialTab);
  const [historyFilter, setHistoryFilter] = useState<HistorySubFilter>("all");

  const { profile } = useProfile();
  const isStoreManager =
    profile?.role === "STORE_MANAGER" ||
    profile?.roleCode === "STORE_MANAGER" ||
    profile?.role === "store_manager";

  const { data: counts } = useWorkflowCounts();

  const {
    applyFilters,
    cancelFilters,
    clearFilters,
    country,
    city,
    filteredData,
    fromDate,
    hasFilters,
    setCountry,
    setCity,
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
  } = useOrderManagement(activeTab, historyFilter);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "All" && country !== "all") count++;
    if (city && city !== "All" && city !== "all") count++;
    return count;
  }, [fromDate, toDate, country, city]);

  const tabCounts: Record<string, number | undefined> = {
    all: counts?.all,
    pending: counts?.pending,
    processing: counts?.processing,
    completed: counts?.completed,
    history: counts?.history,
  };

  const bannerVariant =
    activeTab === "history"
      ? "history"
      : activeTab === "processing"
        ? "processing"
        : isStoreManager
          ? "manager-assign"
          : "employee-start";

  const columns = activeTab === "history" ? historyOrderColumns : orderColumns;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="View and handle incoming store orders. Start preparing orders and update their status."
      />

      <ModuleFilters
        title="Filter Orders"
        description="Filter orders by date range, country, and city"
        countryId={country === "All" ? "all" : country}
        onCountryChange={(val) => setCountry(val === "all" ? "All" : val)}
        cityId={city === "All" ? "all" : city}
        onCityChange={(val) => setCity(val === "all" ? "All" : val)}
        hasFilters={hasFilters}
        onClearFilters={clearFilters}
        onApplyFilters={applyFilters}
        onCancelFilters={cancelFilters}
        activeFilterCount={activeFilterCount}
      >
        <div className="min-w-70 flex-1 sm:min-w-[320px]">
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            maxDate={new Date()}
          />
        </div>
      </ModuleFilters>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as OrderSectionKey);
          if (v !== "history") setHistoryFilter("all");
        }}
      >
        <div className="overflow-x-auto pb-1">
          <TabsList className="inline-flex h-11 w-auto items-center justify-start gap-1 rounded-full bg-slate-100/80 p-1 px-1.5 shadow-inner dark:bg-slate-800/50">
            {ORDER_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-medium whitespace-nowrap text-slate-600 transition-all hover:text-slate-900 data-active:shadow-md dark:text-slate-400 dark:hover:text-slate-100"
              >
                {tab.label}
                {typeof tabCounts[tab.value] === "number" && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                      activeTab === tab.value
                        ? "bg-white/20 text-inherit"
                        : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
                    )}
                  >
                    {tabCounts[tab.value]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {activeTab !== "history" && (
          <div className="mt-4">
            <WorkflowSummaryCards counts={counts} activeTab={activeTab} onSelect={setActiveTab} />
          </div>
        )}

        {activeTab === "history" && counts && (
          <div className="mt-4 space-y-4">
            <OrderHistoryFlowDiagram />
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: "all", label: "All History", count: counts.history },
                  { key: "picked-up", label: "Picked Up", count: counts.pickedUp },
                  { key: "abandoned", label: "Abandoned", count: counts.abandoned },
                ] as const
              ).map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setHistoryFilter(f.key)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                    historyFilter === f.key
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <OrderInfoBanner variant={bannerVariant} />
        </div>

        {ORDER_TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="m-0 mt-4 border-0 p-0">
            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {ORDER_SECTION_META[tab.value].title}
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    ({pagination?.total || 0})
                  </span>
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  {ORDER_SECTION_META[tab.value].description}
                </p>
              </CardHeader>
              <CardContent className="p-4">
                <DataTable
                  columns={columns}
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

function OrderHistoryFlowDiagram() {
  const stages = [
    {
      label: "Processing",
      sub: "Being prepared",
      color: "border-blue-300 bg-blue-50 text-blue-700",
    },
    {
      label: "Completed",
      sub: "Ready for pickup",
      color: "border-emerald-300 bg-emerald-50 text-emerald-700",
    },
    {
      label: "Picked Up",
      sub: "Collected by customer",
      color: "border-emerald-300 bg-emerald-50 text-emerald-700",
    },
    { label: "Abandoned", sub: "Not collected", color: "border-red-300 bg-red-50 text-red-700" },
    {
      label: "Closed",
      sub: "Moved to history",
      color: "border-slate-300 bg-slate-100 text-slate-600",
    },
  ];

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        Order lifecycle (after preparation)
      </p>
      <div className="flex min-w-[640px] items-stretch gap-2">
        {stages.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center gap-2">
            <div className={`flex-1 rounded-xl border px-3 py-2 ${s.color}`}>
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="text-[11px] opacity-80">{s.sub}</p>
            </div>
            {i < stages.length - 1 && (
              <span className="text-slate-300" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        Completed → Picked Up → Closed &nbsp;|&nbsp; Completed → Abandoned → Closed
      </p>
    </div>
  );
}
