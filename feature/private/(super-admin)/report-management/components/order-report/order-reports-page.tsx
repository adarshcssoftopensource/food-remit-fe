"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { DataTable } from "@/components/common/data-table/data-table";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { useProfile } from "@/providers/profile-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { REPORT_SECTION_META } from "@/constants/report-management";
import { useGetStores } from "@/feature/private/(super-admin)/store-management/hooks/use-get-stores";
import { exportToExcel } from "@/lib/export-excel";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useDebounce } from "@/lib/debounce";
import { useWorkflowCounts } from "@/feature/private/(store-admin)/order-management/hooks/use-workflow-counts";
import { cn } from "@/lib/utils";
import { OrderReportDetailPage } from "./order-report-detail-page";
import { OrderReportFilterFields, OrderReportsTableHeader } from "./order-reports-sections";
import { ReportDateFilters } from "../shared/report-date-filters";
import { getOrderReportColumns, OrderReportRow } from "../../columns/order-report-columns";

function getIsStoreScoped(
  profile: ReturnType<typeof useProfile>["profile"],
  isSuperAdmin: boolean,
) {
  return (
    !isSuperAdmin &&
    (profile?.roleCode === "STORE_MANAGER" ||
      profile?.role === "store_manager" ||
      profile?.roleCode === "STORE_ADMIN" ||
      profile?.role === "store_admin" ||
      profile?.roleCode === "EMPLOYEE" ||
      profile?.role === "employee" ||
      Boolean(profile?.stores && profile.stores.length > 0))
  );
}

function getHasActiveFilters(
  appliedFoodType: string,
  appliedFromDate: Date | undefined,
  appliedToDate: Date | undefined,
  isStoreScoped: boolean,
  appliedStoreId: string,
) {
  return (
    appliedFoodType !== "All" ||
    Boolean(appliedFromDate) ||
    Boolean(appliedToDate) ||
    (!isStoreScoped && appliedStoreId !== "all")
  );
}

function getCustomFilterCount(draftFoodType: string, isStoreScoped: boolean, draftStoreId: string) {
  return (draftFoodType !== "All" ? 1 : 0) + (!isStoreScoped && draftStoreId !== "all" ? 1 : 0);
}

export function OrderReportsPage() {
  const meta = REPORT_SECTION_META["orders-report"];
  const { profile, isSuperAdmin } = useProfile();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const isStoreScoped = getIsStoreScoped(profile, isSuperAdmin);

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

  const [historyFilter, setHistoryFilter] = useState<"all" | "picked-up" | "abandoned">("all");
  const { data: workflowCounts } = useWorkflowCounts();

  const [isExporting, setIsExporting] = useState(false);

  const { data: storesList } = useGetStores({ limit: 100 });

  const effectiveStoreId = userStoreId || (appliedStoreId !== "all" ? appliedStoreId : undefined);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [
      "order-reports",
      effectiveStoreId ?? "all",
      historyFilter,
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
      const finalStatusParam =
        historyFilter === "picked-up" ? 1 : historyFilter === "abandoned" ? 2 : undefined;
      const endpoint = effectiveStoreId
        ? REPORT_ENDPOINTS.GET_STORE_ORDERS(effectiveStoreId)
        : REPORT_ENDPOINTS.GET_ORDER_REPORTS;

      const res = await apiClient.get(endpoint, {
        params: {
          page,
          limit: pageSize,
          search: debouncedSearch.trim() || undefined,
          type: typeParam,
          status: "11",
          finalStatus: finalStatusParam,
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

  const hasActiveFilters = getHasActiveFilters(
    appliedFoodType,
    appliedFromDate,
    appliedToDate,
    isStoreScoped,
    appliedStoreId,
  );

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const typeParam = appliedFoodType !== "All" ? Number(appliedFoodType) : undefined;
      const finalStatusParam =
        historyFilter === "picked-up" ? 1 : historyFilter === "abandoned" ? 2 : undefined;
      const exportEndpoint = effectiveStoreId
        ? REPORT_ENDPOINTS.EXPORT_STORE_ORDERS(effectiveStoreId)
        : REPORT_ENDPOINTS.EXPORT_ORDER_REPORTS;

      const res = await apiClient.get(exportEndpoint, {
        params: {
          page,
          limit: pageSize,
          search: debouncedSearch.trim() || undefined,
          type: typeParam,
          status: "11",
          finalStatus: finalStatusParam,
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
        { label: "Markup", key: "markup" },
        { label: "Employee", key: "assignedEmployeeName" },
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
        { label: "Markup", key: "markup" },
        { label: "Employee", key: "assignedEmployeeName" },
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
        customFilterCount={getCustomFilterCount(draftFoodType, isStoreScoped, draftStoreId)}
      >
        <OrderReportFilterFields
          isStoreScoped={isStoreScoped}
          draftStoreId={draftStoreId}
          onDraftStoreIdChange={setDraftStoreId}
          storesList={storesList}
          draftFoodType={draftFoodType}
          onDraftFoodTypeChange={setDraftFoodType}
        />
      </ReportDateFilters>

      {/* Main Table Card */}
      <Card className="rounded-2xl border border-white/70 bg-white/85 shadow-xs backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/85">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <OrderReportsTableHeader
            title={meta.title}
            isStoreScoped={isStoreScoped}
            userStoreName={userStoreName}
            total={pagination.total}
            isFetching={isFetching}
            isExporting={isExporting}
            isLoading={isLoading}
            onExport={handleExport}
          />
        </CardHeader>

        <CardContent className="p-4">
          {/* Sub-filter bar for Closed orders according to new workflow */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(
              [
                { key: "all", label: "All Closed", count: workflowCounts?.history },
                { key: "picked-up", label: "Picked Up", count: workflowCounts?.pickedUp },
                { key: "abandoned", label: "Abandoned", count: workflowCounts?.abandoned },
              ] as const
            ).map((f) => {
              const active = historyFilter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => {
                    setHistoryFilter(f.key);
                    setPage(1);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all sm:text-sm",
                    active
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs ring-1 ring-emerald-600/30 dark:border-emerald-500/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800",
                  )}
                >
                  <span>{f.label}</span>
                  {typeof f.count === "number" && (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold",
                        active
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                      )}
                    >
                      {f.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

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
              const firstSort = sortingState[0];
              if (firstSort) {
                setSortBy(firstSort.id);
                setSortOrder(firstSort.desc ? "desc" : "asc");
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
