"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  BadgeDollarSign,
  Building2,
  CreditCard,
  FileSpreadsheet,
  Globe,
  HandCoins,
  Hash,
  Loader2,
  Mail,
  Map,
  MapPin,
  Maximize2,
  Phone,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Store,
  User,
  Boxes,
} from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/status-badge";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useTableFilters } from "@/hooks/use-table-filters";
import { exportToExcel } from "@/lib/export-excel";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { ReportDateFilters } from "../components/report-date-filters";
import { useReportDateFilters } from "../hooks/use-report-date-filters";
import { useGetStoreReportDetail } from "../hooks/use-get-store-report-detail";
import { useGetStoreItems } from "../hooks/use-get-store-items";
import { getStoreItemColumns } from "../columns/store-item-columns";

type StoreReportDetailProps = {
  storeId: string;
};

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

  const tableFilters = useTableFilters(50);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const fromDateStr = fromDate ? fromDate.toISOString() : undefined;
  const toDateStr = toDate ? toDate.toISOString() : undefined;

  const { data: detailResponse, isLoading: isDetailLoading } = useGetStoreReportDetail(storeId, {
    fromDate: fromDateStr,
    toDate: toDateStr,
  });

  const { data: itemsResponse, isLoading: isItemsLoading } = useGetStoreItems(storeId, {
    fromDate: fromDateStr,
    toDate: toDateStr,
    page: tableFilters.page,
    limit: tableFilters.limit,
    search: tableFilters.debouncedSearch.trim() || undefined,
    sortBy: tableFilters.sortBy,
    sortOrder: tableFilters.sortOrder,
  });

  const store = detailResponse?.data;
  const items = itemsResponse?.data || [];
  const pagination = itemsResponse?.pagination;

  const itemColumns = useMemo(
    () =>
      getStoreItemColumns({
        storeId,
        page: tableFilters.page,
        limit: tableFilters.limit,
        onImageClick: (url) => setLightboxImage(url),
      }),
    [storeId, tableFilters.page, tableFilters.limit],
  );

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const { data: exportRes } = await apiClient.get(
        REPORT_ENDPOINTS.EXPORT_STORE_ITEMS(storeId),
        {
          params: {
            page: tableFilters.page,
            limit: tableFilters.limit,
            search: tableFilters.debouncedSearch.trim() || undefined,
            fromDate: fromDateStr,
            toDate: toDateStr,
            sortBy: tableFilters.sortBy,
            sortOrder: tableFilters.sortOrder,
          },
        },
      );

      const exportList = exportRes?.data || items || [];
      const storeNameClean = (store?.storeName || "Store").replace(/[^a-zA-Z0-9]/g, "_");

      exportToExcel(`${storeNameClean}_Items_Page_${tableFilters.page}`, exportList, [
        {
          label: "S.No",
          key: (_, index) => (tableFilters.page - 1) * tableFilters.limit + index + 1,
        },
        { label: "Item Name", key: "productName" },
        { label: "UPC Code", key: (item) => item.upcCode || "N/A" },
        { label: "Unit", key: "unit" },
        { label: "Category", key: "categoryName" },
        { label: "Department", key: "departmentName" },
        {
          label: "Unit Price",
          key: (item) => `$${Number(item.price).toFixed(2)} ${item.currency}`,
        },
        { label: "Units Sold", key: "totalUnitsSold" },
        { label: "Transactions Count", key: "totalTransactionsCount" },
        { label: "Total Revenue", key: "totalSalesAmount" },
      ]);
    } catch {
      const storeNameClean = (store?.storeName || "Store").replace(/[^a-zA-Z0-9]/g, "_");
      exportToExcel(`${storeNameClean}_Items_Page_${tableFilters.page}`, items, [
        {
          label: "S.No",
          key: (_, index) => (tableFilters.page - 1) * tableFilters.limit + index + 1,
        },
        { label: "Item Name", key: "productName" },
        { label: "UPC Code", key: (item) => item.upcCode || "N/A" },
        { label: "Unit", key: "unit" },
        { label: "Category", key: "categoryName" },
        { label: "Department", key: "departmentName" },
        {
          label: "Unit Price",
          key: (item) => `$${Number(item.price).toFixed(2)} ${item.currency}`,
        },
        { label: "Units Sold", key: "totalUnitsSold" },
        { label: "Transactions Count", key: "totalTransactionsCount" },
        { label: "Total Revenue", key: "totalSalesAmount" },
      ]);
    } finally {
      setIsExporting(false);
    }
  };

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

        { label: "Total Sales", value: store.earnings?.totalSales, icon: ShoppingBag },
        { label: "Markup Earning", value: store.earnings?.totalMarkup, icon: BadgeDollarSign },
        { label: "Processing Earning", value: store.earnings?.totalProcessing, icon: CreditCard },
        { label: "Commission Earning", value: store.earnings?.totalCommission, icon: HandCoins },
        { label: "Item Tax", value: store.earnings?.totalItemTax, icon: Receipt },
        { label: "Refunded Amount", value: store.earnings?.refundedAmount, icon: RotateCcw },
      ]
    : [];

  if (isDetailLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading store details...
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-semibold text-red-500">
        Store report not found.
      </div>
    );
  }

  const storeLocation = [store.city, store.state, store.country].filter(Boolean).join(", ");

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Report Management" },
          { label: "Store Reports", href: ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT },
          { label: store.storeName },
        ]}
      />

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

              <div className="flex items-center gap-2 rounded-xl border border-orange-200/70 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 dark:border-orange-900/50 dark:bg-orange-950/40 dark:text-orange-400">
                <Boxes className="size-3.5" />
                <span>Catalog: {pagination?.total || items.length} Items</span>
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
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <Card className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-0 pb-3 dark:border-slate-800">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
            Store Items & Transactions Performance
          </CardTitle>

          <Button
            disabled={isExporting}
            isLoading={isExporting}
            onClick={handleExportExcel}
            className="h-9 gap-2 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
          >
            <FileSpreadsheet className="size-4" />
            <span>Export Excel</span>
          </Button>
        </CardHeader>

        <CardContent className="p-0 pt-3">
          <DataTable
            columns={itemColumns}
            data={items}
            searchValue={tableFilters.searchQuery}
            onSearchChange={tableFilters.setSearchQuery}
            currentPage={tableFilters.page}
            totalPages={pagination?.totalPages || 1}
            rowsPerPage={tableFilters.limit}
            onPageChange={tableFilters.setPage}
            onRowsPerPageChange={tableFilters.setLimit}
            onSortingChange={tableFilters.setSorting}
            manualSorting={true}
            manualFiltering={true}
            manualPagination={true}
            loading={isItemsLoading}
          />
        </CardContent>
      </Card>

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
