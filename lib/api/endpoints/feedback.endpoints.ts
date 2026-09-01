export const FEEDBACK_ENDPOINTS = {
  BASE: "/admin/feedback",
  GET_BY_ID: (id: string) => `/admin/feedback/${id}`,
  DELETE: (id: string) => `/admin/feedback/${id}`,
} as const;
