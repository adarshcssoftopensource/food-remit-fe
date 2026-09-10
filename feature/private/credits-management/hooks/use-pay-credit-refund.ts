import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { CREDITS_ENDPOINTS } from "@/lib/api/endpoints/credits.endpoints";

export function usePayCreditRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post(CREDITS_ENDPOINTS.PAY(orderId));
      return data;
    },
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.CREDITS });
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.CREDIT_BY_ID(orderId),
      });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.ORDER_BY_ID(orderId),
      });
      toast.success("Refund payment processed successfully!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const msg = error?.response?.data?.message || error?.message || "Failed to process refund.";
      toast.error(msg);
    },
  });
}
