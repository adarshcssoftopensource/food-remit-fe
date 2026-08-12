import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";

export function useGetDepartmentsDropdown(countryId?: string) {
  return useApiQuery(
    ["departments", "dropdown", countryId || ""],
    `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_DEPARTMENTS}/dropdown${countryId ? `?countryId=${countryId}` : ""}`,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  );
}
