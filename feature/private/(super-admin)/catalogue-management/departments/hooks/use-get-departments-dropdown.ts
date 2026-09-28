import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";

import { DepartmentDropdownItem } from "../types/department.types";

export function useGetDepartmentsDropdown(countryId?: string) {
  return useApiQuery<{ data: DepartmentDropdownItem[] }>(
    ["departments", "dropdown", countryId || ""],
    `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_DEPARTMENTS}/dropdown${countryId ? `?countryId=${countryId}` : ""}`,
    {},
  );
}
