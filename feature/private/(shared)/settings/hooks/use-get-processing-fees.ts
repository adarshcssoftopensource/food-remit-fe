import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";

export interface ProcessingFeeItem {
  id: string;
  countryName: string;
  countryCode?: string;
  currency?: string;
  currencySymbol?: string;
  processingFee: string;
}

interface GetProcessingFeesArgs {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface RawGetProcessingFeesResponse {
  message: string;
  status: boolean;
  data: ProcessingFeeItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useGetProcessingFees(args: GetProcessingFeesArgs = {}) {
  const url = buildUrl(SETTINGS_ENDPOINTS.GET_PROCESSING_FEES, args);
  const cacheKey = buildCacheKey(API_CACHE_KEYS.SETTINGS_PROCESSING_FEES[0], args);

  return useApiQuery<RawGetProcessingFeesResponse>(cacheKey, url, {});
}
