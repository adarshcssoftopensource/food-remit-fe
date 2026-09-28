import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { COUNTRY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/country-manager.endpoints";
import { useMemo } from "react";
import type { CountryManagerData, SingleCountryManagerResponse } from "../types/country-manager";

export function useGetCountryManager(id: string) {
  const { data, isLoading, isError, error, refetch } = useApiQuery<SingleCountryManagerResponse>(
    [API_CACHE_KEYS.COUNTRY_MANAGERS[0], id],
    COUNTRY_MANAGER_ENDPOINTS.GET_COUNTRY_MANAGERS + `/${id}`,
    { enabled: !!id },
  );

  const manager = useMemo<CountryManagerData | null>(() => {
    if (!data?.data) return null;
    const item = data.data;

    return {
      id: item.id,
      userId: item.id,
      image: item.image,
      firstName: item.firstName,
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
      assignedCountry: item.assignCountries ?? "",
      assignedCityManagers: [],
      cityManagers: item.cityManagers ?? [],
      createdAt: item.addedOn ?? new Date().toISOString(),
      status: (item.managerStatus === "ACTIVE" ? "Active" : "Inactive") as "Active" | "Inactive",
    };
  }, [data]);

  return { data: manager, isLoading, isError, error, refetch };
}
