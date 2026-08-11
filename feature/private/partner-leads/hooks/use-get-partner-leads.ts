import { useApiQuery } from "@/hooks/useApi";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { PartnerLeadData } from "../types/partner-lead.types";

export function usePartnerLeads(search?: string, sortBy?: string, sortOrder?: string) {
  const { data: response, isLoading } = useApiQuery<{ data: PartnerLeadData[] }>(
    [...API_CACHE_KEYS.PARTNER_LEADS_LIST, search, sortBy, sortOrder].filter(Boolean) as string[],
    PARTNER_LEAD_ENDPOINTS.GET_LEADS(search, sortBy, sortOrder),
  );
  const leads = response?.data;

  const leadsArray = leads || [];
  const stats = {
    total: leadsArray.length,
    new: leadsArray.filter((l) => l.status === "NEW").length,
    contacted: leadsArray.filter((l) => l.status === "CONTACTED").length,
    approved: leadsArray.filter((l) => l.status === "APPROVED").length,
  };

  return {
    leads: leadsArray,
    stats,
    isLoading,
  };
}
