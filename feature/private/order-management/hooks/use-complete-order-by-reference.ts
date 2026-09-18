import apiClient from "@/lib/api/client";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

type Payload = {
  orderId: string;
  referenceNumber: string;
};

export function useCompleteOrderByReference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, referenceNumber }: Payload) => {
      const res = await apiClient.post(
        ORDER_ENDPOINTS.COMPLETE_BY_REFERENCE(orderId),
        { referenceNumber },
        { skipErrorToast: true } as any,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function getCompleteByReferenceErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string | string[] }>;
  const message = axiosError?.response?.data?.message;
  if (Array.isArray(message)) return message[0] || "Invalid reference number.";
  if (typeof message === "string" && message.trim()) return message;
  return "Invalid reference number. Please check the reference number and try again.";
}
