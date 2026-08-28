import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { GetProductBoxesResponse, UseGetProductBoxesArgs } from "../types/product-box.types";

export function useGetProductBoxes(args: UseGetProductBoxesArgs) {
  const queryParams = new URLSearchParams();

  if (args.page) queryParams.append("page", args.page.toString());
  if (args.limit) queryParams.append("limit", args.limit.toString());
  if (args.search) queryParams.append("search", args.search);
  if (args.sortBy) queryParams.append("sortBy", args.sortBy);
  if (args.sortOrder) queryParams.append("sortOrder", args.sortOrder);

  const queryString = queryParams.toString();
  const url = `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_PRODUCT_BOXES}${queryString ? `?${queryString}` : ""}`;

  return useApiQuery<GetProductBoxesResponse>(
    [...API_CACHE_KEYS.PRODUCT_BOXES, ...Object.values(args).map(String)],
    url,
  );
}
