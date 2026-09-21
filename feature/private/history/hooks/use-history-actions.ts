import { useApiMutation } from "@/hooks/useApi";
import { STORE_ENDPOINTS } from "@/lib/api/endpoints/store.endpoints";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import { HistoryEntityType } from "./use-get-history-data";

export function useRestoreFromHistory(entityType: HistoryEntityType, id: string) {
  const queryClient = useQueryClient();

  const urlMap: Record<HistoryEntityType, string> = {
    stores: STORE_ENDPOINTS.RESTORE_HISTORY_STORE(id),
    "partner-leads": PARTNER_LEAD_ENDPOINTS.RESTORE_HISTORY_LEAD(id),
  };

  return useApiMutation<{ message: string }, void>("post", urlMap[entityType], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`HISTORY_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`RECYCLED_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({ queryKey: [entityType] });
    },
  });
}

export function usePermanentDeleteFromHistory(entityType: HistoryEntityType, id: string) {
  const queryClient = useQueryClient();

  const urlMap: Record<HistoryEntityType, string> = {
    stores: STORE_ENDPOINTS.PERMANENT_DELETE_HISTORY_STORE(id),
    "partner-leads": PARTNER_LEAD_ENDPOINTS.PERMANENT_DELETE_HISTORY_LEAD(id),
  };

  return useApiMutation<{ message: string }, void>("delete", urlMap[entityType], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`HISTORY_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({ queryKey: [entityType] });
    },
  });
}

export function useBulkRestoreFromHistory(entityType: HistoryEntityType) {
  const queryClient = useQueryClient();

  const urlMap: Record<HistoryEntityType, string> = {
    stores: STORE_ENDPOINTS.BULK_RESTORE_HISTORY_STORES,
    "partner-leads": PARTNER_LEAD_ENDPOINTS.BULK_RESTORE_HISTORY_LEADS,
  };

  return useApiMutation<{ message: string }, { ids: string[] }>("post", urlMap[entityType], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`HISTORY_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`RECYCLED_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({ queryKey: [entityType] });
    },
  });
}

export function useBulkPermanentDeleteFromHistory(entityType: HistoryEntityType) {
  const queryClient = useQueryClient();

  const urlMap: Record<HistoryEntityType, string> = {
    stores: STORE_ENDPOINTS.BULK_PERMANENT_DELETE_HISTORY_STORES,
    "partner-leads": PARTNER_LEAD_ENDPOINTS.BULK_PERMANENT_DELETE_HISTORY_LEADS,
  };

  return useApiMutation<{ message: string }, { ids: string[] }>("post", urlMap[entityType], {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`HISTORY_${entityType.toUpperCase().replace(/-/g, "_")}`],
      });
      queryClient.invalidateQueries({ queryKey: [entityType] });
    },
  });
}
