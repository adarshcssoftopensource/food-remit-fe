import type {
  StoreData,
  StoreListResponse,
} from "@/feature/private/store-management/types/store-management";
import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";

export interface UseGetStoresDropdownArgs {
  countryId?: string;
  cityId?: string;
  enabled?: boolean;
}

export function useGetStoresDropdown(args?: UseGetStoresDropdownArgs) {
  const hasCountry = Boolean(
    args?.countryId && args.countryId !== "All" && args.countryId !== "all",
  );
  const isEnabled = args?.enabled !== undefined ? args.enabled : hasCountry;

  const queryString = buildUrl("", {
    limit: "1000",
    status: "ACTIVE",
    country: hasCountry ? args?.countryId : undefined,
    city: args?.cityId && args.cityId !== "All" && args.cityId !== "all" ? args.cityId : undefined,
  }).replace("?", "");

  const queryKey = [...API_CACHE_KEYS.STORES, "dropdown", queryString];
  const url = `${STORE_ENDPOINTS.GET_STORES}${queryString ? `?${queryString}` : ""}`;

  const { data, isLoading, isError, error, refetch } = useApiQuery<StoreListResponse>(
    queryKey,
    url,
    { enabled: isEnabled },
  );

  const stores = useMemo<StoreData[]>(() => {
    if (!data?.data) return [];
    return data.data.map((item: any): StoreData => ({
      id: item.id,
      storeImage: item.storeImage ?? "",
      storeName: item.storeName ?? "",
      storeAddress: item.storeAddress ?? "",
      address2: item.storeAddress2 ?? "",
      storeCountry: item.countryId ?? "",
      storeCountryName: item.countryName ?? item.countryId ?? "",
      storeCity: item.cityId ?? "",
      storeCityName: item.cityName ?? item.cityId ?? "",
      storePhoneCode: item.storeCountryCode ?? "",
      storePhoneNumber: item.storePhoneNumber ?? "",
      storeTax: item.storeTax ?? 0,
      foodRemitCommission: item.foodRemitCommission ?? 0,
      assignedCityManager: item.assignedCityManager,
      status: item.status === "ACTIVE" ? "Active" : "Inactive",
      createdAt: item.addedOn ?? new Date().toISOString(),
      managerId: item.storeManager?.id ?? "",
      managerImage: item.storeManager?.image ?? "",
      managerFirstName: item.storeManager?.firstName ?? "",
      managerLastName: item.storeManager?.lastName ?? "",
      managerEmail: item.storeManager?.email ?? "",
      managerPhoneCode: item.storeManager?.countryCode ?? "",
      managerPhoneNumber: item.storeManager?.phoneNumber ?? "",
      managerAddress: item.storeManager?.address ?? "",
      managerCountry: item.storeManager?.country ?? "",
      managerState: item.storeManager?.state ?? "",
      managerCity: item.storeManager?.city ?? "",
      managerZipCode: item.storeManager?.zipCode ?? "",
    }));
  }, [data]);

  return {
    data: stores,
    isLoading,
    isError,
    error,
    refetch,
  };
}
