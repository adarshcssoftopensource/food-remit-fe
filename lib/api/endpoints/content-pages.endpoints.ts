export const CONTENT_PAGES_ENDPOINTS = {
  ADMIN_GET: (key: string) => `/admin/content-pages/${key}`,
  ADMIN_UPDATE: (key: string) => `/admin/content-pages/${key}`,
  PUBLIC_GET: (key: string) => `/app/api/content-pages/${key}`,
} as const;

export const FAQ_ENDPOINTS = {
  ADMIN_LIST: (
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
    return qs ? `/admin/faqs?${qs}` : "/admin/faqs";
  },
  ADMIN_CREATE: "/admin/faqs",
  ADMIN_UPDATE: (id: string) => `/admin/faqs/${id}`,
  ADMIN_DELETE: (id: string) => `/admin/faqs/${id}`,
  PUBLIC_LIST: "/app/api/faqs",
} as const;
