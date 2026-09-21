import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";

export interface VerifyPasswordPayload {
  password: string;
}

export interface VerifyPasswordResponse {
  message: string;
  status: boolean;
}

export function useVerifyAdminPassword() {
  return useApiMutation<VerifyPasswordResponse, VerifyPasswordPayload>(
    "post",
    AUTH_ENDPOINTS.VERIFY_PASSWORD,
  );
}
