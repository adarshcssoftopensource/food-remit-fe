import { ADMIN } from "@/config/api";

export const SUB_ADMIN_ENDPOINTS = {
  GET_PERMISSIONS: `${ADMIN}/permissions/list`,
  GET_SUB_ADMINS: `${ADMIN}/sub-admins`,
  CREATE_SUB_ADMIN: `${ADMIN}/sub-admins`,
} as const;
