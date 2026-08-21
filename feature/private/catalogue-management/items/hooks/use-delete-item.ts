import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/hooks/useApi";

export function useDeleteItem(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse, void>(
    "delete",
    CATALOGUE_MANAGEMENT_ENDPOINTS.DELETE_ITEM(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.ITEMS,
        });
      },
    },
  );
}
