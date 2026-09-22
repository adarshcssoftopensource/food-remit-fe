import { errorToast, successToast } from "@/components/toaster";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useStartOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post(ORDER_ENDPOINTS.START(orderId));
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order started — now Processing" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
    },
    onError: (err: any) => {
      errorToast({
        description:
          err?.response?.data?.message || "Failed to start order. It may already be taken.",
      });
    },
  });
}

export function useMarkOrderCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post(ORDER_ENDPOINTS.MARK_COMPLETED(orderId));
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order marked as Completed — ready for pickup" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
    },
    onError: (err: any) => {
      errorToast({
        description: err?.response?.data?.message || "Failed to mark order as completed",
      });
    },
  });
}

export function useMarkOrderPickedUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      referenceNumber,
    }: {
      orderId: string;
      referenceNumber: string;
    }) => {
      const { data } = await apiClient.post(ORDER_ENDPOINTS.MARK_PICKED_UP(orderId), {
        referenceNumber,
      });
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order picked up and closed" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
    },
    onError: (err: any) => {
      errorToast({
        description:
          err?.response?.data?.message || "Invalid reference or failed to mark as picked up",
      });
    },
  });
}

export function useMarkOrderAbandoned() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason?: string }) => {
      const { data } = await apiClient.post(ORDER_ENDPOINTS.MARK_ABANDONED(orderId), {
        reason,
      });
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order abandoned and closed" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
    },
    onError: (err: any) => {
      errorToast({
        description: err?.response?.data?.message || "Failed to abandon order",
      });
    },
  });
}
