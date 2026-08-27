"use client";

import { DataTable } from "@/components/common/data-table/data-table";
import { DateRangeFilter } from "@/components/common/filters/date-range-filter";
import { ModuleFilters } from "@/components/common/filters/module-filters";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderColumns } from "@/feature/private/order-management/columns/order-columns";
import { useOrderManagement } from "@/feature/private/order-management/hooks/use-order-management";

export function OrdersManagementPage() {
  const { profile } = useProfile();
  const welcomeMessage = profile?.name ? `Welcome, ${profile.name}` : undefined;

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
    clearFilters,
  } = useOrderManagement("history");

  return (
    <div className="space-y-6">
      <PageHeader title="My Orders" welcomeMessage={welcomeMessage} />

      <ModuleFilters
        title="Filter Orders"
        description="Filter your orders by specific date ranges"
        hideCountryFilter
        hideCityFilter
        hasFilters={Boolean(fromDate || toDate)}
        onClearFilters={clearFilters}
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

      <div className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6 dark:bg-slate-900">
        <Card className="rounded-2xl border-0 bg-transparent shadow-none">
          <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Store Orders
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
      </div>
    </div>
  );
}
