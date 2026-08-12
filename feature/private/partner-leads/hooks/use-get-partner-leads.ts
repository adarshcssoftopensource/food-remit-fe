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
    new: apiStats?.NEW ?? 0,
    contacted: apiStats?.CONTACTED ?? 0,
    qualified: apiStats?.QUALIFIED ?? 0,
    registrationInvited: apiStats?.REGISTRATION_INVITED ?? 0,
    registrationStarted: apiStats?.REGISTRATION_STARTED ?? 0,
    approved: apiStats?.APPROVED ?? 0,
    notQualified: apiStats?.NOT_QUALIFIED ?? 0,
  };

  return {
    leads: leadsArray,
    stats,
    pagination: pagination ?? { page: 1, limit: 10, total: leadsArray.length, totalPages: 1 },
    isLoading,
  };
}
