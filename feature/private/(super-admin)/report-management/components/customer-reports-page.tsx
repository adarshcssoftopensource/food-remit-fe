"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FileSpreadsheet, TableProperties } from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REPORT_SECTION_META } from "@/constants/report-management";
import { exportToExcel } from "@/lib/export-excel";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { customerReportColumns } from "../columns/customer-report-columns";
import { ReportDateFilters } from "./report-date-filters";
import { useCustomerReport } from "../hooks/use-customer-report";

function ExportButton({ onClick, isLoading }: { onClick?: () => void; isLoading?: boolean }) {
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      isLoading={isLoading}
      className="h-9 gap-2 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
    >
      <FileSpreadsheet className="size-4" />
      <span>Export Excel</span>
    </Button>
  );
}

export function CustomerReportsPage() {
  const meta = REPORT_SECTION_META["customer-report"];
  const [isExporting, setIsExporting] = useState(false);

  const {
    applyFilters,
    cancelFilters,
    clearFilters,
    country,
    filteredData,
    fromDate,
    hasFilters,
    isLoading,
    page,
    pageSize,
    pagination,
    search,
    setCountry,
    setFromDate,
    setPage,
    setPageSize,
    setSearch,
    setSortBy,
    setSortOrder,
    sortBy,
    sortOrder,
    setToDate,
    toDate,
  } = useCustomerReport();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const fromDateStr = fromDate ? format(fromDate, "yyyy-MM-dd") : undefined;
      const toDateStr = toDate ? format(toDate, "yyyy-MM-dd") : undefined;

      const { data } = await apiClient.get(REPORT_ENDPOINTS.EXPORT_CUSTOMER_REPORTS, {
        params: {
          page,
          limit: pageSize,
          search: search.trim() || undefined,
          country: country === "All" || country === "all" ? undefined : country,
          fromDate: fromDateStr,
          toDate: toDateStr,
          sortBy,
          sortOrder,
        },
      });

      const exportList = data?.data || filteredData || [];
      const pageStartSno = (page - 1) * pageSize;

      exportToExcel(`Customer_Reports_Page_${page}`, exportList, [
        { label: "S.No", key: (_, index) => pageStartSno + index + 1 },
        { label: "Full Name", key: "firstName" },
        { label: "Email Address", key: "email" },
        { label: "Phone Number", key: "phoneNumber" },
        { label: "No of orders Sent", key: "ordersSent" },
        { label: "No of orders Requested", key: "ordersRequested" },
        { label: "Country", key: "country" },
        { label: "City", key: "city" },
      ]);
    } catch {
      const pageStartSno = (page - 1) * pageSize;
      exportToExcel(`Customer_Reports_Page_${page}`, filteredData, [
        { label: "S.No", key: (_, index) => pageStartSno + index + 1 },
        { label: "Full Name", key: "firstName" },
        { label: "Email Address", key: "email" },
        { label: "Phone Number", key: "phoneNumber" },
        { label: "No of orders Sent", key: "ordersSent" },
        { label: "No of orders Requested", key: "ordersRequested" },
        { label: "Country", key: "country" },
        { label: "City", key: "city" },
      ]);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Report Management" description={meta.description} />

      <ReportDateFilters
        fromDate={fromDate}
        toDate={toDate}
        countryId={country === "All" ? "all" : country}
        hideCityFilter={true}
        hasFilters={hasFilters}
        onCountryChange={(v) => setCountry(v === "all" ? "All" : v)}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={applyFilters}
        onCancel={cancelFilters}
        onClear={clearFilters}
      />

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary ring-primary/20 flex size-10 items-center justify-center rounded-xl ring-1">
              <TableProperties className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {meta.title}
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                {pagination.total} total {pagination.total === 1 ? "entry" : "entries"} found
              </p>
            </div>
          </div>

          <ExportButton onClick={handleExport} isLoading={isExporting} />
        </CardHeader>
        <CardContent className="p-4">
          <DataTable
            columns={customerReportColumns}
            data={filteredData}
            searchKey={meta.searchKey}
            loading={isLoading}
            searchValue={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            currentPage={page}
            totalPages={pagination.totalPages}
            rowsPerPage={pageSize}
            onPageChange={setPage}
            onRowsPerPageChange={(newLimit) => {
              setPageSize(newLimit);
              setPage(1);
            }}
            onSortingChange={(sortingState) => {
              if (sortingState.length > 0) {
                setSortBy(sortingState[0].id);
                setSortOrder(sortingState[0].desc ? "desc" : "asc");
                setPage(1);
              } else {
                setSortBy(undefined);
                setSortOrder("desc");
              }
            }}
            manualSorting={true}
            manualFiltering={true}
            manualPagination={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
