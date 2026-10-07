import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

import type { GetBasketResponse } from "../types/basket.types";

export function useGetBasket(id?: string) {
  return useApiQuery<GetBasketResponse>(
    API_CACHE_KEYS.BASKET_BY_ID(id ?? ""),
    BASKET_ENDPOINTS.DETAIL(id ?? ""),
    { enabled: Boolean(id) },
  );
}
