import { useQuery } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { CREDITS_ENDPOINTS } from "@/lib/api/endpoints/credits.endpoints";
import type { CreditsListResponse, GetCreditsParams } from "../types/credits.types";

export type { GetCreditsParams, CreditsListResponse };

export function useGetCredits(params?: GetCreditsParams) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.CREDITS, params],
    queryFn: async () => {
      const { data } = await apiClient.get<CreditsListResponse>(CREDITS_ENDPOINTS.BASE, { params });
      return data;
    },
  });
}
