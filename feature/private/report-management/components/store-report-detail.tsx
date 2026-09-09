"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  BadgeDollarSign,
  Building2,
  ClipboardList,
  CreditCard,
  FileSpreadsheet,
  Globe,
  HandCoins,
  Hash,
  Mail,
  Map,
  MapPin,
  Maximize2,
  Phone,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Store,
  TableProperties,
  User,
} from "lucide-react";

import { format } from "date-fns";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/config/routes";
import { useTableFilters } from "@/hooks/use-table-filters";
import { exportToExcel } from "@/lib/export-excel";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { ReportDateFilters } from "../components/report-date-filters";
import { useReportDateFilters } from "../hooks/use-report-date-filters";
import { useGetStoreReportDetail } from "../hooks/use-get-store-report-detail";
import { useGetStoreOrders } from "../hooks/use-get-store-orders";
import { getOrderReportColumns, OrderReportRow } from "../columns/order-report-columns";
import { OrderReportDetailPage } from "./order-report-detail-page";
import { StoreReportDetailSkeleton } from "./store-report-detail-skeleton";

type StoreReportDetailProps = {
  storeId: string;
};

const FOOD_TYPE_OPTIONS = [
  { label: "All Food Types", value: "All" },
  { label: "Food Sent", value: "1" },
  { label: "Food Requested", value: "2" },
  { label: "Food Received", value: "3" },
];

export function StoreReportDetail({ storeId }: StoreReportDetailProps) {
  const {
    applyFilters,
    clearFilters,
    fromDate,
    toDate,
    draftFromDate,
    draftToDate,
    hasFilters,
    setFromDate,
    setToDate,
  } = useReportDateFilters();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Table filters for Store Orders
  const orderTableFilters = useTableFilters(50);
  const [foodType, setFoodType] = useState<string>("All");

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fromDateStr = fromDate ? format(fromDate, "yyyy-MM-dd") : undefined;
  const toDateStr = toDate ? format(toDate, "yyyy-MM-dd") : undefined;

  const handleSearchChange = (val: string) => {
    orderTableFilters.setSearchQuery(val);
    orderTableFilters.setPage(1);
  };

  const handleFoodTypeChange = (val: string | null) => {
    setFoodType(val || "All");
    orderTableFilters.setPage(1);
  };

  const handleApplyDateFilters = () => {
    applyFilters();
    orderTableFilters.setPage(1);
  };

  const handleClearDateFilters = () => {
    clearFilters();
    orderTableFilters.setPage(1);
  };

  // Store Header & Financial Overview
  const { data: detailResponse, isLoading: isDetailLoading } = useGetStoreReportDetail(storeId, {
    fromDate: fromDateStr,
    toDate: toDateStr,
  });

  // Store Orders List
  const foodTypeNum = foodType !== "All" ? Number(foodType) : undefined;
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
  } = useGetStoreOrders(storeId, {
    fromDate: fromDateStr,
    toDate: toDateStr,
    page: orderTableFilters.page,
    limit: orderTableFilters.limit,
    search: orderTableFilters.debouncedSearch.trim() || undefined,
    type: foodTypeNum,
    sortBy: orderTableFilters.sortBy,
    sortOrder: orderTableFilters.sortOrder,
  });

  const store = detailResponse?.data;
  const orders: OrderReportRow[] = ordersResponse?.data || [];
  const orderPagination = ordersResponse?.pagination;

  const orderColumns = useMemo(
    () =>
      getOrderReportColumns({
        onViewDetails: (orderId: string) => setSelectedOrderId(orderId),
        onImageClick: (url: string) => setLightboxImage(url),
      }),
    [],
  );

  const handleExportOrdersExcel = async () => {
    setIsExporting(true);
    try {
      const { data: exportRes } = await apiClient.get(
        REPORT_ENDPOINTS.EXPORT_STORE_ORDERS(storeId),
        {
          params: {
            page: orderTableFilters.page,
            limit: orderTableFilters.limit,
            search: orderTableFilters.debouncedSearch.trim() || undefined,
            type: foodTypeNum,
            fromDate: fromDateStr,
            toDate: toDateStr,
            sortBy: orderTableFilters.sortBy,
            sortOrder: orderTableFilters.sortOrder,
          },
        },
      );

      const exportList: OrderReportRow[] = exportRes?.data || orders || [];
      const storeNameClean = (store?.storeName || "Store").replace(/[^a-zA-Z0-9]/g, "_");

      const exportColumns = [
        { label: "S.No", key: "sno" as const },
        { label: "Reference Number", key: "refrenceNumber" as const },
        { label: "Store Name", key: "storeName" as const },
        { label: "Sender Name", key: "senderName" as const },
        { label: "Receiver Name", key: "receiverName" as const },
        { label: "Markup", key: "markup" as const },
        { label: "Processing Fee", key: "processingFee" as const },
        { label: "Commission Earnings", key: "commissionEarnings" as const },
        { label: "Item Tax", key: "itemTax" as const },
        { label: "Refunded Amount", key: "refundedAmount" as const },
        { label: "Total Amount", key: "totalAmount" as const },
        { label: "Status", key: "statusLabel" as const },
        { label: "Date", key: "addedOn" as const },
      ];

      exportToExcel(
        `${storeNameClean}_Orders_Page_${orderTableFilters.page}`,
        exportList,
        exportColumns,
      );
    } catch {
      const storeNameClean = (store?.storeName || "Store").replace(/[^a-zA-Z0-9]/g, "_");
      exportToExcel(`${storeNameClean}_Orders_Page_${orderTableFilters.page}`, orders, [
        { label: "S.No", key: "sno" },
        { label: "Reference Number", key: "refrenceNumber" },
        { label: "Store Name", key: "storeName" },
        { label: "Sender Name", key: "senderName" },
        { label: "Receiver Name", key: "receiverName" },
        { label: "Markup", key: "markup" },
        { label: "Processing Fee", key: "processingFee" },
        { label: "Commission Earnings", key: "commissionEarnings" },
        { label: "Item Tax", key: "itemTax" },
        { label: "Refunded Amount", key: "refundedAmount" },
        { label: "Total Amount", key: "totalAmount" },
        { label: "Status", key: "statusLabel" },
        { label: "Date", key: "addedOn" },
      ]);
    } finally {
      setIsExporting(false);
    }
  };

  // If viewing a single order detail drill-down
  if (selectedOrderId) {
    return (
      <OrderReportDetailPage orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
    );
  }

  const managerRows = store
    ? [
        { label: "Manager Name", value: store.manager?.name, icon: User },
        { label: "Email Address", value: store.manager?.email, icon: Mail },
        { label: "Phone Number", value: store.manager?.phone, icon: Phone },
        { label: "Address", value: store.manager?.address, icon: MapPin },
        { label: "Country", value: store.manager?.country || store.country, icon: Globe },
        { label: "State", value: store.manager?.state || store.state, icon: Map },
        { label: "City", value: store.manager?.city || store.city, icon: Building2 },
        { label: "Zip Code", value: store.manager?.zipCode, icon: Hash },

        {
          label: "Total Sales",
          value: cleanCurrencyDisplay(store.earnings?.totalSales),
          icon: ShoppingBag,
        },
        {
          label: "Markup Earning",
          value: cleanCurrencyDisplay(store.earnings?.totalMarkup),
          icon: BadgeDollarSign,
        },
        {
          label: "Processing Earning",
          value: cleanCurrencyDisplay(store.earnings?.totalProcessing),
          icon: CreditCard,
        },
        {
          label: "Commission Earning",
          value: cleanCurrencyDisplay(store.earnings?.totalCommission),
          icon: HandCoins,
        },
        {
          label: "Item Tax",
          value: cleanCurrencyDisplay(store.earnings?.totalItemTax),
          icon: Receipt,
        },
        {
          label: "Refunded Amount",
          value: cleanCurrencyDisplay(store.earnings?.refundedAmount),
          icon: RotateCcw,
        },
      ]
    : [];

  if (isDetailLoading) {
    return <StoreReportDetailSkeleton />;
  }

  if (!store) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-semibold text-red-500">
        Store report not found.
      </div>
    );
  }

  const storeLocation = [store.city, store.state, store.country].filter(Boolean).join(", ");
  const totalOrdersCount = orderPagination?.total ?? store.totalOrder ?? orders.length;

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Report Management" },
          { label: "Store Reports", href: ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT },
          { label: store.storeName },
        ]}
      />

      {/* Store Banner */}
      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid items-stretch gap-6 md:grid-cols-12">
          <div className="flex flex-col md:col-span-5">
            <div
              onClick={() => store.image && setLightboxImage(store.image)}
              className={`group relative h-52 min-h-[200px] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 md:h-full dark:border-slate-800 dark:bg-slate-800 ${
                store.image ? "cursor-pointer" : ""
              }`}
            >
              {store.image ? (
                <>
                  <Image
                    src={store.image}
                    fill
                    alt={store.storeName}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/25 px-4 py-2 text-xs font-bold text-white shadow-lg">
                      <Maximize2 className="size-4" />
                      <span>Click to Maximize</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <Store className="size-14" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between space-y-4 md:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                    {store.storeName}
                  </h2>
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    #{store.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <StatusBadge
                  status={store.status || "Active"}
                  className="rounded-full px-3 py-0.5 text-xs font-bold"
                />
              </div>

              <div className="mt-3.5 grid gap-2.5 text-xs text-slate-600 sm:grid-cols-2 dark:text-slate-400">
                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-orange-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Store Address
                    </p>
                    <p className="line-clamp-2 font-semibold text-slate-800 dark:text-slate-200">
                      {store.address || "No address provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                  <Phone className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Contact Phone
                    </p>
                    <p className="truncate font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {store.phone || "-"}
                    </p>
                  </div>
                </div>

                {storeLocation && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                    <Globe className="mt-0.5 size-4 shrink-0 text-blue-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        City / Country
                      </p>
                      <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                        {storeLocation}
                      </p>
                    </div>
                  </div>
                )}

                {store.manager?.name && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/60 dark:bg-slate-800/40">
                    <User className="mt-0.5 size-4 shrink-0 text-purple-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Manager
                      </p>
                      <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                        {store.manager.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                <ShoppingBag className="size-3.5" />
                <span>Total Revenue: {store.earnings?.totalSales || "$0.00"}</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-blue-200/70 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
                <ClipboardList className="size-3.5" />
                <span>Total Orders: {totalOrdersCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="border-b border-slate-100 p-0 pb-3 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
            Store Manager & Financial Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 pt-3">
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {managerRows.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.label}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/50"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                      {row.label}
                    </p>
                    <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                      {row.value || "-"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ReportDateFilters
        fromDate={draftFromDate}
        toDate={draftToDate}
        hasFilters={hasFilters}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onApply={handleApplyDateFilters}
        onClear={handleClearDateFilters}
      />

      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-col gap-3 border-b border-slate-100 p-0 pb-3 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <TableProperties className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Store Orders
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {totalOrdersCount} total {totalOrdersCount === 1 ? "order" : "orders"} found
                {isOrdersFetching && (
                  <span className="ml-1.5 font-semibold text-emerald-600">(Updating...)</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={foodType} onValueChange={handleFoodTypeChange}>
              <SelectTrigger className="h-9 w-37.5 rounded-xl text-xs font-medium">
                <SelectValue placeholder="Food Type" />
              </SelectTrigger>
              <SelectContent>
                {FOOD_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              disabled={isExporting}
              isLoading={isExporting}
              onClick={handleExportOrdersExcel}
              className="h-9 gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
            >
              <FileSpreadsheet className="size-4" />
              <span>Export Excel</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 pt-3">
          <DataTable
            columns={orderColumns}
            data={orders}
            searchValue={orderTableFilters.searchQuery}
            onSearchChange={handleSearchChange}
            currentPage={orderTableFilters.page}
            totalPages={orderPagination?.totalPages || 1}
            rowsPerPage={orderTableFilters.limit}
            onPageChange={orderTableFilters.setPage}
            onRowsPerPageChange={orderTableFilters.setLimit}
            onSortingChange={orderTableFilters.setSorting}
            manualSorting={true}
            manualFiltering={true}
            manualPagination={true}
            loading={isOrdersLoading}
          />
        </CardContent>
      </Card>

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
