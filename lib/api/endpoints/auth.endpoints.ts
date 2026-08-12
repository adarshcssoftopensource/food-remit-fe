export const AUTH_ENDPOINTS = {
  LOGIN: "admin/login",
  REFRESH_TOKEN: "admin/refresh",
  FORGOT_PASSWORD: "admin/forgot-password",
  RESET_PASSWORD: "admin/reset-password",
  LOGOUT: "admin/logout",
  FORCE_LOGOUT: "admin/force-logout",
  PROFILE: "admin/profile",
  CHANGE_PASSWORD: "admin/change-password",
} as const;

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
}
