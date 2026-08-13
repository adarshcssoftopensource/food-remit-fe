import { useApiQuery } from "@/hooks/useApi";
import { buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import type { StoreData } from "@/constants/store-management";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

// ── API response types ────────────────────────────────────────────────────────

interface RawStoreManager {
  image?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
}

interface RawStore {
  id: string;
  storeImage?: string;
  storeName: string;
  storeAddress?: string;
  storeAddress2?: string;
  country?: string;
  city?: string;
  storeCountryCode?: string;
  storePhoneNumber?: string;
  storeTax?: number;
  foodRemitCommission?: number;
  status?: string;
  addedOn?: string;
  storeManager?: RawStoreManager;
}

interface StoreListResponse {
  data: RawStore[];
  pagination?: unknown;
  message: string;
  status: boolean;
}

// ── Args ──────────────────────────────────────────────────────────────────────

export interface UseGetStoresArgs {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Hook ──────────────────────────────────────────────────────────────────────

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
      storeCity: item.city ?? "",
      storePhoneCode: item.storeCountryCode ?? "",
      storePhoneNumber: item.storePhoneNumber ?? "",
      storeTax: item.storeTax ?? 0,
      foodRemitCommission: item.foodRemitCommission ?? 0,
      status: item.status === "ACTIVE" ? "Active" : "Inactive",
      createdAt: item.addedOn ?? new Date().toISOString(),
      // Manager data
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
