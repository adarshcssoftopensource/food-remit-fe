export const AUTH_ENDPOINTS = {
  LOGIN: "admin/login",
  REFRESH_TOKEN: "admin/refresh",
  FORGOT_PASSWORD: "admin/forgot-password",
  RESET_PASSWORD: "admin/reset-password",
  LOGOUT: "admin/logout",
  FORCE_LOGOUT: "admin/force-logout",
  PROFILE: "admin/profile",
  CHANGE_PASSWORD: "admin/change-password",
  IMPERSONATE: "admin/impersonate",
} as const;

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface RoleCodeResponse {
  SUPER_ADMIN: "SUPER_ADMIN";
  SUB_ADMIN: "SUB_ADMIN";
  CO_ADMIN: "CO_ADMIN";
  COUNTRY_MANAGER: "COUNTRY_MANAGER";
  CITY_MANAGER: "CITY_MANAGER";
  STORE_MANAGER: "STORE_MANAGER";
  EMPLOYEE: "EMPLOYEE";
  ADMIN: "ADMIN";
}
