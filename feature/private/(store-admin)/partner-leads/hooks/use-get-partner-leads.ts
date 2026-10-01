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

export type PartnerLeadPipeline = "pending" | "approved" | "rejected" | "all";

const TERMINAL = new Set(["APPROVED", "REJECTED", "NOT_QUALIFIED"]);

function filterLeadsByPipeline(leads: PartnerLeadData[], pipeline: PartnerLeadPipeline) {
  if (pipeline === "all") {
    return leads;
  }
  if (pipeline === "approved") {
    return leads.filter((l) => l.status === "APPROVED");
  }
  if (pipeline === "rejected") {
    return leads.filter((l) => l.status === "REJECTED" || l.status === "NOT_QUALIFIED");
  }
  return leads.filter((l) => !TERMINAL.has(l.status));
}

interface PartnerLeadsQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder: string;
  page: number;
  limit: number;
  fromDate?: string;
  toDate?: string;
  businessType?: string;
  status?: string;
  kycStatus?: string;
  bankStatus?: string;
  pipeline: PartnerLeadPipeline;
}

function buildPartnerLeadsQueryKey(params: PartnerLeadsQueryParams) {
  return [
    ...API_CACHE_KEYS.PARTNER_LEADS_LIST,
    `pipeline:${params.pipeline}`,
    `page:${params.page}`,
    `limit:${params.limit}`,
    `sort:${params.sortBy || "createdAt"}:${params.sortOrder}`,
    `search:${params.search || ""}`,
    `from:${params.fromDate || ""}`,
    `to:${params.toDate || ""}`,
    `businessType:${params.businessType || ""}`,
    `status:${params.status || ""}`,
    `kyc:${params.kycStatus || ""}`,
    `bank:${params.bankStatus || ""}`,
  ];
}

function buildPartnerLeadStats(apiStats: Record<string, number> | undefined) {
  const pending =
    (apiStats?.PENDING ?? 0) +
    (apiStats?.NEW ?? 0) +
    (apiStats?.CONTACTED ?? 0) +
    (apiStats?.QUALIFIED ?? 0) +
    (apiStats?.REGISTRATION_INVITED ?? 0) +
    (apiStats?.REGISTRATION_STARTED ?? 0) +
    (apiStats?.REQUEST_MORE_INFO ?? 0);
  const rejected = (apiStats?.REJECTED ?? 0) + (apiStats?.NOT_QUALIFIED ?? 0);
  const approved = apiStats?.APPROVED ?? 0;

  const stats = {
    total: apiStats?.total ?? 0,
    pendingBucket: pending,
    pending: apiStats?.PENDING ?? 0,
    new: apiStats?.NEW ?? 0,
    contacted: apiStats?.CONTACTED ?? 0,
    qualified: apiStats?.QUALIFIED ?? 0,
    registrationInvited: apiStats?.REGISTRATION_INVITED ?? 0,
    registrationStarted: apiStats?.REGISTRATION_STARTED ?? 0,
    approved,
    rejectedBucket: rejected,
    rejected: apiStats?.REJECTED ?? 0,
    notQualified: apiStats?.NOT_QUALIFIED ?? 0,
  };

  return { stats, pending, rejected, approved };
}

function buildPartnerLeadsPagination(
  response: RawGetPartnerLeadsResponse | undefined,
  pipeline: PartnerLeadPipeline,
  page: number,
  limit: number,
  buckets: { pending: number; rejected: number; approved: number },
) {
  const bucketTotal =
    pipeline === "approved"
      ? buckets.approved
      : pipeline === "rejected"
        ? buckets.rejected
        : buckets.pending;

  return {
    page: response?.pagination?.page ?? page,
    limit: response?.pagination?.limit ?? limit,
    total: bucketTotal,
    totalPages: Math.max(1, Math.ceil(bucketTotal / limit) || 1),
  };
}

export function usePartnerLeads(
  search?: string,
  sortBy?: string,
  sortOrder?: string,
  page?: number,
  limit?: number,
  fromDate?: string,
  toDate?: string,
  businessType?: string,
  status?: string,
  kycStatus?: string,
  bankStatus?: string,
  pipeline?: PartnerLeadPipeline,
) {
  const resolvedPipeline = pipeline ?? "pending";
  const resolvedSortOrder = sortOrder ?? "desc";
  const resolvedPage = page ?? 1;
  const resolvedLimit = limit ?? 10;

  const { data: response, isLoading } = useApiQuery<RawGetPartnerLeadsResponse>(
    buildPartnerLeadsQueryKey({
      search,
      sortBy,
      sortOrder: resolvedSortOrder,
      page: resolvedPage,
      limit: resolvedLimit,
      fromDate,
      toDate,
      businessType,
      status,
      kycStatus,
      bankStatus,
      pipeline: resolvedPipeline,
    }),
    PARTNER_LEAD_ENDPOINTS.GET_LEADS(
      search,
      sortBy,
      resolvedSortOrder,
      resolvedPage,
      resolvedLimit,
      fromDate,
      toDate,
      businessType,
      status,
      kycStatus,
      bankStatus,
      resolvedPipeline,
    ),
  );

  const rawLeads = response?.data || [];
  const leadsArray = filterLeadsByPipeline(rawLeads, resolvedPipeline);
  const { stats, ...buckets } = buildPartnerLeadStats(response?.stats);

  return {
    leads: leadsArray,
    stats,
    pagination: buildPartnerLeadsPagination(
      response,
      resolvedPipeline,
      resolvedPage,
      resolvedLimit,
      buckets,
    ),
    isLoading,
  };
}
