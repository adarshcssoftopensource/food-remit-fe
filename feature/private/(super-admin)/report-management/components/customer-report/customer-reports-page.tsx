"use client";

import { useState } from "react";
import { format } from "date-fns";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { REPORT_SECTION_META } from "@/constants/report-management";
import { exportToExcel } from "@/lib/export-excel";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { customerReportColumns } from "../../columns/customer-report-columns";
import { ReportDateFilters } from "../shared/report-date-filters";
import { getEntriesFoundLabel, ReportTableCardHeader } from "../shared/report-table-card-header";
import { useCustomerReport } from "../../hooks/use-customer-report";

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
        { label: "State", key: "state" },
        { label: "City", key: "city" },
        { label: "Zip Code", key: "zipCode" },
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
        { label: "State", key: "state" },
        { label: "City", key: "city" },
        { label: "Zip Code", key: "zipCode" },
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
        <ReportTableCardHeader
          title={meta.title}
          subtitle={getEntriesFoundLabel(pagination.total)}
          onExport={handleExport}
          isExporting={isExporting}
        />
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
              const firstSort = sortingState[0];
              if (firstSort) {
                setSortBy(firstSort.id);
                setSortOrder(firstSort.desc ? "desc" : "asc");
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
