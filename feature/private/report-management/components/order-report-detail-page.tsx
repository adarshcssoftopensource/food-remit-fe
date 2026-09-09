"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BadgeDollarSign,
  Calendar,
  CreditCard,
  HandCoins,
  Receipt,
  RotateCcw,
  ShoppingBag,
  Store,
  UserX,
} from "lucide-react";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useDebounce } from "@/lib/debounce";
import { getCurrencySymbol, cleanCurrencyDisplay } from "@/lib/utils/currency";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderPartyCard } from "./order-party-card";
import { OrderItemsTable, ItemStats, OrderItem } from "./order-items-table";
import {
  OrderFinancialBreakdown,
  CustomerPaymentData,
  FoodRemitEarningsData,
  VendorSettlementData,
} from "./order-financial-breakdown";
import { OrderReportDetailSkeleton } from "./order-report-detail-skeleton";

interface OrderReportDetailPageProps {
  orderId: string;
  onBack: () => void;
}

interface FinancialDetails {
  markup: string;
  markupVal: number;
  processingFee: string;
  processingFeeVal: number;
  commissionEarnings: string;
  commissionEarningsVal: number;
  refundedAmount: string;
  refundedAmountVal: number;
  itemTax: string;
  itemTaxVal: number;
  totalAmount: string;
  totalAmountVal: number;
}

interface OrderDetailResponse {
  order: {
    id: string;
    refrenceNumber: string;
    orderDate: string;
    currency: string;
    transactionAmount: number;
    formattedPrice: string;
    paymentMode: string;
    foodType: string;
    orderType: number;
    orderStatus: number;
    statusLabel: string;
    handedOverBy?: string;
    recurringOrderType: number;
    comment: string;
    customerSignature: string | null;
    markup?: string;
    markupVal?: number;
    processingFee?: string;
    processingFeeVal?: number;
    commissionEarnings?: string;
    commissionEarningsVal?: number;
    refundedAmount?: string;
    refundedAmountVal?: number;
    itemTax?: string;
    itemTaxVal?: number;
  };
  sender: {
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    countryCode: string;
    fullPhone: string;
    city: string;
    country: string;
    fullAddress: string;
  };
  receiver: {
    firstName: string;
    lastName: string;
    fullName: string;
    phoneNumber: string;
    countryCode: string;
    fullPhone: string;
    city: string;
    country: string;
    fullAddress: string;
    customerSignature: string | null;
  };
  store: {
    id: string;
    storeName: string;
    storeAddress: string;
  };
  financials?: FinancialDetails;
  customerPayment?: CustomerPaymentData;
  foodRemitEarnings?: FoodRemitEarningsData;
  vendorSettlement?: VendorSettlementData;
  orderItems: OrderItem[];
  itemStats?: ItemStats;
}

export function OrderReportDetailPage({ orderId, onBack }: OrderReportDetailPageProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Table state for order items
  const [itemSearch, setItemSearch] = useState("");
  const debouncedItemSearch = useDebounce(itemSearch, 400);

  const [itemFilter, setItemFilter] = useState<"all" | "available" | "delivered">("all");
  const [itemPage, setItemPage] = useState(1);
  const [itemPageSize, setItemPageSize] = useState(50);
  const [itemSortBy, setItemSortBy] = useState("productName");
  const [itemSortOrder, setItemSortOrder] = useState<"asc" | "desc">("asc");

  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "order-report-detail",
      orderId,
      itemPage,
      itemPageSize,
      debouncedItemSearch,
      itemFilter,
      itemSortBy,
      itemSortOrder,
    ],
    queryFn: async () => {
      const res = await apiClient.get<{
        data: OrderDetailResponse;
        pagination?: { total: number; page: number; limit: number; totalPages: number };
      }>(REPORT_ENDPOINTS.GET_ORDER_REPORT_DETAIL(orderId), {
        params: {
          page: itemPage,
          limit: itemPageSize,
          search: debouncedItemSearch.trim() || undefined,
          itemFilter,
          sortBy: itemSortBy,
          sortOrder: itemSortOrder,
        },
      });
      return res.data;
    },
    staleTime: 30 * 1000,
  });

  if (isLoading && !responseData) {
    return <OrderReportDetailSkeleton />;
  }

  if (isError || !responseData?.data) {
    return (
      <div className="space-y-6">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2 rounded-xl">
          <ArrowLeft className="size-4" /> Back to Orders
        </Button>
        <Card className="rounded-2xl border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/50">
            <UserX className="size-6 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-rose-900 dark:text-rose-200">
            Failed to Load Order Details
          </h3>
          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
            {(error as Error)?.message || "Order information could not be retrieved."}
          </p>
          <Button
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-rose-600 text-white hover:bg-rose-700"
          >
            Retry Loading
          </Button>
        </Card>
      </div>
    );
  }

  const {
    order,
    sender,
    receiver,
    store,
    financials,
    customerPayment,
    foodRemitEarnings,
    vendorSettlement,
    orderItems = [],
    itemStats,
  } = responseData.data;

  const safeSender = sender || { fullName: "N/A", fullPhone: "N/A", fullAddress: "N/A" };
  const safeReceiver = receiver || { fullName: "N/A", fullPhone: "N/A", fullAddress: "N/A" };
  const safeStore = store || { id: "", storeName: "N/A", storeAddress: "N/A" };

  const currencySymbol = getCurrencySymbol(order.currency);
  const totalDisplay = cleanCurrencyDisplay(
    order.formattedPrice || order.transactionAmount,
    currencySymbol,
  );
  const markupDisplay = cleanCurrencyDisplay(financials?.markup || order.markup, currencySymbol);
  const processingFeeDisplay = cleanCurrencyDisplay(
    financials?.processingFee || order.processingFee,
    currencySymbol,
  );
  const commissionDisplay = cleanCurrencyDisplay(
    financials?.commissionEarnings || order.commissionEarnings,
    currencySymbol,
  );
  const itemTaxDisplay = cleanCurrencyDisplay(financials?.itemTax || order.itemTax, currencySymbol);
  const refundedDisplay = cleanCurrencyDisplay(
    financials?.refundedAmount || order.refundedAmount,
    currencySymbol,
  );
  const isRefunded =
    (financials?.refundedAmountVal ?? order.refundedAmountVal ?? 0) > 0 ||
    order.orderStatus === 0 ||
    order.orderStatus === 7;

  const pagination = responseData.pagination || {
    total: orderItems.length,
    page: 1,
    limit: 50,
    totalPages: 1,
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="size-9 rounded-xl border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="size-4 text-slate-700 dark:text-slate-300" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Order #{order.refrenceNumber}
              </h1>
              <OrderStatusBadge status={order.orderStatus} label={order.statusLabel} />
            </div>
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
              <Calendar className="size-3.5" /> Ordered on{" "}
              {new Date(order.orderDate).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-xl border-amber-500/20 bg-amber-500/5 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300"
          >
            <Store className="mr-1 size-3.5" /> {safeStore.storeName}
          </Badge>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20 rounded-xl px-3 py-1.5 text-xs font-bold"
          >
            <ShoppingBag className="mr-1 size-3.5" /> {order.foodType}
          </Badge>
        </div>
      </div>

      {/* Executive Financial KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Total Transaction */}
        <Card className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-xs dark:bg-emerald-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                Total Transaction
              </p>
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CreditCard className="size-4" />
              </div>
            </div>
            <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
              {totalDisplay}
            </h3>
            <p className="text-muted-foreground mt-0.5 truncate text-[11px]">{order.paymentMode}</p>
          </CardContent>
        </Card>

        {/* Markup */}
        <Card className="overflow-hidden rounded-2xl border border-purple-500/20 bg-purple-500/5 shadow-xs dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-purple-600 uppercase dark:text-purple-400">
                Markup
              </p>
              <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
                <BadgeDollarSign className="size-4" />
              </div>
            </div>
            <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
              {markupDisplay}
            </h3>
            <p className="text-muted-foreground mt-0.5 truncate text-[11px]">Food Remit Share</p>
          </CardContent>
        </Card>

        {/* Processing Fee */}
        <Card className="overflow-hidden rounded-2xl border border-blue-500/20 bg-blue-500/5 shadow-xs dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                Processing Fee
              </p>
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600 dark:text-blue-400">
                <Receipt className="size-4" />
              </div>
            </div>
            <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
              {processingFeeDisplay}
            </h3>
            <p className="text-muted-foreground mt-0.5 truncate text-[11px]">Platform Fee</p>
          </CardContent>
        </Card>

        {/* Commission Earnings */}
        <Card className="overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/5 shadow-xs dark:bg-amber-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                Commission
              </p>
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <HandCoins className="size-4" />
              </div>
            </div>
            <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
              {commissionDisplay}
            </h3>
            <p className="text-muted-foreground mt-0.5 truncate text-[11px]">Store Commission</p>
          </CardContent>
        </Card>

        {/* Item Tax */}
        <Card className="overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-500/5 shadow-xs dark:bg-indigo-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                Item Tax
              </p>
              <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <Receipt className="size-4" />
              </div>
            </div>
            <h3 className="mt-2 truncate text-xl font-black text-slate-900 dark:text-white">
              {itemTaxDisplay}
            </h3>
            <p className="text-muted-foreground mt-0.5 truncate text-[11px]">Govt Store Tax</p>
          </CardContent>
        </Card>

        {/* Refunded Amount */}
        <Card className="overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 shadow-xs dark:bg-rose-950/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                Refunded Amount
              </p>
              <div className="flex size-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <RotateCcw className="size-4" />
              </div>
            </div>
            <h3
              className={`mt-2 truncate text-xl font-black ${isRefunded ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}
            >
              {isRefunded ? `-${refundedDisplay}` : `${currencySymbol}0.00`}
            </h3>
            <p className="text-muted-foreground mt-0.5 truncate text-[11px]">
              {isRefunded ? "Order Cancelled / Refunded" : "No Refund"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3-Step Financial Breakdown (Matching Order Management) */}
      <div className="space-y-3">
        <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
          Financial & Settlement Breakdown
        </h2>
        <OrderFinancialBreakdown
          customerPayment={customerPayment}
          foodRemitEarnings={foodRemitEarnings}
          vendorSettlement={vendorSettlement}
        />
      </div>

      {/* Party Details Grid: Sender & Receiver */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <OrderPartyCard type="sender" details={safeSender} />
        <OrderPartyCard
          type="receiver"
          details={safeReceiver}
          onPreviewSignature={(url) => setLightboxSrc(url)}
        />
      </div>

      {/* View Items in Order Table with Backend Search, Pagination, Filtering & Sorting */}
      <OrderItemsTable
        orderItems={orderItems}
        currency={currencySymbol}
        itemStats={itemStats}
        itemFilter={itemFilter}
        onItemFilterChange={(newFilter) => {
          setItemFilter(newFilter);
          setItemPage(1);
        }}
        searchValue={itemSearch}
        onSearchChange={(val) => {
          setItemSearch(val);
          setItemPage(1);
        }}
        currentPage={itemPage}
        totalPages={pagination.totalPages}
        rowsPerPage={itemPageSize}
        onPageChange={setItemPage}
        onRowsPerPageChange={(newLimit) => {
          setItemPageSize(newLimit);
          setItemPage(1);
        }}
        onSortingChange={(field, order) => {
          setItemSortBy(field);
          setItemSortOrder(order);
          setItemPage(1);
        }}
        loading={isFetching}
        onPreviewImage={(url) => setLightboxSrc(url)}
      />

      <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </div>
  );
}
