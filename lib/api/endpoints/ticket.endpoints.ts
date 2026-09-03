export const TICKET_ENDPOINTS = {
  BASE: "/admin/tickets",
  GET_BY_ID: (id: string) => `/admin/tickets/${id}`,
  REPLY: (id: string) => `/admin/tickets/${id}/reply`,
  CLOSE: (id: string) => `/admin/tickets/${id}/close`,
} as const;
