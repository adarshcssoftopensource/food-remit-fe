import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { toast } from "sonner";

export function useDeleteOrder(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await apiClient.delete(ORDER_ENDPOINTS.DETAILS(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
      toast.success("Order deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete order");
    },
  });
}
