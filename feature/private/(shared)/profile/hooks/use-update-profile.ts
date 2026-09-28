import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";

interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
}

interface UpdateProfileResponse {
  message: string;
  status: boolean;
  data: Record<string, unknown>;
  error: Record<string, unknown>;
}

export function useUpdateProfile() {
  return useApiMutation<UpdateProfileResponse, UpdateProfilePayload | FormData>(
    "patch",
    AUTH_ENDPOINTS.PROFILE,
  );
}
