import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { buildCacheKey, buildUrl } from "@/lib/build-query-string";
import { useApiQuery } from "@/hooks/useApi";
import { useMemo } from "react";

export type HistoryEntityType = "partner-leads" | "stores";

export interface HistoryQueryArgs {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface RawHistoryResponse {
  message?: string;
  status?: boolean;
  data?: any[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const ENDPOINT_MAP: Record<HistoryEntityType, string> = {
  "partner-leads": PARTNER_LEAD_ENDPOINTS.GET_HISTORY_LEADS,
  stores: STORE_ENDPOINTS.GET_HISTORY_STORES,
};

export function useGetHistoryData(entityType: HistoryEntityType, args: HistoryQueryArgs = {}) {
  const endpoint = ENDPOINT_MAP[entityType];
  const url = buildUrl(endpoint, {
    ...args,
    sortOrder: args.sortOrder ?? "desc",
  });
  const cacheKey = buildCacheKey(`HISTORY_${entityType.toUpperCase().replace(/-/g, "_")}`, {
    ...args,
    sortOrder: args.sortOrder ?? "desc",
  });

  const query = useApiQuery<RawHistoryResponse>(cacheKey, url, {});

  const formattedData = useMemo(() => {
    const api = query.data;
    if (!api) return undefined;

    const items = api.data ?? [];

    return {
      message: api.message || "Data fetched successfully",
      data: items,
      pagination: api.pagination ?? { page: 1, limit: 10, total: items.length, totalPages: 1 },
    };
  }, [query.data]);

  return { ...query, formattedData };
}
