import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { COUPON_ENDPOINTS } from "@/lib/api/endpoints/coupon.endpoints";

export function useGenerateCouponCode() {
  return useMutation({
    mutationFn: async (prefix?: string) => {
      const url = prefix
        ? `${COUPON_ENDPOINTS.GENERATE_CODE}?prefix=${encodeURIComponent(prefix)}`
        : COUPON_ENDPOINTS.GENERATE_CODE;
      const res = await apiClient.get<{ status: boolean; code: string }>(url);
      return res.data;
    },
  });
}
