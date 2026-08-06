import { ADMIN } from "@/config/api";

export const SUB_ADMIN_ENDPOINTS = {
  GET_PERMISSIONS: `${ADMIN}/permissions/list`,
  CREATE_SUB_ADMIN: `${ADMIN}/sub-admins`,
} as const;
