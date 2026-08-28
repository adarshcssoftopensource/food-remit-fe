import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import { useQuery } from "@tanstack/react-query";

interface EmployeeOrdersResponse {
  message: string;
  status: boolean;
  data: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UseGetEmployeeOrdersParams {
  employeeId: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useGetEmployeeOrders({
  employeeId,
  page = 1,
  limit = 10,
  fromDate,
  toDate,
  search,
  sortBy,
  sortOrder,
}: UseGetEmployeeOrdersParams) {
  return useQuery({
    queryKey: [
      ...API_CACHE_KEYS.EMPLOYEE_ORDERS(employeeId),
      { page, limit, fromDate, toDate, search, sortBy, sortOrder },
    ],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit };
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (search) params.search = search;
      if (sortBy) params.sortBy = sortBy;
      if (sortOrder) params.sortOrder = sortOrder;

      const { data } = await apiClient.get<EmployeeOrdersResponse>(
        EMPLOYEE_ENDPOINTS.GET_EMPLOYEE_ORDERS(employeeId),
        { params },
      );
      return data;
    },
    enabled: !!employeeId,
  });
}
