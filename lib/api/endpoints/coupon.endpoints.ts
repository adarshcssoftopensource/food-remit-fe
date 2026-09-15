export const COUPON_ENDPOINTS = {
  LIST: "/admin/coupons",
  CREATE: "/admin/coupons",
  DETAILS: (id: string) => `/admin/coupons/${id}`,
  UPDATE: (id: string) => `/admin/coupons/${id}`,
  TOGGLE_STATUS: (id: string) => `/admin/coupons/${id}/status`,
  DELETE: (id: string) => `/admin/coupons/${id}`,
  GENERATE_CODE: "/admin/coupons/generate-code",
};
