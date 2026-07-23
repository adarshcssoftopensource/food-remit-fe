export const ROUTES = {
  ROOT: "/",
  AUTH: {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  ADMIN: {
    DASHBOARD: "/admin",
  },
} as const;

export type AppRoutes = typeof ROUTES;
