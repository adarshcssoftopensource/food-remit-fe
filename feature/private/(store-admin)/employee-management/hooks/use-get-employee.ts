import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import type { Employee } from "../types/employee-management";

interface GetEmployeeResponse {
  message: string;
  status: boolean;
  data: Employee;
}

export function useGetEmployee(id: string) {
  return useQuery({
    queryKey: API_CACHE_KEYS.EMPLOYEE_BY_ID(id),
    queryFn: async () => {
      const { data } = await apiClient.get<GetEmployeeResponse>(
        EMPLOYEE_ENDPOINTS.GET_EMPLOYEE(id),
      );
      return data.data;
    },
    enabled: !!id,
  });
}
