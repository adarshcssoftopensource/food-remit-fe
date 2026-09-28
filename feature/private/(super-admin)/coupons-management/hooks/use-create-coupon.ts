import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { COUPON_ENDPOINTS } from "@/lib/api/endpoints/coupon.endpoints";
import { successToast } from "@/components/toaster";

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await apiClient.post(COUPON_ENDPOINTS.CREATE, payload);
      return res.data;
    },
    onSuccess: (data: any) => {
      successToast({ description: data?.message || "Coupon created successfully." });
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.COUPONS });
    },
  });
}
