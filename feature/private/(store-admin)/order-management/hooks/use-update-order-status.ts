import apiClient from "@/lib/api/client";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateStatusPayload {
  orderId: string;
  orderStatus: number;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, orderStatus }: UpdateStatusPayload) => {
      const res = await apiClient.patch(ORDER_ENDPOINTS.UPDATE_STATUS(orderId), {
        orderStatus,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update order status. Please try again.");
    },
  });
}
