export const PARTNER_LEAD_ENDPOINTS = {
  SUBMIT_LEAD: "partner-leads",
  GET_LEADS: (
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
    pipeline?: "pending" | "approved" | "rejected",
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    if (businessType) params.append("businessType", businessType);
    if (status) params.append("status", status);
    if (kycStatus) params.append("kycStatus", kycStatus);
    if (bankStatus) params.append("bankStatus", bankStatus);
    if (pipeline) params.append("pipeline", pipeline);
    const qs = params.toString();
    return qs ? `partner-leads?${qs}` : "partner-leads";
  },
  GET_LEAD: (id: string) => `partner-leads/${id}`,
  UPDATE_STATUS: (id: string) => `partner-leads/${id}/status`,
  APPROVE_LEAD: (id: string) => `partner-leads/${id}/approve`,
  CHECK_EMAIL: (email: string) => `partner-leads/check-email?email=${encodeURIComponent(email)}`,
  DELETE_LEAD: (id: string) => `partner-leads/${id}`,
  BULK_DELETE_LEADS: "partner-leads/bulk-delete",
  GET_RECYCLED_LEADS: "partner-leads/recycle-bin",
  RESTORE_LEAD: (id: string) => `partner-leads/recycle-bin/${id}/restore`,
  BULK_RESTORE_LEADS: "partner-leads/recycle-bin/bulk-restore",
  PERMANENT_DELETE_LEAD: (id: string) => `partner-leads/recycle-bin/${id}`,
  BULK_PERMANENT_DELETE_LEADS: "partner-leads/recycle-bin/bulk-permanent-delete",
  GET_HISTORY_LEADS: "partner-leads/history",
  RESTORE_HISTORY_LEAD: (id: string) => `partner-leads/history/${id}/restore`,
  BULK_RESTORE_HISTORY_LEADS: "partner-leads/history/bulk-restore",
  PERMANENT_DELETE_HISTORY_LEAD: (id: string) => `partner-leads/history/${id}`,
  BULK_PERMANENT_DELETE_HISTORY_LEADS: "partner-leads/history/bulk-permanent-delete",
} as const;
