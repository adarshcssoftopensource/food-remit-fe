import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/hooks/useApi";

interface DeleteDocPayload {
  docIndex: number;
}

export function useDeletePartnerLeadDocument(leadId: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse, DeleteDocPayload>(
    "delete",
    (body) => PARTNER_LEAD_ENDPOINTS.DELETE_DOCUMENT(leadId, body.docIndex),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.PARTNER_LEADS_DETAIL(leadId),
        });
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.PARTNER_LEADS_LIST,
        });
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.STORES,
        });
      },
    },
  );
}
