export const ROUTES = {
  ROOT: "/",
  AUTH: {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  ADMIN: {
    DASHBOARD: "/dashboard",
    DONATION_LOGS: "/donation-logs",
    FOUNDATION_MANAGEMENT: "/foundation-management",
    PHILANTHROPIST_MANAGEMENT: "/philanthropist-management",
    PROFILE: "/profile",
    SETTINGS: "/settings",
    STORIES: {
      LIST: "/stories",
      ADD: "/stories/add",
    },
    SUB_ADMIN_MANAGEMENT: "/sub-admin-management",
    USERS_MANAGEMENT: "/users-management",
    STORE_MANAGEMENT: {
      ALL: "/store-management/all",
      ASSIGN_CITY_MANAGER: "/store-management/assign-city-manager",
    },
  },
} as const;

export type AppRoutes = typeof ROUTES;
