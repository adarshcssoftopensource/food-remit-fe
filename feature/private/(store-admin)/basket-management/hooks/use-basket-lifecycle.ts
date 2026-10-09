import { useQueryClient } from "@tanstack/react-query";

import { successToast } from "@/components/toaster";
import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

import type { GetBasketResponse } from "../types/basket.types";

function useInvalidateBaskets() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.BASKETS });
}

/** Draft → Active */
export function usePublishBasket() {
  const invalidate = useInvalidateBaskets();
  return useApiMutation<GetBasketResponse, { id: string }>(
    "post",
    (body) => BASKET_ENDPOINTS.PUBLISH(body.id),
    {
      onSuccess: (res) => {
        successToast({ description: res.message });
        void invalidate();
      },
    },
  );
}
