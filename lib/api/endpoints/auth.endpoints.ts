export const AUTH_ENDPOINTS = {
  LOGIN: "auth/login",
  REFRESH_TOKEN: "auth/refresh",
  FORGOT_PASSWORD: "auth/forgot-password",
  RESET_PASSWORD: "auth/reset-password",
  LOGOUT: "auth/logout",
  FORCE_LOGOUT: "auth/force-logout",
} as const;

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
}
