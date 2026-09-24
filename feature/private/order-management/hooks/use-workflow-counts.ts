import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import apiClient from "@/lib/api/client";
import { ORDER_ENDPOINTS } from "@/lib/api/endpoints/order.endpoints";
import { useQuery } from "@tanstack/react-query";

export interface WorkflowCounts {
  all: number;
  requested?: number;
  pending: number;
  unassigned?: number;
  processing: number;
  assigned?: number;
  completed: number;
  history: number;
  pickedUp: number;
  abandoned: number;
  availableEmployees?: number;
  busyEmployees?: number;
}

export function useWorkflowCounts(enabled = true) {
  return useQuery({
    queryKey: [...API_CACHE_KEYS.ORDERS, "workflow-counts"],
    queryFn: async () => {
      const { data } = await apiClient.get<{
        status: boolean;
        data: WorkflowCounts;
      }>(ORDER_ENDPOINTS.WORKFLOW_COUNTS);
      return data.data;
    },
    enabled,
    refetchInterval: 30_000,
  });
}
