import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import type { UseMutationOptions } from "@tanstack/react-query";

export interface VerifyPasswordPayload {
  password: string;
}

export interface VerifyPasswordResponse {
  message: string;
  status: boolean;
}

export function useVerifyAdminPassword(
  options?: UseMutationOptions<VerifyPasswordResponse, Error, VerifyPasswordPayload> & {
    skipErrorToast?: boolean;
    timeout?: number;
  },
) {
  return useApiMutation<VerifyPasswordResponse, VerifyPasswordPayload>(
    "post",
    AUTH_ENDPOINTS.VERIFY_PASSWORD,
    {
      skipErrorToast: true,
      ...options,
    },
  );
}
