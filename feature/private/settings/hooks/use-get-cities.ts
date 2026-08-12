import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import { normalizeCity } from "../lib/normalize-city";
import type { CityData, GetCitiesResponse, UseGetCitiesArgs } from "../types/settings.types";

const CACHE_PREFIX = API_CACHE_KEYS.SETTINGS_CITIES[0];

interface RawGetCitiesResponse {
  message: string;
  data: Record<string, unknown>[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useGetCities(args: UseGetCitiesArgs = {}) {
  const cleanArgs: Record<string, unknown> = {};
  if (args.page) cleanArgs.page = args.page;
  if (args.limit) cleanArgs.limit = args.limit;
  if (args.search) cleanArgs.search = args.search;
  if (args.countryId && args.countryId !== "All" && args.countryId !== "all") {
    cleanArgs.countryId = args.countryId;
  }
  if (args.sortBy) cleanArgs.sortBy = args.sortBy;
  cleanArgs.sortOrder = args.sortOrder ?? "asc";

  const url = buildUrl(SETTINGS_ENDPOINTS.GET_CITIES, cleanArgs);
  const cacheKey = buildCacheKey(CACHE_PREFIX, cleanArgs);

  const query = useApiQuery<RawGetCitiesResponse>(cacheKey, url, {});

  const data = useMemo<GetCitiesResponse | undefined>(() => {
    const api = query.data;
    if (!api) return undefined;

    return {
      message: api.message,
      data: (api.data ?? []).map((item): CityData => normalizeCity(item)),
      pagination: api.pagination ?? {
        page: 1,
        limit: args.limit ?? 10,
        total: 0,
        totalPages: 1,
      },
    };
  }, [query.data, args.limit]);

  return { ...query, data };
}

export type { UseGetCitiesArgs };
