import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { ProductBox } from "../types/product-box.types";

export function useGetProductBox(id?: string) {
  return useApiQuery<ProductBox>(
    API_CACHE_KEYS.PRODUCT_BOX_BY_ID(id || ""),
    id ? CATALOGUE_MANAGEMENT_ENDPOINTS.GET_PRODUCT_BOX(id) : "",
    { enabled: !!id },
  );
}
