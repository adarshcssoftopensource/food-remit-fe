import { useApiQuery } from "@/hooks/useApi";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import { useMemo } from "react";
import { normalizeSubAdmin } from "../lib/normalize-sub-admin";
import type {
  GetSubAdminsResponse,
  SubAdminData,
  UseGetSubAdminsArgs,
} from "../types/sub-admin.types";

const CACHE_PREFIX = "sub-admins";

/** Raw shape returned by the API before normalisation. */
interface RawGetSubAdminsResponse {
  message: string;
  stats?: {
    total: number;
    active: number;
    inactive: number;
    avgPermissions: number;
  };
  data: Record<string, unknown>[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useGetSubAdmins(args: UseGetSubAdminsArgs = {}) {
  const url = buildUrl(SUB_ADMIN_ENDPOINTS.GET_SUB_ADMINS, args);
  const cacheKey = buildCacheKey(CACHE_PREFIX, args);

  const query = useApiQuery<RawGetSubAdminsResponse>(cacheKey, url, {
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  const data = useMemo<GetSubAdminsResponse | undefined>(() => {
    const api = query.data;
    if (!api) return undefined;

    return {
      message: api.message,
      stats: api.stats ?? { total: 0, active: 0, inactive: 0, avgPermissions: 0 },
      data: (api.data ?? []).map((item): SubAdminData => normalizeSubAdmin(item)),
      pagination: api.pagination ?? { page: 1, limit: 0, total: 0, totalPages: 0 },
    };
  }, [query.data]);

  return { ...query, data };
}

export type { UseGetSubAdminsArgs };
