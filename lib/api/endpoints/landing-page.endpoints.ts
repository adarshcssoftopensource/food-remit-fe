export const LANDING_PAGE_ENDPOINTS = {
  ADMIN_GET: "/admin/landing-page",
  ADMIN_UPDATE_SECTION: (section: string) => `/admin/landing-page/${section}`,
  PUBLIC_GET: "/app/api/landing-page",
} as const;
