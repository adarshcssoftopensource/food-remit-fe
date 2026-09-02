import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useQuery } from "@tanstack/react-query";

export interface ItemTransactionRow {
  id: string;
  orderId: string;
  referenceNumber: string;
  orderStatus: string;
  orderStatusCode: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  totalAmountFormatted: string;
  date: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string;
    phone: string;
    city: string;
    state: string;
    country: string;
  };
  payment: {
    currency: string;
    paymentType: string;
    cardType: string;
    lastFourDigit: string;
  };
}

export interface ItemTransactionsResponse {
  message: string;
  status: boolean;
  data: {
    item: {
      id: string;
      productName: string;
      productImage: string | null;
      upcCode: string;
      unit: string;
      price?: number;
      totalUnitsSold?: number;
      totalSalesAmount?: string;
      currency?: string;
    };
    store: {
      id: string;
      storeName: string;
    };
    transactions: ItemTransactionRow[];
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetItemTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function useGetItemTransactions(
  storeId: string,
  itemId: string,
  params?: GetItemTransactionsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.ITEM_TRANSACTIONS(storeId, itemId), params],
    queryFn: async () => {
      const { data } = await apiClient.get<ItemTransactionsResponse>(
        REPORT_ENDPOINTS.GET_ITEM_TRANSACTIONS(storeId, itemId),
        { params },
      );
      return data;
    },
    enabled: Boolean(storeId) && Boolean(itemId) && enabled,
  });
}
