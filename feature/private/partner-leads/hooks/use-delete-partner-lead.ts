import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/hooks/useApi";

export function useDeletePartnerLead(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse, void>("delete", PARTNER_LEAD_ENDPOINTS.DELETE_LEAD(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.PARTNER_LEADS_LIST,
      });
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.RECYCLED_PARTNER_LEADS,
      });
    },
  });
}
