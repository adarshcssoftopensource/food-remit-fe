import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { GetItemsResponse, UseGetItemsArgs } from "../types/item.types";

export function useGetItems(args: UseGetItemsArgs) {
  const queryParams = new URLSearchParams();

  if (args.page) queryParams.append("page", args.page.toString());
  if (args.limit) queryParams.append("limit", args.limit.toString());
  if (args.search) queryParams.append("search", args.search);
  if (args.countryId) queryParams.append("countryId", args.countryId);
  if (args.departmentId) queryParams.append("departmentId", args.departmentId);
  if (args.categoryId) queryParams.append("categoryId", args.categoryId);
  if (args.status) queryParams.append("status", args.status);
  if (args.fromDate) queryParams.append("fromDate", args.fromDate);
  if (args.toDate) queryParams.append("toDate", args.toDate);
  if (args.sortBy) queryParams.append("sortBy", args.sortBy);
  if (args.sortOrder) queryParams.append("sortOrder", args.sortOrder);

  const queryString = queryParams.toString();
  const url = `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_ITEMS}${queryString ? `?${queryString}` : ""}`;

  return useApiQuery<GetItemsResponse>(["items", ...Object.values(args).map(String)], url);
}
