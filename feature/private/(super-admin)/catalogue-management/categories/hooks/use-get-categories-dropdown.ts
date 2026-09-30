import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";

import { CategoryDropdownItem } from "../types/category.types";

export function useGetCategoriesDropdown(countryId?: string) {
  return useApiQuery<{ data: CategoryDropdownItem[] }>(
    ["categories", "dropdown", countryId || ""],
    `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_CATEGORIES}/dropdown${countryId ? `?countryId=${countryId}` : ""}`,
    {},
  );
}
