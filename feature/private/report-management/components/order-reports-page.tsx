"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileSpreadsheet, Loader2, Store, TableProperties } from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/components/providers/profile-provider";
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
import { useGetStores } from "@/feature/private/store-management/hooks/use-get-stores";
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
  const { profile, isSuperAdmin } = useProfile();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const isStoreScoped =
    !isSuperAdmin &&
    (profile?.roleCode === "STORE_MANAGER" ||
      profile?.role === "store_manager" ||
      profile?.roleCode === "STORE_ADMIN" ||
      profile?.role === "store_admin" ||
      profile?.roleCode === "EMPLOYEE" ||
      profile?.role === "employee" ||
      Boolean(profile?.stores && profile.stores.length > 0));

  const userStoreId = isStoreScoped ? profile?.stores?.[0]?.id : undefined;
  const userStoreName = isStoreScoped ? profile?.stores?.[0]?.storeName : undefined;

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 400);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [draftFoodType, setDraftFoodType] = useState("All");
  const [draftFromDate, setDraftFromDate] = useState<Date | undefined>(undefined);
  const [draftToDate, setDraftToDate] = useState<Date | undefined>(undefined);
  const [draftStoreId, setDraftStoreId] = useState<string>("all");

  const [appliedFoodType, setAppliedFoodType] = useState("All");
  const [appliedFromDate, setAppliedFromDate] = useState<Date | undefined>(undefined);
  const [appliedToDate, setAppliedToDate] = useState<Date | undefined>(undefined);
  const [appliedStoreId, setAppliedStoreId] = useState<string>("all");

  const [isExporting, setIsExporting] = useState(false);

  const { data: storesList } = useGetStores({ limit: 100 });

  const effectiveStoreId = userStoreId || (appliedStoreId !== "all" ? appliedStoreId : undefined);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "order-reports",
      effectiveStoreId ?? "all",
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
      const endpoint = effectiveStoreId
        ? REPORT_ENDPOINTS.GET_STORE_ORDERS(effectiveStoreId)
        : REPORT_ENDPOINTS.GET_ORDER_REPORTS;

      const res = await apiClient.get(endpoint, {
        params: {
          page,
          limit: pageSize,
          search: debouncedSearch.trim() || undefined,
          type: typeParam,
          fromDate: appliedFromDate ? appliedFromDate.toISOString() : undefined,
          toDate: appliedToDate ? appliedToDate.toISOString() : undefined,
          sortBy,
          sortOrder,
          storeId: effectiveStoreId || undefined,
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
    if (!isStoreScoped) {
      setAppliedStoreId(draftStoreId);
    }
    setPage(1);
  };

  const handleCancelFilters = () => {
    setDraftFoodType(appliedFoodType);
    setDraftFromDate(appliedFromDate);
    setDraftToDate(appliedToDate);
    if (!isStoreScoped) {
      setDraftStoreId(appliedStoreId);
    }
  };

  const handleClearFilters = () => {
    setDraftFoodType("All");
    setDraftFromDate(undefined);
    setDraftToDate(undefined);
    setDraftStoreId("all");

    setAppliedFoodType("All");
    setAppliedFromDate(undefined);
    setAppliedToDate(undefined);
    setAppliedStoreId("all");
    setPage(1);
  };

  const hasActiveFilters =
    appliedFoodType !== "All" ||
    Boolean(appliedFromDate) ||
    Boolean(appliedToDate) ||
    (!isStoreScoped && appliedStoreId !== "all");

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const typeParam = appliedFoodType !== "All" ? Number(appliedFoodType) : undefined;
      const exportEndpoint = effectiveStoreId
        ? REPORT_ENDPOINTS.EXPORT_STORE_ORDERS(effectiveStoreId)
        : REPORT_ENDPOINTS.EXPORT_ORDER_REPORTS;

      const res = await apiClient.get(exportEndpoint, {
        params: {
          page,
          limit: pageSize,
          search: debouncedSearch.trim() || undefined,
          type: typeParam,
          fromDate: appliedFromDate ? appliedFromDate.toISOString() : undefined,
          toDate: appliedToDate ? appliedToDate.toISOString() : undefined,
          sortBy,
          sortOrder,
          storeId: effectiveStoreId || undefined,
        },
      });

      const exportList: OrderReportRow[] = res.data?.data || orders;
      const storePrefix =
        isStoreScoped && userStoreName
          ? `Order_Reports_${userStoreName.replace(/[^a-zA-Z0-9]/g, "_")}`
          : "Order_Reports";

      exportToExcel(`${storePrefix}_Page_${page}`, exportList, [
        { label: "S.No", key: "sno" },
        { label: "Reference Number", key: "refrenceNumber" },
        { label: "Sender Name", key: "senderName" },
        { label: "Receiver Name", key: "receiverName" },
        { label: "Store Name", key: "storeName" },
        { label: "Status", key: "statusLabel" },
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
        { label: "Total Amount", key: "totalAmount" },
        { label: "Date", key: "addedOn" },
      ]);
    } finally {
      setIsExporting(false);
    }
  };

  const columns = useMemo(
    () =>
      getOrderReportColumns({
        onViewDetails: (orderId) => setSelectedOrderId(orderId),
        onImageClick: (url) => setLightboxSrc(url),
      }),
    [],
  );

  if (selectedOrderId) {
    return (
      <OrderReportDetailPage orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Management"
        description={
          isStoreScoped && userStoreName
            ? `Orders report for ${userStoreName}. Tracking store order transactions and fulfillment.`
            : meta.description
        }
      />

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
        customFilterCount={
          (draftFoodType !== "All" ? 1 : 0) + (!isStoreScoped && draftStoreId !== "all" ? 1 : 0)
        }
      >
        {!isStoreScoped && (
          <div className="min-w-36 flex-1 space-y-1.5 sm:min-w-44">
            <Label className="block truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Store
            </Label>
            <Select value={draftStoreId} onValueChange={(v) => setDraftStoreId(v ?? "all")}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="All Stores">
                  {draftStoreId === "all"
                    ? "All Stores"
                    : storesList?.find((s) => s.id === draftStoreId)?.storeName || "Selected Store"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Stores</SelectItem>
                  {storesList?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.storeName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}

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
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {meta.title}
                </CardTitle>
                {isStoreScoped && userStoreName && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <Store className="size-3.5" />
                    {userStoreName}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs">
                {pagination.total} total {pagination.total === 1 ? "entry" : "entries"} found
                {isFetching && (
                  <span className="text-primary ml-2 font-semibold">(Updating...)</span>
                )}
              </p>
            </div>
          </div>

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

      {/* Global Image Lightbox */}
      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </div>
  );
}
