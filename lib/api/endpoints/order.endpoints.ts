export const ORDER_ENDPOINTS = {
  BASE: "/admin/orders",
  DETAILS: (id: string) => `/admin/orders/${id}`,
  UPDATE_STATUS: (id: string) => `/admin/orders/${id}`,
};
