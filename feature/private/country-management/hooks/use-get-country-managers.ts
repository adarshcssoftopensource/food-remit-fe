import { useApiQuery } from "@/hooks/useApi";
import { buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import type {
  CountryManagerData,
  CountryManagerListResponse,
  RawCountryManager,
  UseGetCountryManagersArgs,
} from "../types/country-manager";
import { COUNTRY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/country-manager.endpoints";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export function useGetCountryManagers(args?: UseGetCountryManagersArgs) {
  const queryString = buildUrl("", {
    page: args?.page?.toString(),
    limit: args?.limit?.toString(),
    search: args?.search,
    sortBy: args?.sortBy,
    sortOrder: args?.sortOrder,
    status: args?.status,
    fromDate: args?.fromDate,
    toDate: args?.toDate,
  }).replace("?", "");

  const queryKey = [...API_CACHE_KEYS.COUNTRY_MANAGERS, queryString];
  const url = `${COUNTRY_MANAGER_ENDPOINTS.GET_COUNTRY_MANAGERS}?${queryString}`;

  const {
    data: rawData,
    isLoading,
    refetch,
  } = useApiQuery<CountryManagerListResponse>(queryKey, url);

  const countryManagers = useMemo<CountryManagerData[]>(() => {
    if (!rawData?.data) return [];
    return rawData.data.map((item: RawCountryManager) => ({
      id: item.id,
      userId: item.id,
      firstName: item.firstName,
      image: item.image,
      lastName: item.lastName,
      email: item.email,
      phoneCode: item.countryCode ?? "",
      phoneNumber: item.phoneNumber ?? "",
      address1: item.address ?? "",
      address2: item.address2 ?? "",
      residentialCountry: item.country ?? "",
      state: item.state ?? "",
      city: item.city ?? "",
      zipcode: item.zipcode ?? "",
      assignCountryName: item.assignCountryName ?? "",
      assignedCityManagers: [],
      cityManagers: [],
      createdAt: item.addedOn ?? new Date().toISOString(),
      status: (item.managerStatus === "ACTIVE" ? "Active" : "Inactive") as "Active" | "Inactive",
    }));
  }, [rawData]);

  return {
    data: countryManagers,
    isLoading,
    refetch,
    pagination: rawData?.status ? (rawData as any).pagination : undefined,
  };
}
