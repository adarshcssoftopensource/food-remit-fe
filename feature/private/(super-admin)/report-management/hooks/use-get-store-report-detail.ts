import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { REPORT_ENDPOINTS } from "@/lib/api/endpoints/reports.endpoints";
import { useQuery } from "@tanstack/react-query";
import type { StoreReportRow } from "@/constants/report-management";

export interface StoreReportDetailResponse {
  message: string;
  status: boolean;
  data: StoreReportRow;
}

export function useGetStoreReportDetail(
  storeId: string,
  params?: { fromDate?: string; toDate?: string },
) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.STORE_REPORT_DETAIL(storeId), params],
    queryFn: async () => {
      const { data } = await apiClient.get<StoreReportDetailResponse>(
        REPORT_ENDPOINTS.GET_STORE_REPORT_DETAIL(storeId),
        { params },
      );
      return data;
    },
    enabled: Boolean(storeId),
  });
}
