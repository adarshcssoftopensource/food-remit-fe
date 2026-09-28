import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface BulkPermanentDeleteResponse {
  message: string;
}

export function useBulkPermanentDeleteUsers() {
  const queryClient = useQueryClient();

  return useApiMutation<BulkPermanentDeleteResponse, { ids: string[] }>(
    "post",
    USER_MANAGEMENT_ENDPOINTS.BULK_PERMANENT_DELETE_USERS(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.USERS });
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.RECYCLED_USERS });
      },
    },
  );
}
