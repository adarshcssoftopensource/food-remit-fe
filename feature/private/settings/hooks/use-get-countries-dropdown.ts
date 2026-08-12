import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import type { CountryDropdownItem, GetCountriesDropdownResponse } from "../types/settings.types";

export function useGetCountriesDropdown() {
  const url = buildUrl(SETTINGS_ENDPOINTS.GET_COUNTRIES_DROPDOWN, {
    sortBy: "name",
    sortOrder: "asc",
  });
  const query = useApiQuery<GetCountriesDropdownResponse>(
    API_CACHE_KEYS.SETTINGS_COUNTRIES_DROPDOWN,
    url,
    {},
  );

  const data = useMemo<CountryDropdownItem[]>(() => {
    const rawList = query.data?.data ?? [];
    return rawList.map((item: any) => ({
      id: String(item.id ?? ""),
      name: String(item.name ?? item.countryName ?? ""),
      countryName: String(item.name ?? item.countryName ?? ""),
      countryCode: item.countryCode ? String(item.countryCode) : null,
      currency: item.currency ? String(item.currency) : null,
    }));
  }, [query.data]);

  return {
    ...query,
    countries: data,
  };
}
