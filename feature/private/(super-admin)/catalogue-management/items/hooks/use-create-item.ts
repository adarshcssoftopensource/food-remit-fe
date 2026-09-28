import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useApiMutation<any, FormData>("post", CATALOGUE_MANAGEMENT_ENDPOINTS.GET_ITEMS, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ITEMS });
    },
  });
}
