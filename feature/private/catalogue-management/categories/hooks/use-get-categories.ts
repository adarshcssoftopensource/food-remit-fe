import { useApiQuery } from "@/hooks/useApi";
import { CATALOGUE_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/catalogue-management.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import type {
  CategoryData,
  GetCategoriesResponse,
  UseGetCategoriesArgs,
} from "../types/category.types";

const CACHE_PREFIX = "categories";

interface RawGetCategoriesResponse {
  message: string;
  stats?: {
    total: number;
    active: number;
    inactive: number;
  };
  data: CategoryData[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useGetCategories(args: UseGetCategoriesArgs = {}) {
  const url = buildUrl(CATALOGUE_MANAGEMENT_ENDPOINTS.GET_CATEGORIES, {
    ...args,
    sortOrder: args.sortOrder ?? "desc",
  });
  const cacheKey = buildCacheKey(CACHE_PREFIX, {
    ...args,
    sortOrder: args.sortOrder ?? "desc",
  });

  const query = useApiQuery<RawGetCategoriesResponse>(cacheKey, url, {
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const data = useMemo<GetCategoriesResponse | undefined>(() => {
    const api = query.data;
    if (!api) return undefined;

    return {
      message: api.message,
      stats: api.stats ?? { total: 0, active: 0, inactive: 0 },
      data: api.data ?? [],
      pagination: api.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
  }, [query.data]);

  return { ...query, data };
}

export type { UseGetCategoriesArgs };
