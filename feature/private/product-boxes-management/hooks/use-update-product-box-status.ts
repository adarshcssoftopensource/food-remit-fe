import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useQueryClient } from "@tanstack/react-query";

export function useUpdateProductBoxStatus() {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; status: boolean }>(
    "patch",
    (data) => CATALOGUE_MANAGEMENT_ENDPOINTS.UPDATE_PRODUCT_BOX_STATUS(data.id),
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.PRODUCT_BOXES });
        queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.PRODUCT_BOX_BY_ID(variables.id) });
      },
    },
  );
}
