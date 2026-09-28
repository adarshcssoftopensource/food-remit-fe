import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useDeleteProductBox() {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    "delete",
    (id) => CATALOGUE_MANAGEMENT_ENDPOINTS.DELETE_PRODUCT_BOX(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.PRODUCT_BOXES });
      },
    },
  );
}
