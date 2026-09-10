import { useQuery } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { CREDITS_ENDPOINTS } from "@/lib/api/endpoints/credits.endpoints";
import type { CreditDetailData } from "../types/credits.types";

export interface CreditDetailResponse {
  message: string;
  status: boolean;
  data: CreditDetailData;
}

export function useGetCreditDetail(orderId: string | null) {
  return useQuery({
    queryKey: orderId ? API_CACHE_KEYS.CREDIT_BY_ID(orderId) : ["credit-none"],
    queryFn: async () => {
      if (!orderId) throw new Error("Order ID is required");
      const { data } = await apiClient.get<CreditDetailResponse>(CREDITS_ENDPOINTS.DETAIL(orderId));
      return data?.data;
    },
    enabled: Boolean(orderId),
  });
}
