import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import { buildUrl } from "@/lib/build-query-string";
import type { GetEmployeesResponse } from "../types/employee-management";

export interface UseGetEmployeesArgs {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
}

export function useGetEmployees(args?: UseGetEmployeesArgs) {
  const queryString = buildUrl("", {
    page: args?.page?.toString() ?? "1",
    limit: args?.limit?.toString() ?? "10",
    search: args?.search,
    sortBy: args?.sortBy,
    sortOrder: args?.sortOrder,
    status: args?.status,
  }).replace("?", "");

  const queryKey = [...API_CACHE_KEYS.EMPLOYEES, queryString];
  const url = `${EMPLOYEE_ENDPOINTS.GET_EMPLOYEES}?${queryString}`;

  const { data, isLoading, isError, error, refetch } = useApiQuery<GetEmployeesResponse>(
    queryKey,
    url,
  );

  return {
    data: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
    refetch,
  };
}
