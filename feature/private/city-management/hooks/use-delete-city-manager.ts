import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/hooks/useApi";

export function useDeleteCityManager(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse, void>(
    "delete",
    CITY_MANAGER_ENDPOINTS.DELETE_CITY_MANAGER(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.CITY_MANAGERS,
        });
      },
    },
  );
}
