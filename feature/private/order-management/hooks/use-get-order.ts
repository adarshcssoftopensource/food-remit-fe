import { useQuery } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { OrderData } from "../types/order.types";

interface GetOrderResponse {
  message: string;
  status: boolean;
  data: OrderData;
}

export function useGetOrder(id: string) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.ORDERS, id],
    queryFn: async () => {
      const { data } = await apiClient.get<GetOrderResponse>(ORDER_ENDPOINTS.DETAILS(id));
      return data.data;
    },
    enabled: Boolean(id),
  });
}
