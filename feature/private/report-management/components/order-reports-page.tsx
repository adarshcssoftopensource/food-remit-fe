"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileSpreadsheet, Loader2, TableProperties } from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REPORT_SECTION_META } from "@/constants/report-management";
import { exportToExcel } from "@/lib/export-excel";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useDebounce } from "@/lib/debounce";
import { OrderReportDetailPage } from "./order-report-detail-page";
import { ReportDateFilters } from "./report-date-filters";
import { getOrderReportColumns, OrderReportRow } from "../columns/order-report-columns";

const FOOD_TYPE_OPTIONS = [
  { label: "All Food Types", value: "All" },
  { label: "Food Sent", value: "1" },
  { label: "Food Requested", value: "2" },
  { label: "Food Received", value: "3" },
];

export function OrderReportsPage() {
  const meta = REPORT_SECTION_META["orders-report"];
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Search & Pagination State
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Filter Drawer Draft State
  const [draftFoodType, setDraftFoodType] = useState("All");
  const [draftFromDate, setDraftFromDate] = useState<Date | undefined>(undefined);
  const [draftToDate, setDraftToDate] = useState<Date | undefined>(undefined);

  // Applied Filter State
  const [appliedFoodType, setAppliedFoodType] = useState("All");
  const [appliedFromDate, setAppliedFromDate] = useState<Date | undefined>(undefined);
  const [appliedToDate, setAppliedToDate] = useState<Date | undefined>(undefined);

  const [isExporting, setIsExporting] = useState(false);

  // Fetch Order Reports from Backend
  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "order-reports",
      page,
      pageSize,
      sortBy,
      sortOrder,
      debouncedSearch,
      appliedFoodType,
      appliedFromDate?.toISOString(),
      appliedToDate?.toISOString(),
    ],
    queryFn: async () => {
      const typeParam = appliedFoodType !== "All" ? Number(appliedFoodType) : undefined;

      const res = await apiClient.get(REPORT_ENDPOINTS.GET_ORDER_REPORTS, {
        params: {
          page,
          limit: pageSize,
          search: debouncedSearch.trim() || undefined,
          type: typeParam,
          fromDate: appliedFromDate ? appliedFromDate.toISOString() : undefined,
          toDate: appliedToDate ? appliedToDate.toISOString() : undefined,
          sortBy,
          sortOrder,
        },
      });
      return res.data;
    },
    staleTime: 30 * 1000,
  });

  const orders: OrderReportRow[] = data?.data || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  };

  const handleApplyFilters = () => {
    setAppliedFoodType(draftFoodType);
    setAppliedFromDate(draftFromDate);
    setAppliedToDate(draftToDate);
    setPage(1);
  };

  const handleCancelFilters = () => {
    setDraftFoodType(appliedFoodType);
    setDraftFromDate(appliedFromDate);
    setDraftToDate(appliedToDate);
  };

  const handleClearFilters = () => {
    setDraftFoodType("All");
    setDraftFromDate(undefined);
    setDraftToDate(undefined);

    setAppliedFoodType("All");
    setAppliedFromDate(undefined);
    setAppliedToDate(undefined);
    setPage(1);
  };

  const hasActiveFilters =
    appliedFoodType !== "All" || Boolean(appliedFromDate) || Boolean(appliedToDate);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const typeParam = appliedFoodType !== "All" ? Number(appliedFoodType) : undefined;

      const res = await apiClient.get(REPORT_ENDPOINTS.EXPORT_ORDER_REPORTS, {
        params: {
          page,
          limit: pageSize,
          search: debouncedSearch.trim() || undefined,
          type: typeParam,
          fromDate: appliedFromDate ? appliedFromDate.toISOString() : undefined,
          toDate: appliedToDate ? appliedToDate.toISOString() : undefined,
          sortBy,
          sortOrder,
        },
      });

      const exportList: OrderReportRow[] = res.data?.data || orders;

      exportToExcel(`Order_Reports_Page_${page}`, exportList, [
        { label: "S.No", key: "sno" },
        { label: "Reference Number", key: "refrenceNumber" },
        { label: "Sender Name", key: "senderName" },
        { label: "Receiver Name", key: "receiverName" },
        { label: "Store Name", key: "storeName" },
        { label: "Status", key: "statusLabel" },
        { label: "Handed Over By", key: "handedOverBy" },
        { label: "Total Amount", key: "totalAmount" },
        { label: "Date", key: "addedOn" },
      ]);
    } catch {
      exportToExcel(`Order_Reports_Page_${page}`, orders, [
        { label: "S.No", key: "sno" },
        { label: "Reference Number", key: "refrenceNumber" },
        { label: "Sender Name", key: "senderName" },
        { label: "Receiver Name", key: "receiverName" },
        { label: "Store Name", key: "storeName" },
        { label: "Status", key: "statusLabel" },
        { label: "Handed Over By", key: "handedOverBy" },
        { label: "Total Amount", key: "totalAmount" },
        { label: "Date", key: "addedOn" },
      ]);
    } finally {
      setIsExporting(false);
    }
  };

  const columns = useMemo(
    () => getOrderReportColumns((orderId) => setSelectedOrderId(orderId)),
    [],
  );

  if (selectedOrderId) {
    return (
      <OrderReportDetailPage orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Report Management" description={meta.description} />

      {/* Global Module Filter Drawer */}
      <ReportDateFilters
        fromDate={draftFromDate}
        toDate={draftToDate}
        hasFilters={hasActiveFilters}
        onFromDateChange={setDraftFromDate}
        onToDateChange={setDraftToDate}
        onApply={handleApplyFilters}
        onCancel={handleCancelFilters}
        onClear={handleClearFilters}
        hideCountryFilter
        hideCityFilter
        customFilterCount={draftFoodType !== "All" ? 1 : 0}
      >
        <div className="min-w-36 flex-1 space-y-1.5 sm:min-w-44">
          <Label className="block truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Food Type
          </Label>
          <Select value={draftFoodType} onValueChange={(v) => setDraftFoodType(v ?? "All")}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Select Food Type">
                {FOOD_TYPE_OPTIONS.find((opt) => opt.value === draftFoodType)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {FOOD_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </ReportDateFilters>

      {/* Main Table Card */}
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
                {isFetching && (
                  <span className="text-primary ml-2 font-semibold">(Updating...)</span>
                )}
              </p>
            </div>
          </div>

          {/* Export Excel Button */}
          <Button
            disabled={isExporting || isLoading}
            onClick={handleExport}
            className="h-9 gap-2 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="size-4" />
            )}
            <span>Export Excel</span>
          </Button>
        </CardHeader>

        <CardContent className="p-4">
          <DataTable
            columns={columns}
            data={orders}
            loading={isLoading}
            searchValue={searchValue}
            onSearchChange={(v) => {
              setSearchValue(v);
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
