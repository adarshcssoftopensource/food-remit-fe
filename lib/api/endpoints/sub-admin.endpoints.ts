import { ADMIN } from "@/config/api";

export const SUB_ADMIN_ENDPOINTS = {
  GET_PERMISSIONS: `${ADMIN}/permissions/list`,
} as const;
