import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useQuery } from "@tanstack/react-query";
import type { StoreReportRow } from "@/constants/report-management";

export interface GetStoreReportsParams {
  page?: number;
  limit?: number;
  search?: string;
  country?: string;
  city?: string;
  fromDate?: string;
  toDate?: string;
}

export interface StoreReportsResponse {
  message: string;
  status: boolean;
  data: StoreReportRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useGetStoreReports(params?: GetStoreReportsParams) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.STORE_REPORTS, params],
    queryFn: async () => {
      const { data } = await apiClient.get<StoreReportsResponse>(
        REPORT_ENDPOINTS.GET_STORE_REPORTS,
        { params },
      );
      return data;
    },
  });
}
