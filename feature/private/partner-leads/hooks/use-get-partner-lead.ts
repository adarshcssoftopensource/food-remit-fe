import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { PartnerLeadData } from "../types/partner-lead.types";

export function usePartnerLead(id: string) {
  const { data: response, isLoading } = useApiQuery<{ data: PartnerLeadData }>(
    API_CACHE_KEYS.PARTNER_LEADS_DETAIL(id),
    PARTNER_LEAD_ENDPOINTS.GET_LEAD(id),
    { enabled: !!id },
  );

  return { lead: response?.data, isLoading };
}
