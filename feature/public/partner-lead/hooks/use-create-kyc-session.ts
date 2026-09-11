import { useApiMutation } from "@/hooks/useApi";
import { KYC_ENDPOINTS } from "@/lib/api/endpoints/kyc.endpoints";
import { CreateKycSessionPayload, CreateKycSessionResponse } from "../types/kyc.types";

export function useCreateKycSession() {
  return useApiMutation<CreateKycSessionResponse, CreateKycSessionPayload>(
    "post",
    KYC_ENDPOINTS.CREATE_SESSION,
  );
}
