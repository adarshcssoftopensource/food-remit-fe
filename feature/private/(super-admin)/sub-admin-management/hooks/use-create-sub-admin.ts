import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { CreateSubAdminPayload, CreateSubAdminResponse } from "../types/sub-admin.types";

export function useCreateSubAdmin() {
  const queryClient = useQueryClient();

  return useApiMutation<CreateSubAdminResponse, CreateSubAdminPayload>(
    "post",
    SUB_ADMIN_ENDPOINTS.CREATE_SUB_ADMIN,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.SUB_ADMINS });
      },
    },
  );
}
