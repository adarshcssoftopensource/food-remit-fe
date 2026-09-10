export const CREDITS_ENDPOINTS = {
  BASE: "/admin/credits",
  DETAIL: (id: string) => `/admin/credits/${id}`,
  PAY: (id: string) => `/admin/credits/${id}/pay`,
};
