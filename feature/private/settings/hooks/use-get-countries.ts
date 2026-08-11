import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { SETTINGS_ENDPOINTS } from "@/lib/api/endpoints/settings.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import { normalizeCountry } from "../lib/normalize-country";
import type {
  CountryData,
  GetCountriesResponse,
  UseGetCountriesArgs,
} from "../types/settings.types";

const CACHE_PREFIX = API_CACHE_KEYS.SETTINGS_COUNTRIES[0];

interface RawGetCountriesResponse {
  message: string;
  data: Record<string, unknown>[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useGetCountries(args: UseGetCountriesArgs = {}) {
  const url = buildUrl(SETTINGS_ENDPOINTS.GET_COUNTRIES, {
    ...args,

    sortOrder: args.sortOrder ?? "asc",
  });
  const cacheKey = buildCacheKey(CACHE_PREFIX, {
    ...args,

    sortOrder: args.sortOrder ?? "asc",
  });

  const query = useApiQuery<RawGetCountriesResponse>(cacheKey, url, {
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const data = useMemo<GetCountriesResponse | undefined>(() => {
    const api = query.data;
    if (!api) return undefined;

    return {
      message: api.message,
      data: (api.data ?? []).map((item): CountryData => normalizeCountry(item)),
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

export type { UseGetCountriesArgs };
