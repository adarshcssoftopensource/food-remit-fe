import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useAddProductBoxItem(boxId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<any, { itemId: string }>(
    "post",
    CATALOGUE_MANAGEMENT_ENDPOINTS.ADD_PRODUCT_BOX_ITEM(boxId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.PRODUCT_BOX_BY_ID(boxId) });
      },
    },
  );
}
