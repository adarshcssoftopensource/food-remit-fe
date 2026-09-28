import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";

interface MarkupResponse {
  message: string;
  status: boolean;
  data: {
    markupPercentage: string;
    revenue: string;
    tax: string;
  };
}

export function useGetMarkup() {
  return useApiQuery<MarkupResponse>(API_CACHE_KEYS.SETTINGS_MARKUP, SETTINGS_ENDPOINTS.GET_MARKUP);
}
