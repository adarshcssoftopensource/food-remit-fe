import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";

import { CategoryDropdownItem } from "../types/category.types";

export function useGetCategoriesDropdown(countryId?: string, cityId?: string) {
  const params = new URLSearchParams();
  if (countryId) params.set("countryId", countryId);
  if (cityId) params.set("cityId", cityId);
  const qs = params.toString();

  return useApiQuery<{ data: CategoryDropdownItem[] }>(
    ["categories", "dropdown", countryId || "", cityId || ""],
    `${CATALOGUE_MANAGEMENT_ENDPOINTS.GET_CATEGORIES}/dropdown${qs ? `?${qs}` : ""}`,
    {},
  );
}
