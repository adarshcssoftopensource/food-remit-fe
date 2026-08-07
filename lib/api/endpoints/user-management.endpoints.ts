import { ADMIN } from "@/config/api";

export const USER_MANAGEMENT_ENDPOINTS = {
  GET_USERS: `${ADMIN}/users`,
} as const;
