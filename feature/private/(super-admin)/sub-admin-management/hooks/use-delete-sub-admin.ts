import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteSubAdmin() {
  const queryClient = useQueryClient();

  return useApiMutation<{ message: string; status: boolean; data: any }, string>(
    "delete",
    (id: string) => SUB_ADMIN_ENDPOINTS.DELETE_SUB_ADMIN(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.SUB_ADMINS });
        queryClient.invalidateQueries({ queryKey: ["sub-admins"] });
        queryClient.invalidateQueries({ queryKey: ["RECYCLED_SUB_ADMINS"] });
      },
    },
  );
}
