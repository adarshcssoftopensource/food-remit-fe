import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { UpdateSubAdminPayload, UpdateSubAdminResponse } from "../types/sub-admin.types";

export function useUpdateSubAdmin(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<UpdateSubAdminResponse, UpdateSubAdminPayload>(
    "patch",
    SUB_ADMIN_ENDPOINTS.UPDATE_SUB_ADMIN(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.SUB_ADMINS });
      },
    },
  );
}
