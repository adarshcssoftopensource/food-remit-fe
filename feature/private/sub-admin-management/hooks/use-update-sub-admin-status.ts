import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateSubAdminResponse, UpdateSubAdminStatusPayload } from "../types/sub-admin.types";

export function useUpdateSubAdminStatus(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateSubAdminResponse, UpdateSubAdminStatusPayload>(
    "patch",
    SUB_ADMIN_ENDPOINTS.UPDATE_SUB_ADMIN_STATUS(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.SUB_ADMINS });
      },
    },
  );
}
