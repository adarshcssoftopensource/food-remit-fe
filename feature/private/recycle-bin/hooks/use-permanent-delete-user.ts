import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

interface PermanentDeleteResponse {
  message: string;
}

export function usePermanentDeleteUser(userId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<PermanentDeleteResponse, void>(
    "delete",
    USER_MANAGEMENT_ENDPOINTS.PERMANENT_DELETE_USER(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.USERS });
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.RECYCLED_USERS });
      },
    },
  );
}
