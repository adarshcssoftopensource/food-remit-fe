import { useApiQuery } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import { normalizeUser } from "../lib/normalize-user";
import type { GetUsersResponse, UseGetUsersArgs, UserData } from "../types/user.types";

const CACHE_PREFIX = "users";

interface RawGetUsersResponse {
  message: string;
  stats?: {
    total: number;
    active: number;
    inactive: number;
  };
  data: Record<string, unknown>[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useGetUsers(args: UseGetUsersArgs = {}) {
  const url = buildUrl(USER_MANAGEMENT_ENDPOINTS.GET_USERS, {
    ...args,
    sortOrder: args.sortOrder ?? "asc",
  });
  const cacheKey = buildCacheKey(CACHE_PREFIX, {
    ...args,
    sortOrder: args.sortOrder ?? "asc",
  });

  const query = useApiQuery<RawGetUsersResponse>(cacheKey, url, {});

  const data = useMemo<GetUsersResponse | undefined>(() => {
    const api = query.data;
    if (!api) return undefined;

    return {
      message: api.message,
      stats: api.stats ?? { total: 0, active: 0, inactive: 0 },
      data: (api.data ?? []).map((item): UserData => normalizeUser(item)),
      pagination: api.pagination ?? { page: 1, limit: 0, total: 0, totalPages: 0 },
    };
  }, [query.data]);

  return { ...query, data };
}

export type { UseGetUsersArgs };
