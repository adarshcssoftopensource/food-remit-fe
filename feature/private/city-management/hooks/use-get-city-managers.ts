import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import type {
  CityManagerData,
  CityManagerListResponse,
  RawCityManager,
  UseGetCityManagersArgs,
} from "../types/city-manager";

export function useGetCityManagers(args?: UseGetCityManagersArgs) {
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

  const queryKey = [...API_CACHE_KEYS.CITY_MANAGERS, queryString];
  const url = `${CITY_MANAGER_ENDPOINTS.GET_CITY_MANAGERS}?${queryString}`;

  const { data: rawData, isLoading, refetch } = useApiQuery<CityManagerListResponse>(queryKey, url);

  const cityManagers = useMemo<CityManagerData[]>(() => {
    if (!rawData?.data) return [];
    return rawData.data.map((item: RawCityManager) => ({
      id: item.id,
      userId: item.id,
      image: item.image ?? undefined,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phoneCode: item.countryCode ?? "",
      phoneNumber: item.phoneNumber ?? "",
      address1: item.address ?? "",
      address2: item.address2 ?? "",
      residentialCountry: item.residentialCountry ?? "",
      state: item.state ?? "",
      city: item.city ?? "",
      zipcode: item.zipcode ?? "",
      countryName: item.countryName ?? "",
      assignedCityNames: item.assignCityNames ?? [],
      country: item.country ?? "",
      assignedCities: item.assignCities ? item.assignCities.split(",").map((id) => id.trim()) : [],
      createdAt: item.addedOn ?? new Date().toISOString(),
      status: (item.managerStatus === "ACTIVE" ? "Active" : "Inactive") as "Active" | "Inactive",
      countryManagerId: item.countryManagerId,
    }));
  }, [rawData]);

  return {
    data: cityManagers,
    isLoading,
    refetch,
    pagination: rawData?.status ? (rawData as any).pagination : undefined,
  };
}
