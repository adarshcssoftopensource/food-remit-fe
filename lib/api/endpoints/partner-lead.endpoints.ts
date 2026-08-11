export const PARTNER_LEAD_ENDPOINTS = {
  SUBMIT_LEAD: "partner-leads",
  GET_LEADS: (
    search?: string,
    sortBy?: string,
    sortOrder?: string,
    page?: number,
    limit?: number,
  ) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));
    const qs = params.toString();
    return qs ? `partner-leads?${qs}` : "partner-leads";
  },
  GET_LEAD: (id: string) => `partner-leads/${id}`,
  UPDATE_STATUS: (id: string) => `partner-leads/${id}/status`,
} as const;
