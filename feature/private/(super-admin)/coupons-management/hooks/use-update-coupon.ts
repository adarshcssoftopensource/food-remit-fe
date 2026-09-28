import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { COUPON_ENDPOINTS } from "@/lib/api/endpoints/coupon.endpoints";
import { successToast } from "@/components/toaster";

export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Record<string, unknown> }) => {
      const res = await apiClient.put(COUPON_ENDPOINTS.UPDATE(id), payload);
      return res.data;
    },
    onSuccess: (data: any) => {
      successToast({ description: data?.message || "Coupon updated successfully." });
      void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.COUPONS });
    },
  });
}
