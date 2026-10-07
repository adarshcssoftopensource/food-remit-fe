import { useMutation, useQueryClient } from "@tanstack/react-query";

import { successToast } from "@/components/toaster";
import { fetcher } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

import type { GetBasketResponse, UpsertBasketPayload } from "../types/basket.types";

/** Creates a basket, or updates it when `id` is given. Publishing is a flag on the payload. */
export function useSaveBasket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: UpsertBasketPayload }) =>
      fetcher<GetBasketResponse, UpsertBasketPayload>({
        method: id ? "put" : "post",
        url: id ? BASKET_ENDPOINTS.UPDATE(id) : BASKET_ENDPOINTS.CREATE,
        body: payload,
      }),
    onSuccess: (res) => {
      successToast({ description: res.message });
      queryClient.setQueryData(API_CACHE_KEYS.BASKET_BY_ID(res.data.id), res);
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.BASKETS });
    },
  });
}
