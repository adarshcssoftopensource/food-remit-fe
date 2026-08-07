import { useApiQuery } from "@/hooks/useApi";
import { SUB_ADMIN_ENDPOINTS } from "@/lib/api/endpoints/sub-admin.endpoints";
import { format } from "date-fns";
import * as React from "react";
import type { GetSubAdminsResponse, SubAdminData } from "../types/sub-admin.types";

type UseGetSubAdminsArgs = {
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: Date | null;
  toDate?: Date | null;
  status?: string | null; // "1" | "0" | null
  sortBy?: string | null;
  sortOrder?: string | null;
};

function buildUrl(args: UseGetSubAdminsArgs) {
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
  return qs ? `${SUB_ADMIN_ENDPOINTS.GET_SUB_ADMINS}?${qs}` : SUB_ADMIN_ENDPOINTS.GET_SUB_ADMINS;
}

export function useGetSubAdmins(args: UseGetSubAdminsArgs = {}) {
  const url = buildUrl(args);
  const cacheKey: string[] = [
    "get-sub-admins",
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

      const mapped: GetSubAdminsResponse = {
        message: api.message,
        stats: api.stats || { total: 0, active: 0, inactive: 0, avgPermissions: 0 },
        data: (api.data || []).map((item: any): SubAdminData => {
          const address = item.address ?? item.addressLine ?? item.address1 ?? item.location ?? "";

          const countryCode = item.countryCode ?? item.phoneCountryCode ?? "";

          const rawNumber = item.contactNumber ?? item.phoneNumber ?? item.mobile ?? "";
          const contactNumber = countryCode
            ? `+${String(countryCode).replace(/^\+/, "")} ${String(rawNumber)}`.trim()
            : String(rawNumber);

          return {
            id: item.id,
            userId: item.userId ?? item.id,
            userName: item.userName ?? item.name ?? "",
            email: item.email ?? "",
            contactNumber: contactNumber || "",
            address: String(address || ""),
            status:
              item.status === 1 || item.status === "1" || item.status === "Active"
                ? "Active"
                : "Inactive",
            createdAt: item.createdAt ?? item.created_at ?? "",
            permissions: item.permission ?? item.permissions ?? [],
          } as SubAdminData;
        }),
        pagination: api.pagination || { page: 1, limit: 0, total: 0, totalPages: 0 },
      };

      return mapped;
    } catch (e) {
      return undefined;
    }
  }, [query.data]);

  return { ...query, data: mappedData } as any;
}

export type { UseGetSubAdminsArgs };
