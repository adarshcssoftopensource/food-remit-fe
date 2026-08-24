"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ORDER_SECTION_META, ORDER_TABS, type OrderSectionKey } from "@/constants/order-management";
import { orderColumns } from "./columns/order-columns";
import { useOrderManagement } from "./hooks/use-order-management";

export function OrdersManagementPage() {
  const [activeTab, setActiveTab] = useState<OrderSectionKey>("sent-orders");

  const {
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
  } = useOrderManagement(activeTab);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (fromDate || toDate) count++;
    if (country && country !== "All" && country !== "all") count++;
    if (city && city !== "All" && city !== "all") count++;
    return count;
  }, [fromDate, toDate, country, city]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders Management"
        description="Review and manage all order types across the platform."
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

      <div className="rounded-2xl border p-4 shadow-sm sm:p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderSectionKey)}>
          <div className="mb-8 overflow-x-auto pb-2">
            <TabsList className="inline-flex h-11 w-auto items-center justify-start gap-1 rounded-full bg-slate-100/80 p-1 px-1.5 shadow-inner dark:bg-slate-800/50">
              {ORDER_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-active:bg-primary data-active:text-primary-foreground hover:data-active:text-primary-foreground inline-flex h-8 items-center justify-center rounded-full px-5 text-sm font-medium whitespace-nowrap text-slate-600 transition-all hover:text-slate-900 data-active:shadow-md dark:text-slate-400 dark:hover:text-slate-100"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {ORDER_TABS.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="m-0 border-0 p-0">
              <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
                <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        {ORDER_SECTION_META[tab.value].title}
                      </CardTitle>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {pagination?.total || 0} order{pagination?.total !== 1 ? "s" : ""} found
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <DataTable
                    columns={orderColumns}
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
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
