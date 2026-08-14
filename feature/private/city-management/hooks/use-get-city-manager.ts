import { useApiQuery } from "@/hooks/useApi";
import { useMemo } from "react";
import type { CityManagerData, SingleCityManagerResponse } from "../types/city-manager";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export function useGetCityManager(id: string) {
  const { data, isLoading, isError, error, refetch } = useApiQuery<SingleCityManagerResponse>(
    [API_CACHE_KEYS.CITY_MANAGERS[0], id],
    CITY_MANAGER_ENDPOINTS.GET_CITY_MANAGERS + `/${id}`,
    { enabled: !!id },
  );

  const manager = useMemo<CityManagerData | null>(() => {
    if (!data?.data) return null;
    const item = data.data;

    return {
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
    };
  }, [data]);

  return { data: manager, isLoading, isError, error, refetch };
}
