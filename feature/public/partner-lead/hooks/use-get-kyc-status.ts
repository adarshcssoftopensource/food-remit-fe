import { fetcher } from "@/hooks/useApi";
import { KYC_ENDPOINTS } from "@/lib/api/endpoints/kyc.endpoints";
import { KycStatusResponse } from "../types/kyc.types";

export async function fetchKycStatus(sessionId: string, skipToast = true) {
  return fetcher<KycStatusResponse>({
    method: "get",
    url: KYC_ENDPOINTS.GET_STATUS(sessionId),
    skipErrorToast: skipToast,
  });
}
