import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";

interface AutoAbandonResponse {
  message: string;
  status: boolean;
  data: {
    autoAbandonDays: number;
    autoAbandonRemark: string;
  };
}

export function useGetAutoAbandon() {
  return useApiQuery<AutoAbandonResponse>(
    API_CACHE_KEYS.SETTINGS_AUTO_ABANDON,
    SETTINGS_ENDPOINTS.GET_AUTO_ABANDON,
  );
}
