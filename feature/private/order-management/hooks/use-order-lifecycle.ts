import { errorToast, successToast } from "@/components/toaster";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<{ message?: string | string[] }>;
  const message = axiosError?.response?.data?.message;
  if (Array.isArray(message) && message[0]) return message[0];
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
}

function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
  };
}

export function useStartOrder() {
  const invalidateOrders = useInvalidateOrders();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post(ORDER_ENDPOINTS.START(orderId));
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order started — now Processing" });
      invalidateOrders();
    },
    onError: (error: unknown) => {
      errorToast({
        description: getErrorMessage(error, "Failed to start order. It may already be taken."),
      });
    },
  });
}

export function useMarkOrderCompleted() {
  const invalidateOrders = useInvalidateOrders();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post(ORDER_ENDPOINTS.MARK_COMPLETED(orderId));
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order marked as Completed — ready for pickup" });
      invalidateOrders();
    },
    onError: (error: unknown) => {
      errorToast({
        description: getErrorMessage(error, "Failed to mark order as completed"),
      });
    },
  });
}

export function useMarkOrderPickedUp() {
  const invalidateOrders = useInvalidateOrders();

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
      invalidateOrders();
    },
    onError: (error: unknown) => {
      errorToast({
        description: getErrorMessage(error, "Invalid reference or failed to mark as picked up"),
      });
    },
  });
}

export function useMarkOrderAbandoned() {
  const invalidateOrders = useInvalidateOrders();

  return useMutation({
    mutationFn: async ({ orderId, reason }: { orderId: string; reason?: string }) => {
      const { data } = await apiClient.post(ORDER_ENDPOINTS.MARK_ABANDONED(orderId), {
        reason,
      });
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order abandoned and closed" });
      invalidateOrders();
    },
    onError: (error: unknown) => {
      errorToast({
        description: getErrorMessage(error, "Failed to abandon order"),
      });
    },
  });
}
