import { useApiQuery } from "@/hooks/useApi";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import type { GetSubAdminsResponse } from "../types/sub-admin.types";

type UseGetSubAdminsArgs = {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  status?: string | null; // "Active" | "Inactive" | null
};

function buildUrl(args: UseGetSubAdminsArgs) {
  const params = new URLSearchParams();
  if (args.page) params.set("page", String(args.page));
  if (args.limit) params.set("limit", String(Math.min(args.limit, 100)));
  if (args.search) params.set("search", args.search);
  if (args.fromDate) params.set("from", args.fromDate.toISOString());
  if (args.toDate) params.set("to", args.toDate.toISOString());
  if (args.status) params.set("status", args.status);

  const qs = params.toString();
  return qs ? `${SUB_ADMIN_ENDPOINTS.GET_SUB_ADMINS}?${qs}` : SUB_ADMIN_ENDPOINTS.GET_SUB_ADMINS;
}

export function useGetSubAdmins(args: UseGetSubAdminsArgs = {}) {
  const url = buildUrl(args);
  const cacheKey: string[] = [
    "get-sub-admins",
    String(args.page ?? 1),
    String(Math.min(args.limit ?? 100, 100)),
    args.search ?? "",
    args.fromDate ? args.fromDate.toISOString() : "",
    args.toDate ? args.toDate.toISOString() : "",
    args.status ?? "",
  ];

  return useApiQuery<GetSubAdminsResponse>(cacheKey, url, { staleTime: 1000 * 60 * 2 });
}

export type { UseGetSubAdminsArgs };
