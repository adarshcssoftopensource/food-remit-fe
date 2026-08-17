import { ADMIN } from "@/config/api";

export const USER_MANAGEMENT_ENDPOINTS = {
  GET_USERS: `${ADMIN}/users`,
  GET_USER_BY_ID: (id: string) => `${ADMIN}/users/${id}`,
  UPDATE_USER_STATUS: (id: string) => `${ADMIN}/users/${id}/status`,
  DELETE_USER: (id: string) => `${ADMIN}/users/${id}`,
  BULK_DELETE_USERS: () => `${ADMIN}/users/bulk-delete`,
  GET_RECYCLED_USERS: `${ADMIN}/users/recycle-bin`,
  BULK_RESTORE_USERS: () => `${ADMIN}/users/recycle-bin/bulk-restore`,
  RESTORE_USER: (id: string) => `${ADMIN}/users/recycle-bin/${id}/restore`,
} as const;
