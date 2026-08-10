import { ADMIN } from "@/config/api";

export const USER_MANAGEMENT_ENDPOINTS = {
  GET_USERS: `${ADMIN}/users`,
  GET_USER_BY_ID: (id: string) => `${ADMIN}/users/${id}`,
  UPDATE_USER_STATUS: (id: string) => `${ADMIN}/users/${id}/status`,
  DELETE_USER: `${ADMIN}/users`,
} as const;
