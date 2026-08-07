import { useApiQuery } from "@/hooks/useApi";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { format } from "date-fns";
import * as React from "react";
import { normalizeUser } from "../lib/normalize-user";
import type { GetUsersResponse, UseGetUsersArgs } from "../types/user.types";

function buildUrl(args: UseGetUsersArgs) {
  const params = new URLSearchParams();
  if (args.page) params.set("page", String(args.page));
  if (args.limit) params.set("limit", String(Math.min(args.limit, 100)));
  if (args.search) params.set("search", args.search);
  if (args.fromDate) params.set("from", format(args.fromDate, "yyyy-MM-dd"));
  if (args.toDate) params.set("to", format(args.toDate, "yyyy-MM-dd"));
  if (args.status) params.set("status", args.status);
  if (args.sortBy) params.set("sortBy", args.sortBy);
  if (args.sortOrder) params.set("sortOrder", args.sortOrder);

  const qs = params.toString();
  return qs ? `${USER_MANAGEMENT_ENDPOINTS.GET_USERS}?${qs}` : USER_MANAGEMENT_ENDPOINTS.GET_USERS;
}

export function useGetUsers(args: UseGetUsersArgs = {}) {
  const url = buildUrl(args);
  const cacheKey: string[] = [
    "get-users",
    String(args.page ?? 1),
    String(Math.min(args.limit ?? 100, 100)),
    args.search ?? "",
    args.fromDate ? format(args.fromDate, "yyyy-MM-dd") : "",
    args.toDate ? format(args.toDate, "yyyy-MM-dd") : "",
    args.status ?? "",
    args.sortBy ?? "",
    args.sortOrder ?? "",
  ];

  const query = useApiQuery<any>(cacheKey, url, { staleTime: 1000 * 60 * 2 });

  const mappedData = React.useMemo(() => {
    const raw = query as any;
    if (!raw?.data) return undefined;

    try {
      const api = raw.data as any;

      const mapped: GetUsersResponse = {
        message: api.message,
        stats: api.stats || { total: 0, active: 0, inactive: 0 },
        data: (api.data || []).map((item: any) => normalizeUser(item)),
        pagination: api.pagination || { page: 1, limit: 0, total: 0, totalPages: 0 },
      };

      return mapped;
    } catch {
      return undefined;
    }
  }, [query.data]);

  return { ...query, data: mappedData } as any;
}

export type { UseGetUsersArgs };
