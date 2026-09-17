export const ORDER_ENDPOINTS = {
  BASE: "/admin/orders",
  DETAILS: (id: string) => `/admin/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/admin/orders/${id}`,
  COMPLETE: (id: string) => `/admin/orders/${id}/complete`,
  TRIGGER_REFUND: (id: string) => `/admin/orders/${id}/refund`,
};
