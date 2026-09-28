import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";

export function useGetProductBoxItems(boxId: string, filters: any) {
  const queryParams = new URLSearchParams();

  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
  if (filters.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

  const queryString = queryParams.toString();
  const url = `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_PRODUCT_BOX(boxId)}/items${queryString ? `?${queryString}` : ""}`;

  return useApiQuery<any>(
    [
      ...API_CACHE_KEYS.PRODUCT_BOX_BY_ID(boxId),
      "items",
      filters.page,
      filters.limit,
      filters.search,
      filters.sortBy,
      filters.sortOrder,
    ],
    url,
    { enabled: !!boxId },
  );
}
