import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useRemoveProductBoxItem(boxId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    "delete",
    (itemId) => CATALOGUE_MANAGEMENT_ENDPOINTS.REMOVE_PRODUCT_BOX_ITEM(boxId, itemId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.PRODUCT_BOX_BY_ID(boxId) });
      },
    },
  );
}
