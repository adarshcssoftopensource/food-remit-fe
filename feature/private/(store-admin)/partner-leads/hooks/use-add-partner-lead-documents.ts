import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/hooks/useApi";

export function useAddPartnerLeadDocuments(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse, FormData>("post", PARTNER_LEAD_ENDPOINTS.ADD_DOCUMENTS(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.PARTNER_LEADS_DETAIL(id),
      });
      queryClient.invalidateQueries({
        queryKey: API_CACHE_KEYS.PARTNER_LEADS_LIST,
      });
    },
  });
}
