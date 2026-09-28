import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { COUNTRY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/country-manager.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/hooks/useApi";

export function useDeleteCountryManager(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse, void>(
    "delete",
    COUNTRY_MANAGER_ENDPOINTS.DELETE_COUNTRY_MANAGER(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.COUNTRY_MANAGERS,
        });
      },
    },
  );
}
