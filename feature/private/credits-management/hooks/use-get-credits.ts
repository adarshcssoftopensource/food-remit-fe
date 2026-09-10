import { useQuery } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { CREDITS_ENDPOINTS } from "@/lib/api/endpoints/credits.endpoints";
import type { CreditsData, CreditsSummary } from "../types/credits.types";

export interface GetCreditsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  countryId?: string;
  cityId?: string;
  storeId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface CreditsListResponse {
  message: string;
  status: boolean;
  data: CreditsData[];
  summary: CreditsSummary;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetCredits(params?: GetCreditsParams) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.CREDITS, params],
    queryFn: async () => {
      const { data } = await apiClient.get<CreditsListResponse>(CREDITS_ENDPOINTS.BASE, { params });
      return data;
    },
  });
}
