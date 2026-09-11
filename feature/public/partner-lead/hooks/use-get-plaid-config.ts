import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { PLAID_ENDPOINTS } from "@/lib/api/endpoints/plaid.endpoints";
import { PlaidConfigResponse } from "../types/plaid.types";

export function useGetPlaidConfig() {
  return useApiQuery<PlaidConfigResponse>(API_CACHE_KEYS.PLAID_CONFIG, PLAID_ENDPOINTS.CONFIG, {
    staleTime: 60 * 1000,
    skipErrorToast: true,
  });
}
