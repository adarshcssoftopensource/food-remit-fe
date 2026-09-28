import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import {
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/feature/private/(shared)/settings/types/settings.types";

export function useChangePassword() {
  return useApiMutation<ChangePasswordResponse, ChangePasswordPayload>(
    "post",
    AUTH_ENDPOINTS.CHANGE_PASSWORD,
  );
}
