export const ROUTES = {
  ROOT: "/",
  AUTH: {
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    CHANGE_PASSWORD: "/change-password",
  },
  ADMIN: {
    DASHBOARD: "/dashboard",
    USERS_MANAGEMENT: "/users-management",
    FOUNDATION_MANAGEMENT: "/foundation-management",
    PHILANTHROPIST_MANAGEMENT: "/philanthropist-management",
    SUB_ADMIN_MANAGEMENT: "/sub-admin-management",
    STORIES: {
      LIST: "/stories",
      ADD: "/stories/add",
    },
    DONATION_LOGS: "/donation-logs",
    CATALOGUE_MANAGEMENT: {
      ROOT: "/catalogue-management",
      DEPARTMENTS: "/catalogue-management/departments",
      CATEGORIES: "/catalogue-management/categories",
      ITEMS: "/catalogue-management/items",
    },
    STORE_MANAGEMENT: {
      ROOT: "/store-management",
      ALL: "/store-management/all",
      ASSIGN_CITY_MANAGER: "/store-management/assign-city-manager",
    },
    COUNTRY_MANAGEMENT: {
      ROOT: "/country-management",
      LIST: "/country-management/list",
    },
    CITY_MANAGEMENT: {
      ROOT: "/city-management",
      LIST: "/city-management/list",
    },
    ORDER_MANAGEMENT: {
      ROOT: "/order-management",
      SENT_ORDERS: "/order-management/sent-orders",
      REQUESTED_ORDERS: "/order-management/requested-orders",
      PARTIAL_ORDERS: "/order-management/partial-orders",
      COMPLETED_ORDERS: "/order-management/completed-orders",
      HISTORY: "/order-management/history",
    },
    CONTENT_MANAGEMENT: {
      ROOT: "/content-management",
      ABOUT_US: "/content-management/about-us",
      PRIVACY_POLICY: "/content-management/privacy-policy",
      TERMS_OF_USE: "/content-management/terms-of-use",
      FAQ: "/content-management/faq",
    },
    TICKET_MANAGEMENT: {
      ROOT: "/ticket-management",
      ACTIVE_REQUESTS: "/ticket-management/active-requests",
      CLOSED_REQUESTS: "/ticket-management/closed-requests",
    },
    REPORT_MANAGEMENT: {
      ROOT: "/report-management",
      LIST: "/report-management/list",
    },
    FEEDBACK_MANAGEMENT: "/feedback-management",
    SEND_NOTIFICATION: "/send-notification",
    COUPONS_MANAGEMENT: "/coupons-management",
    AMOUNT_LIMIT_MANAGEMENT: "/amount-limit-management",
    CREDITS_MANAGEMENT: {
      ROOT: "/credits-management",
      LIST: "/credits-management/list",
    },
    TUTORIAL_MANAGEMENT: "/tutorial-management",
    PROFILE: "/profile",
    SETTINGS: "/settings",
  },
} as const;

export type AppRoutes = typeof ROUTES;
