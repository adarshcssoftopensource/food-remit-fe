import apiClient from "@/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";

interface CompleteOrderPayload {
  orderId: string;
  availableItemIds: string[];
}

export function useCompleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, availableItemIds }: CompleteOrderPayload) => {
      // Assuming ORDER_ENDPOINTS.BASE is something like '/admin/orders'
      // We hit POST /admin/orders/:id/complete
      const res = await apiClient.post(`/admin/orders/${orderId}/complete`, {
        availableItemIds,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order completed successfully");
    },
    onError: () => {
      toast.error("Failed to complete order. Please try again.");
    },
  });
}
