import { useQueryClient } from "@tanstack/react-query";

import { successToast } from "@/components/toaster";
import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

export function useDeleteBasket() {
  const queryClient = useQueryClient();
  return useApiMutation<{ message: string }, { id: string }>(
    "delete",
    (body) => BASKET_ENDPOINTS.DELETE(body.id),
    {
      onSuccess: (res, body) => {
        successToast({ description: res.message });
        queryClient.removeQueries({ queryKey: API_CACHE_KEYS.BASKET_BY_ID(body.id) });
        void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.BASKETS });
      },
    },
  );
}
