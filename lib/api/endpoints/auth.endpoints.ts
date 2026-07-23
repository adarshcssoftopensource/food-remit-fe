export const AUTH_ENDPOINTS = {
  LOGIN: "auth/login",
  REFRESH_TOKEN: "auth/refresh-token",
  FORGOT_PASSWORD: "auth/forgot-password",
  RESET_PASSWORD: "auth/reset-password",
} as const;

export interface AuthTokenResponse {
  access_token: string;
  refresh_token: string;
}
