import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { EMPLOYEE_ENDPOINTS } from "@/lib/api/endpoints/employee.endpoints";
import { successToast, errorToast } from "@/components/toaster";

export function useAssignOrder(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post(EMPLOYEE_ENDPOINTS.ASSIGN_ORDER(employeeId), {
        orderId,
      });
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order assigned to employee successfully" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.EMPLOYEE_ORDERS(employeeId) });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
    },
    onError: () => {
      errorToast({ description: "Failed to assign order" });
    },
  });
}

export function useUnassignOrder(employeeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const { data } = await apiClient.post(EMPLOYEE_ENDPOINTS.UNASSIGN_ORDER, { orderId });
      return data;
    },
    onSuccess: () => {
      successToast({ description: "Order unassigned successfully" });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.EMPLOYEE_ORDERS(employeeId) });
      queryClient.invalidateQueries({ queryKey: API_CACHE_KEYS.ORDERS });
    },
    onError: () => {
      errorToast({ description: "Failed to unassign order" });
    },
  });
}
