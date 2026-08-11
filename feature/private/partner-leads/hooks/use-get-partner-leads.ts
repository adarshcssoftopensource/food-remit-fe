import { useApiQuery } from "@/hooks/useApi";
import { API_CACHE_KEYS } from "@/lib/api/cache-keys";
import { PARTNER_LEAD_ENDPOINTS } from "@/lib/api/endpoints/partner-lead.endpoints";
import { PartnerLeadData } from "../types/partner-lead.types";

interface RawGetPartnerLeadsResponse {
  message: string;
  data: PartnerLeadData[];
  stats?: Record<string, number>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function usePartnerLeads(
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  page?: number,
  limit?: number,
) {
  const { data: response, isLoading } = useApiQuery<RawGetPartnerLeadsResponse>(
    [...API_CACHE_KEYS.PARTNER_LEADS_LIST, search, sortBy, sortOrder, page, limit].filter(
      Boolean,
    ) as string[],
    PARTNER_LEAD_ENDPOINTS.GET_LEADS(search, sortBy, sortOrder ?? "desc", page ?? 1, limit ?? 10),
  );
  const leads = response?.data;
  const pagination = response?.pagination;
  const apiStats = response?.stats;

  const leadsArray = leads || [];
  const stats = {
    total: apiStats?.total ?? pagination?.total ?? leadsArray.length,
    new: apiStats?.NEW ?? leadsArray.filter((l) => l.status === "NEW").length,
    contacted: apiStats?.CONTACTED ?? leadsArray.filter((l) => l.status === "CONTACTED").length,
    approved: apiStats?.APPROVED ?? leadsArray.filter((l) => l.status === "APPROVED").length,
  };

  return {
    leads: leadsArray,
    stats,
    pagination: pagination ?? { page: 1, limit: 10, total: leadsArray.length, totalPages: 1 },
    isLoading,
  };
}
