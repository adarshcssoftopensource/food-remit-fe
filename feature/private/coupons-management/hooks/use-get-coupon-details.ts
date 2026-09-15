import { useQuery } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { COUPON_ENDPOINTS } from "@/lib/api/endpoints/coupon.endpoints";
import type { CouponItem } from "../types/coupon.types";

export function useGetCouponDetails(id?: string, enabled = true) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.COUPONS, id],
    enabled: Boolean(id && enabled),
    queryFn: async () => {
      const res = await apiClient.get<{ status: boolean; data: CouponItem }>(
        COUPON_ENDPOINTS.DETAILS(id!),
      );
      return res.data?.data;
    },
  });
}
