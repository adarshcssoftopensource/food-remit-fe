"use client";

import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Building2,
  CreditCard,
  Globe,
  Hash,
  Mail,
  Map,
  MapPin,
  Phone,
  Receipt,
  RotateCcw,
  ShoppingBag,
  User,
} from "lucide-react";

import { format } from "date-fns";
import { cleanCurrencyDisplay } from "@/lib/utils/currency";
import { DataTable } from "@/components/common/data-table/data-table";
import { PageHeader } from "@/components/common/page-header";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import type { StoreReportRow } from "@/constants/report-management";
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
import {
  StoreManagerOverviewCard,
  StoreOrdersCardHeader,
  StoreReportBanner,
  type StoreManagerRow,
} from "./store-report-detail-sections";

type StoreReportDetailProps = {
  storeId: string;
};

function getStoreManagerRows(store: StoreReportRow | undefined): StoreManagerRow[] {
  return store
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
        // {
        //   label: "Commission Earning",
        //   value: cleanCurrencyDisplay(store.earnings?.totalCommission),
        //   icon: HandCoins,
        // },
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
}

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

  const managerRows = getStoreManagerRows(store);

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
      <StoreReportBanner
        store={store}
        totalOrdersCount={totalOrdersCount}
        onImageClick={setLightboxImage}
      />

      <StoreManagerOverviewCard managerRows={managerRows} />

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
        <StoreOrdersCardHeader
          totalOrdersCount={totalOrdersCount}
          isOrdersFetching={isOrdersFetching}
          foodType={foodType}
          onFoodTypeChange={handleFoodTypeChange}
          isExporting={isExporting}
          onExport={handleExportOrdersExcel}
        />

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
