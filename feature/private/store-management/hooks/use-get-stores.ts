import { useApiQuery } from "@/hooks/useApi";
import { buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import type {
  RawStore,
  SingleStoreResponse,
  StoreData,
  StoreListResponse,
  UseGetStoresArgs,
} from "@/feature/private/store-management/types/store-management";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

export function useGetStores(args?: UseGetStoresArgs) {
  const queryString = buildUrl("", {
    page: args?.page?.toString() ?? "1",
    limit: args?.limit?.toString() ?? "10",
    ...(args?.search && { search: args.search }),
    ...(args?.sortBy && { sortBy: args.sortBy }),
    ...(args?.sortOrder && { sortOrder: args.sortOrder }),
  }).replace("?", "");

  const queryKey = [...API_CACHE_KEYS.STORES, queryString];
  const url = `${STORE_ENDPOINTS.GET_STORES}?${queryString}`;

  const { data, isLoading, isError, error, refetch } = useApiQuery<StoreListResponse>(
    queryKey,
    url,
  );

  const stores = useMemo<StoreData[]>(() => {
    if (!data?.data) return [];
    return data.data.map((item: RawStore): StoreData => ({
      id: item.id,
      storeImage: item.storeImage ?? "",
      storeName: item.storeName,
      storeAddress: item.storeAddress ?? "",
      address2: item.storeAddress2 ?? "",
      storeCountry: item.country ?? "",
      storeCountryName: item.countryName ?? item.country ?? "",
      storeCity: item.city ?? "",
      storeCityName: item.cityName ?? item.city ?? "",
      storePhoneCode: item.storeCountryCode ?? "",
      storePhoneNumber: item.storePhoneNumber ?? "",
      storeTax: item.storeTax ?? 0,
      foodRemitCommission: item.foodRemitCommission ?? 0,
      status: item.status === "ACTIVE" ? "Active" : "Inactive",
      createdAt: item.addedOn ?? new Date().toISOString(),
      // Manager data
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
    pagination: data?.pagination,
    isLoading,
    isError,
    error,
    refetch,
  };
}

export function useGetStore(id: string) {
  const { data, isLoading, isError, error, refetch } = useApiQuery<SingleStoreResponse>(
    [API_CACHE_KEYS.STORES[0], id],
    STORE_ENDPOINTS.GET_STORES + `/${id}`,
    { enabled: !!id },
  );

  const store = useMemo<StoreData | null>(() => {
    if (!data?.data) return null;
    const item = data.data;

    return {
      id: item.id,
      storeImage: item.storeImage ?? "",
      storeName: item.storeName ?? "",
      storeAddress: item.storeAddress ?? "",
      address2: item.storeAddress2 ?? "",
      storeCountry: item.country ?? "",
      storeCountryName: item.countryName ?? item.country ?? "",
      storeCity: item.city ?? "",
      storeCityName: item.cityName ?? item.city ?? "",
      storePhoneCode: item.storeCountryCode ?? "",
      storePhoneNumber: item.storePhoneNumber ?? "",
      storeTax: item.storeTax ?? 0,
      foodRemitCommission: item.foodRemitCommission ?? 0,
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
    };
  }, [data]);

  return { data: store, isLoading, isError, error, refetch };
}
