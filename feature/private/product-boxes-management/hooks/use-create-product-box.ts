import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateProductBox() {
  const queryClient = useQueryClient();

  return useApiMutation<any, any>("post", CATALOGUE_MANAGEMENT_ENDPOINTS.CREATE_PRODUCT_BOX, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.PRODUCT_BOXES });
    },
  });
}
