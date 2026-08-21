import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/hooks/useApi";

export function useDeleteStore(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse, void>("delete", STORE_ENDPOINTS.DELETE_STORE(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.STORES });
    },
  });
}
