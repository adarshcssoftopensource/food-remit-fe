import { ADMIN } from "@/config/api";

export const SUB_ADMIN_ENDPOINTS = {
  GET_PERMISSIONS: `${ADMIN}/permissions/list`,
  GET_SUB_ADMINS: `${ADMIN}/sub-admins`,
  GET_SUB_ADMIN_BY_ID: (id: string) => `${ADMIN}/sub-admins/${id}`,
  CREATE_SUB_ADMIN: `${ADMIN}/sub-admins`,
  UPDATE_SUB_ADMIN: (id: string) => `${ADMIN}/sub-admins/${id}`,
  UPDATE_SUB_ADMIN_STATUS: (id: string) => `${ADMIN}/sub-admins/${id}/status`,
} as const;
