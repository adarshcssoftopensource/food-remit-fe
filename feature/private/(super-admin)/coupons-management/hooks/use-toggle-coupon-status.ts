import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { COUPON_ENDPOINTS } from "@/lib/api/endpoints/coupon.endpoints";
import { successToast } from "@/components/toaster";

export function useToggleCouponStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.patch(COUPON_ENDPOINTS.TOGGLE_STATUS(id));
      return res.data;
    },
    onSuccess: (data: any) => {
      successToast({ description: data?.message || "Coupon status updated." });
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.COUPONS });
    },
  });
}
