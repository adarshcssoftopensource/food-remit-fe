"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useFilterState } from "@/hooks/use-filter-state";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  REPORT_FOOD_TYPE_OPTIONS,
  REPORT_SECTION_META,
  type CouponReportRow,
  type CustomerReportRow,
  type OrderReportRow,
  type ReportSectionKey,
} from "@/constants/report-management";
import { exportToExcel } from "@/lib/export-excel";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import {
  couponReportColumns,
  customerReportColumns,
  orderReportColumns,
} from "./columns/other-report-columns";
import { storeReportColumns } from "./columns/store-report-columns";
import { ReportDateFilters } from "./components/report-date-filters";
import { useReportDateFilters } from "./hooks/use-report-date-filters";
import { useStoreReport } from "./hooks/use-store-report";
import { OrderReportsPage } from "./components/order-reports-page";
import { CustomerReportsPage } from "./components/customer-reports-page";
import { getEntriesFoundLabel, ReportTableCardHeader } from "./components/report-table-card-header";

type ReportManagementPageProps = {
  section: ReportSectionKey;
};

function EmptyReportsTable({ section }: { section: Exclude<ReportSectionKey, "store-report"> }) {
  const meta = REPORT_SECTION_META[section];
  const [isExporting, setIsExporting] = useState(false);
  const {
    applyFilters,
    cancelFilters,
    clearFilters,
    fromDate,
    hasFilters,
    setFromDate,
    setToDate,
    toDate,
  } = useReportDateFilters();
  const { draft, setDraft, applied, apply, cancel, reset } = useFilterState({
    foodType: "All",
    country: "all",
  });

  const clearAll = () => {
    clearFilters();
    reset();
  };

  const handleApply = () => {
    applyFilters();
    apply();
  };

  const handleCancel = () => {
    cancelFilters();
    cancel();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      exportToExcel(meta.title.replace(/\s+/g, "_"), [], [{ label: "ID", key: "id" }]);
    } finally {
      setIsExporting(false);
    }
  };

  const table =
    section === "customer-report" ? (
      <DataTable
        columns={customerReportColumns}
        data={[] as CustomerReportRow[]}
        searchKey={meta.searchKey}
      />
    ) : section === "orders-report" ? (
      <DataTable
        columns={orderReportColumns}
        data={[] as OrderReportRow[]}
        searchKey={meta.searchKey}
      />
    ) : (
      <DataTable
        columns={couponReportColumns}
        data={[] as CouponReportRow[]}
        searchKey={meta.searchKey}
      />
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Report Management" description={meta.description} />

      <ReportDateFilters
        fromDate={fromDate}
        toDate={toDate}
        countryId={draft.country}
        onCountryChange={(v) => setDraft((p) => ({ ...p, country: v }))}
        hasFilters={
          hasFilters ||
          (section === "orders-report" && applied.foodType !== "All") ||
          applied.country !== "all"
        }
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={handleApply}
        onCancel={handleCancel}
        onClear={clearAll}
      >
        {section === "orders-report" && (
          <div className="min-w-36 flex-1 space-y-1 sm:min-w-44">
            <Label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Food Type
            </Label>
            <Select
              value={draft.foodType}
              onValueChange={(v) => setDraft((p) => ({ ...p, foodType: v ?? "All" }))}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-slate-200/80 bg-white px-3 text-sm font-medium dark:border-slate-800 dark:bg-slate-900">
                <SelectValue placeholder="Select Food Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {REPORT_FOOD_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </ReportDateFilters>

      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <ReportTableCardHeader
          title={meta.title}
          subtitle="0 entries found"
          onExport={handleExport}
          isExporting={isExporting}
        />
        <CardContent className="p-4">{table}</CardContent>
      </Card>
    </div>
  );
}

function StoreReportsPage() {
  const meta = REPORT_SECTION_META["store-report"];
  const [isExporting, setIsExporting] = useState(false);
  const {
    applyFilters,
    clearFilters,
    country,
    filteredData,
    fromDate,
    hasFilters,
    setCountry,
    setFromDate,
    setToDate,
    toDate,
    cancelFilters,
    pagination,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    isLoading,
  } = useStoreReport();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const fromDateStr = fromDate ? format(fromDate, "yyyy-MM-dd") : undefined;
      const toDateStr = toDate ? format(toDate, "yyyy-MM-dd") : undefined;

      const { data } = await apiClient.get(REPORT_ENDPOINTS.EXPORT_STORE_REPORTS, {
        params: {
          page,
          limit: pageSize,
          search: search.trim() || undefined,
          country: country === "All" ? undefined : country,
          fromDate: fromDateStr,
          toDate: toDateStr,
        },
      });

      const exportList = data?.data || filteredData || [];

      exportToExcel("Store_Reports", exportList, [
        { label: "S.No", key: (_, index) => index + 1 },
        { label: "Store Name", key: "storeName" },
        { label: "Country", key: "country" },
        { label: "State/Province", key: "state" },
        { label: "City", key: "city" },
        { label: "Address", key: "address" },
        { label: "Phone", key: "phone" },
        { label: "Total Orders", key: "totalOrder" },
        { label: "Total Sales", key: (item) => item.earnings?.totalSales || "$0.00" },
      ]);
    } catch {
      exportToExcel("Store_Reports", filteredData, [
        { label: "S.No", key: (_, index) => index + 1 },
        { label: "Store Name", key: "storeName" },
        { label: "Country", key: "country" },
        { label: "State/Province", key: "state" },
        { label: "City", key: "city" },
        { label: "Address", key: "address" },
        { label: "Phone", key: "phone" },
        { label: "Total Orders", key: "totalOrder" },
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
            columns={storeReportColumns}
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
            manualFiltering={true}
            manualPagination={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function ReportManagementPage({ section }: ReportManagementPageProps) {
  if (section === "store-report") {
    return <StoreReportsPage />;
  }

  if (section === "orders-report") {
    return <OrderReportsPage />;
  }

  if (section === "customer-report") {
    return <CustomerReportsPage />;
  }

  return <EmptyReportsTable section={section} />;
}
