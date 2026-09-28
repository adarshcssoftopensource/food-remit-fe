import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useQuery } from "@tanstack/react-query";

export interface CustomerOrderRow {
  id: string;
  refrenceNumber: string;
  senderName: string;
  storeName: string;
  status: number;
  statusLabel: string;
  handedOverBy: string;
  orderType?: number;
  totalAmount?: number;
  currency?: string;
  createdAt: string;
}

export interface GetCustomerOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: number;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CustomerOrdersResponse {
  message: string;
  status: boolean;
  data: CustomerOrderRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetCustomerOrders(customerId: string, params?: GetCustomerOrdersParams) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.CUSTOMER_ORDERS(customerId), params],
    queryFn: async () => {
      const { data } = await apiClient.get<CustomerOrdersResponse>(
        REPORT_ENDPOINTS.GET_CUSTOMER_ORDERS(customerId),
        { params },
      );
      return data;
    },
    enabled: Boolean(customerId),
  });
}
