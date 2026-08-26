import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { CITY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/city-manager.endpoints";
import { COUNTRY_MANAGER_ENDPOINTS } from "@/lib/api/endpoints/country-manager.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import { useApiQuery } from "@/hooks/useApi";
import { useMemo } from "react";
import { normalizeUser } from "../../users-management/lib/normalize-user";

export type RecycleEntityType =
  | "users"
  | "stores"
  | "items"
  | "departments"
  | "categories"
  | "city-managers"
  | "country-managers";

export interface RecycledQueryArgs {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  status?: string | null;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface RawRecycledResponse {
  message?: string;
  status?: boolean;
  stats?: {
    total: number;
    active: number;
    inactive: number;
  };
  data?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const ENDPOINT_MAP: Record<RecycleEntityType, string> = {
  users: USER_MANAGEMENT_ENDPOINTS.GET_RECYCLED_USERS,
  stores: STORE_ENDPOINTS.GET_RECYCLED_STORES,
  items: CATALOGUE_MANAGEMENT_ENDPOINTS.GET_RECYCLED_ITEMS,
  departments: CATALOGUE_MANAGEMENT_ENDPOINTS.GET_RECYCLED_DEPARTMENTS,
  categories: CATALOGUE_MANAGEMENT_ENDPOINTS.GET_RECYCLED_CATEGORIES,
  "city-managers": CITY_MANAGER_ENDPOINTS.GET_RECYCLED_CITY_MANAGERS,
  "country-managers": COUNTRY_MANAGER_ENDPOINTS.GET_RECYCLED_COUNTRY_MANAGERS,
};

export function useGetRecycledData(entityType: RecycleEntityType, args: RecycledQueryArgs = {}) {
  const endpoint = ENDPOINT_MAP[entityType];
  const url = buildUrl(endpoint, {
    ...args,
    sortOrder: args.sortOrder ?? "desc",
  });
  const cacheKey = buildCacheKey(`RECYCLED_${entityType.toUpperCase().replace(/-/g, "_")}`, {
    ...args,
    sortOrder: args.sortOrder ?? "desc",
  });

  const query = useApiQuery<RawRecycledResponse>(cacheKey, url, {});

  const formattedData = useMemo(() => {
    const api = query.data;
    if (!api) return undefined;

    let items = api.data ?? [];
    if (entityType === "users") {
      items = items.map((item) => normalizeUser(item));
    }

    return {
      message: api.message || "Data fetched successfully",
      stats: api.stats ?? { total: api.pagination?.total ?? items.length, active: 0, inactive: 0 },
      data: items,
      pagination: api.pagination ?? { page: 1, limit: 10, total: items.length, totalPages: 1 },
    };
  }, [query.data, entityType]);

  return { ...query, formattedData };
}
