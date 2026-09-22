export const ORDER_ENDPOINTS = {
  BASE: "/admin/orders",
  DETAILS: (id: string) => `/admin/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/admin/orders/${id}`,
  COMPLETE: (id: string) => `/admin/orders/${id}/complete`,
  COMPLETE_BY_REFERENCE: (id: string) => `/admin/orders/${id}/complete-by-reference`,
  START: (id: string) => `/admin/orders/${id}/start`,
  MARK_COMPLETED: (id: string) => `/admin/orders/${id}/mark-completed`,
  MARK_PICKED_UP: (id: string) => `/admin/orders/${id}/mark-picked-up`,
  MARK_ABANDONED: (id: string) => `/admin/orders/${id}/mark-abandoned`,
  WORKFLOW_COUNTS: "/admin/orders/workflow-counts",
  TRIGGER_REFUND: (id: string) => `/admin/orders/${id}/refund`,
};
