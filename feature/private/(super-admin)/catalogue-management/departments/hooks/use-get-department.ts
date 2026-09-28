import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { useMemo } from "react";
import type { DepartmentData } from "../types/department.types";

interface GetDepartmentResponse {
  status: boolean;
  message: string;
  data: DepartmentData;
}

export function useGetDepartment(id: string) {
  const query = useApiQuery<GetDepartmentResponse>(
    ["department", id],
    CATALOGUE_MANAGEMENT_ENDPOINTS.GET_DEPARTMENT(id),
    {
      enabled: !!id,
    },
  );

  const data = useMemo<DepartmentData | undefined>(() => {
    return query.data?.data;
  }, [query.data]);

  return { ...query, data };
}
