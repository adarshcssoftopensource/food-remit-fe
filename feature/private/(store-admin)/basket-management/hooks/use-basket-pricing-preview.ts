import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { fetcher } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";
import { useDebounce } from "@/lib/debounce";

import type {
  BasketItemInput,
  BasketPricingOptions,
  BasketPricingPreview,
} from "../types/basket.types";

/** Server-calculated pricing for the current (unsaved) items and pricing option */
export function useBasketPricingPreview(
  storeId: string | undefined,
  items: BasketItemInput[],
  options: BasketPricingOptions,
) {
  const { pricingMode, vendorDiscountPercent, manualVendorPrice } = options;
  const input = useMemo(
    () => ({ items, options: { pricingMode, vendorDiscountPercent, manualVendorPrice } }),
    [items, pricingMode, vendorDiscountPercent, manualVendorPrice],
  );
  const debounced = useDebounce(input, 300);
  return useQuery({
    queryKey: [...API_CACHE_KEYS.BASKET_PRICING, storeId, debounced],
    queryFn: async () => {
      const res = await fetcher<{ data: BasketPricingPreview }>({
        method: "post",
        url: BASKET_ENDPOINTS.PRICING_PREVIEW,
        body: { storeId, items: debounced.items, ...debounced.options },
        skipErrorToast: true,
      });
      return res.data;
    },
    enabled: Boolean(storeId) && debounced.items.length > 0,
    placeholderData: keepPreviousData,
  });
}
