import { useQuery } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { COUPON_ENDPOINTS } from "@/lib/api/endpoints/coupon.endpoints";
import type { CouponsApiResponse, QueryCouponsParams } from "../types/coupon.types";

export function useGetCoupons(params: QueryCouponsParams, enabled = true) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.COUPONS, params],
    enabled,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params.page) search.set("page", String(params.page));
      if (params.limit) search.set("limit", String(params.limit));
      if (params.search?.trim()) search.set("search", params.search.trim());
      if (params.sortBy) search.set("sortBy", params.sortBy);
      if (params.sortOrder) search.set("sortOrder", params.sortOrder);
      if (params.status && params.status.toLowerCase() !== "all") {
        search.set("status", params.status.toLowerCase());
      }
      if (params.storeId && params.storeId !== "all") search.set("storeId", params.storeId);
      if (params.fromDate) search.set("fromDate", params.fromDate);
      if (params.toDate) search.set("toDate", params.toDate);

      const url = `${COUPON_ENDPOINTS.LIST}?${search.toString()}`;
      const res = await apiClient.get<CouponsApiResponse>(url);
      return res.data;
    },
  });
}
