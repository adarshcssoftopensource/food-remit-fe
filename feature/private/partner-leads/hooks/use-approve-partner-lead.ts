import { useApiMutation } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { useQueryClient } from "@tanstack/react-query";
import type { ApiResponse } from "@/hooks/useApi";

export function useApprovePartnerLead(id: string) {
  const queryClient = useQueryClient();

  return useApiMutation<ApiResponse, { remark?: string } | void>(
    "post",
    PARTNER_LEAD_ENDPOINTS.APPROVE_LEAD(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.STORES,
        });
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.PARTNER_LEADS_LIST,
        });
        queryClient.invalidateQueries({
          queryKey: API_CACHE_KEYS.RECYCLED_PARTNER_LEADS,
        });
      },
    },
  );
}
