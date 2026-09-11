import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { KYC_ENDPOINTS } from "@/lib/api/endpoints/kyc.endpoints";
import { KycConfigResponse } from "../types/kyc.types";

export function useGetKycConfig() {
  return useApiQuery<KycConfigResponse>(API_CACHE_KEYS.KYC_CONFIG, KYC_ENDPOINTS.CONFIG, {
    staleTime: 60 * 1000,
    skipErrorToast: true,
  });
}
