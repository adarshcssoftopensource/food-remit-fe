import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useQuery } from "@tanstack/react-query";
import type { OrderReportRow } from "../columns/order-report-columns";

export interface GetStoreOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: number;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface StoreOrdersResponse {
  message: string;
  status: boolean;
  data: OrderReportRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetStoreOrders(storeId: string, params?: GetStoreOrdersParams) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.STORE_ORDERS(storeId), params],
    queryFn: async () => {
      const { data } = await apiClient.get<StoreOrdersResponse>(
        REPORT_ENDPOINTS.GET_STORE_ORDERS(storeId),
        { params },
      );
      return data;
    },
    enabled: Boolean(storeId),
  });
}
