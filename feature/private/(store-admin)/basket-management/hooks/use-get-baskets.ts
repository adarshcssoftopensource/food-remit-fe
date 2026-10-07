import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/useApi";
import { buildUrl } from "@/lib/build-query-string";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

import type { BasketListParams, GetBasketsResponse } from "../types/basket.types";

export function useGetBaskets(params: BasketListParams) {
  return useApiQuery<GetBasketsResponse>(
    [...API_CACHE_KEYS.BASKETS, "list", params],
    buildUrl(BASKET_ENDPOINTS.LIST, { ...params }),
    { enabled: Boolean(params.storeId), placeholderData: keepPreviousData },
  );
}
