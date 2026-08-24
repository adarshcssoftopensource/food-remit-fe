import { useQuery } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { OrderData } from "../types/order.types";

interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: number | string;
  fromDate?: string;
  toDate?: string;
  country?: string;
  city?: string;
  sortBy?: string;
  sortOrder?: string;
  userId?: string;
  recieverId?: string;
}

interface OrdersResponse {
  message: string;
  status: boolean;
  data: OrderData[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetOrders(params?: GetOrdersParams) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.ORDERS, params],
    queryFn: async () => {
      const { data } = await apiClient.get<OrdersResponse>(ORDER_ENDPOINTS.BASE, {
        params,
      });
      return data;
    },
  });
}
