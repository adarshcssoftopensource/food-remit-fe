"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ImageLightbox } from "@/components/common/image-lightbox";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { useDebounce } from "@/lib/debounce";
import { toast } from "sonner";
import { getCurrencySymbol, cleanCurrencyDisplay } from "@/lib/utils/currency";
import { useProfile } from "@/components/providers/profile-provider";
import { OrderPartyCard } from "./order-party-card";
import { OrderItemsTable } from "./order-items-table";
import { OrderFinancialBreakdown } from "./order-financial-breakdown";
import {
  OrderReportError,
  OrderReportHeader,
  OrderReportSummaryCards,
} from "./order-report-detail-sections";
import { OrderReportDetailSkeleton } from "./order-report-detail-skeleton";
import type { FinancialDetails, OrderDetailResponse } from "./order-report-detail.types";

function getSafeOrderParties(
  sender: OrderDetailResponse["sender"],
  receiver: OrderDetailResponse["receiver"],
  store: OrderDetailResponse["store"],
) {
  const safeSender = sender || { fullName: "N/A", fullPhone: "N/A", fullAddress: "N/A" };
  const safeReceiver = receiver || { fullName: "N/A", fullPhone: "N/A", fullAddress: "N/A" };
  const safeStore = store || { id: "", storeName: "N/A", storeAddress: "N/A" };
  return { safeSender, safeReceiver, safeStore };
}

function getOrderFinancialDisplays(
  order: OrderDetailResponse["order"],
  financials: FinancialDetails | undefined,
  currencySymbol: string,
) {
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
  return {
    totalDisplay,
    markupDisplay,
    processingFeeDisplay,
    commissionDisplay,
    itemTaxDisplay,
    refundedDisplay,
    isRefunded,
  };
}

interface OrderReportDetailPageProps {
  orderId: string;
  onBack: () => void;
}

export function OrderReportDetailPage({ orderId, onBack }: OrderReportDetailPageProps) {
  const { canViewPlatformFees } = useProfile();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Refund mutation
  const refundMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(ORDER_ENDPOINTS.TRIGGER_REFUND(orderId));
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(
        `Partial refund of ${data?.data?.refundAmount?.toFixed(2) ?? ""} processed successfully via ${data?.data?.paymentMethod ?? "Stripe"}.`,
      );
      queryClient.invalidateQueries({ queryKey: ["order-report-detail", orderId] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || err?.message || "Failed to process refund.");
    },
  });

  // Table state for order items
  const [itemSearch, setItemSearch] = useState("");
  const debouncedItemSearch = useDebounce(itemSearch, 400);

  const [itemFilter, setItemFilter] = useState<"all" | "available" | "delivered" | "outOfStock">(
    "all",
  );
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
    return <OrderReportError error={error} onBack={onBack} onRetry={() => refetch()} />;
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

  const { safeSender, safeReceiver, safeStore } = getSafeOrderParties(sender, receiver, store);

  const currencySymbol = getCurrencySymbol(order.currency);
  const {
    totalDisplay,
    markupDisplay,
    processingFeeDisplay,
    itemTaxDisplay,
    refundedDisplay,
    isRefunded,
  } = getOrderFinancialDisplays(order, financials, currencySymbol);

  const pagination = responseData.pagination || {
    total: orderItems.length,
    page: 1,
    limit: 50,
    totalPages: 1,
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <OrderReportHeader
        order={order}
        storeName={safeStore.storeName}
        vendorSettlement={vendorSettlement}
        isRefundPending={refundMutation.isPending}
        isRefundSuccess={refundMutation.isSuccess}
        onRefund={() => refundMutation.mutate()}
        onBack={onBack}
      />

      <OrderReportSummaryCards
        canViewPlatformFees={canViewPlatformFees}
        totalDisplay={totalDisplay}
        paymentMode={order.paymentMode}
        markupDisplay={markupDisplay}
        processingFeeDisplay={processingFeeDisplay}
        itemTaxDisplay={itemTaxDisplay}
        refundedDisplay={refundedDisplay}
        isRefunded={isRefunded}
        currencySymbol={currencySymbol}
        orderStatus={order.orderStatus}
      />

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
