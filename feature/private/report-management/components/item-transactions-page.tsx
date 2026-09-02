"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FileSpreadsheet, Loader2, Maximize2, Package, Store, Tag, Receipt } from "lucide-react";

import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useTableFilters } from "@/hooks/use-table-filters";
import { exportToExcel } from "@/lib/export-excel";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { ReportDateFilters } from "./report-date-filters";
import { useReportDateFilters } from "../hooks/use-report-date-filters";
import { useGetItemTransactions } from "../hooks/use-get-item-transactions";
import { getItemTransactionColumns } from "../columns/item-transaction-columns";

interface ItemTransactionsPageProps {
  storeId: string;
  itemId: string;
}

export function ItemTransactionsPage({ storeId, itemId }: ItemTransactionsPageProps) {
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

  const { data: response, isLoading } = useGetItemTransactions(storeId, itemId, {
    page: tableFilters.page,
    limit: tableFilters.limit,
    search: tableFilters.debouncedSearch.trim() || undefined,
    fromDate: fromDateStr,
    toDate: toDateStr,
    sortBy: tableFilters.sortBy,
    sortOrder: tableFilters.sortOrder,
  });

  const transactions = response?.data?.transactions || [];
  const itemInfo = response?.data?.item;
  const storeInfo = response?.data?.store;
  const pagination = response?.pagination;

  const columns = useMemo(
    () =>
      getItemTransactionColumns({
        page: tableFilters.page,
        limit: tableFilters.limit,
        itemUnit: itemInfo?.unit,
        onImageClick: (url) => setLightboxImage(url),
      }),
    [tableFilters.page, tableFilters.limit, itemInfo?.unit],
  );

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const { data: exportRes } = await apiClient.get(
        REPORT_ENDPOINTS.EXPORT_ITEM_TRANSACTIONS(storeId, itemId),
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

      const exportList = exportRes?.data?.transactions || transactions || [];
      const itemNameClean = (itemInfo?.productName || "Item").replace(/[^a-zA-Z0-9]/g, "_");

      exportToExcel(`${itemNameClean}_Transactions_Page_${tableFilters.page}`, exportList, [
        {
          label: "S.No",
          key: (_, index) => (tableFilters.page - 1) * tableFilters.limit + index + 1,
        },
        { label: "Ref No.", key: "referenceNumber" },
        { label: "Order ID", key: "orderId" },
        { label: "Customer Name", key: (tx) => tx.customer?.name || "-" },
        { label: "Customer Email", key: (tx) => tx.customer?.email || "-" },
        { label: "Customer Phone", key: (tx) => tx.customer?.phone || "-" },
        { label: "Receiver Name", key: (tx) => tx.receiver?.name || "-" },
        {
          label: "Receiver Location",
          key: (tx) => `${tx.receiver?.city || ""}, ${tx.receiver?.country || ""}`,
        },
        { label: "Quantity", key: (tx) => `${tx.quantity} ${itemInfo?.unit || "pcs"}` },
        { label: "Unit Price", key: (tx) => `$${Number(tx.unitPrice).toFixed(2)}` },
        { label: "Total Amount", key: "totalAmountFormatted" },
        { label: "Order Status", key: "orderStatus" },
        { label: "Date & Time", key: "date" },
      ]);
    } catch {
      // Fallback local export
      const itemNameClean = (itemInfo?.productName || "Item").replace(/[^a-zA-Z0-9]/g, "_");
      exportToExcel(`${itemNameClean}_Transactions_Page_${tableFilters.page}`, transactions, [
        {
          label: "S.No",
          key: (_, index) => (tableFilters.page - 1) * tableFilters.limit + index + 1,
        },
        { label: "Ref No.", key: "referenceNumber" },
        { label: "Order ID", key: "orderId" },
        { label: "Customer Name", key: (tx) => tx.customer?.name || "-" },
        { label: "Customer Email", key: (tx) => tx.customer?.email || "-" },
        { label: "Customer Phone", key: (tx) => tx.customer?.phone || "-" },
        { label: "Receiver Name", key: (tx) => tx.receiver?.name || "-" },
        {
          label: "Receiver Location",
          key: (tx) => `${tx.receiver?.city || ""}, ${tx.receiver?.country || ""}`,
        },
        { label: "Quantity", key: (tx) => `${tx.quantity} ${itemInfo?.unit || "pcs"}` },
        { label: "Unit Price", key: (tx) => `$${Number(tx.unitPrice).toFixed(2)}` },
        { label: "Total Amount", key: "totalAmountFormatted" },
        { label: "Order Status", key: "orderStatus" },
        { label: "Date & Time", key: "date" },
      ]);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading && !itemInfo) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Loading item transaction report...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumbs={[
          { label: "Report Management" },
          { label: "Store Reports", href: ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT },
          {
            label: storeInfo?.storeName || "Store Detail",
            href: ROUTES.ADMIN.REPORT_MANAGEMENT.STORE_REPORT_DETAIL(storeId),
          },
          { label: itemInfo?.productName || "Item Transactions" },
        ]}
      />

      <Card className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="grid items-center gap-6 md:grid-cols-12">
          <div className="flex items-center gap-4 md:col-span-6">
            <div
              onClick={() => itemInfo?.productImage && setLightboxImage(itemInfo.productImage)}
              className={`group relative size-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800 ${
                itemInfo?.productImage ? "cursor-pointer" : ""
              }`}
            >
              {itemInfo?.productImage ? (
                <>
                  <Image
                    src={itemInfo.productImage}
                    alt={itemInfo.productName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                    <Maximize2 className="size-5 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex size-full items-center justify-center text-slate-400">
                  <Package className="size-8" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {itemInfo?.productName || "Item Transactions"}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2.5 py-0.5 font-semibold text-orange-700 dark:bg-orange-950/60 dark:text-orange-400">
                  <Tag className="size-3" />
                  UPC: {itemInfo?.upcCode || "N/A"}
                </span>

                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <Store className="size-3" />
                  {storeInfo?.storeName}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:col-span-6">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Units Sold
              </p>
              <p className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">
                {itemInfo?.totalUnitsSold || 0} {itemInfo?.unit || "pcs"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Total Sales
              </p>
              <p className="mt-1 text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {itemInfo?.totalSalesAmount || "$0.00"}
              </p>
            </div>

            <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-center sm:col-span-1 dark:border-slate-800 dark:bg-slate-800/50">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Total Orders
              </p>
              <p className="mt-1 text-sm font-extrabold text-blue-600 dark:text-blue-400">
                {pagination?.total || transactions.length}
              </p>
            </div>
          </div>
        </div>
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
          <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
            <Receipt className="size-4 text-orange-600" />
            Customer Purchase History & Transactions Log
          </CardTitle>

          <Button
            disabled={isExporting}
            onClick={handleExportExcel}
            className="h-9 gap-2 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700"
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="size-4" />
            )}
            <span>Export Excel</span>
          </Button>
        </CardHeader>

        <CardContent className="p-0 pt-3">
          <DataTable
            columns={columns}
            data={transactions}
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
            loading={isLoading}
          />
        </CardContent>
      </Card>

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
