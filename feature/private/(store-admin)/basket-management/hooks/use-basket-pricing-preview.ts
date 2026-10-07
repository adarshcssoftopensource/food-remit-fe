import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetcher } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";
import { useDebounce } from "@/lib/debounce";

import type { BasketItemInput, BasketPricingPreview } from "../types/basket.types";

/** Server-calculated pricing for the current (unsaved) item selection */
export function useBasketPricingPreview(storeId: string | undefined, items: BasketItemInput[]) {
  const debouncedItems = useDebounce(items, 300);
  return useQuery({
    queryKey: [...API_CACHE_KEYS.BASKET_PRICING, storeId, debouncedItems],
    queryFn: async () => {
      const res = await fetcher<{ data: BasketPricingPreview }>({
        method: "post",
        url: BASKET_ENDPOINTS.PRICING_PREVIEW,
        body: { storeId, items: debouncedItems },
      });
      return res.data;
    },
    enabled: Boolean(storeId) && debouncedItems.length > 0,
    placeholderData: keepPreviousData,
  });
}
