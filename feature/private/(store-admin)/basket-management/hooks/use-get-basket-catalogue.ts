import { keepPreviousData } from "@tanstack/react-query";

import { useApiQuery } from "@/hooks/useApi";
import { buildUrl } from "@/lib/build-query-string";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { BASKET_ENDPOINTS } from "@/lib/api/endpoints/basket.endpoints";

import type { GetCatalogueResponse } from "../types/basket.types";

interface CatalogueParams {
  storeId?: string;
  page: number;
  limit: number;
  search?: string;
  categoryId?: string;
}

export function useGetBasketCatalogue(params: CatalogueParams) {
  return useApiQuery<GetCatalogueResponse>(
    [...API_CACHE_KEYS.BASKET_CATALOGUE, params],
    buildUrl(BASKET_ENDPOINTS.CATALOGUE, { ...params }),
    { enabled: Boolean(params.storeId), placeholderData: keepPreviousData },
  );
}
