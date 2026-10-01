import { ADMIN } from "@/config/api";

export const SUB_ADMIN_ENDPOINTS = {
  GET_PERMISSIONS: `${ADMIN}/permissions/list`,
  GET_SUB_ADMINS: `${ADMIN}/sub-admins`,
  GET_SUB_ADMIN_BY_ID: (id: string) => `${ADMIN}/sub-admins/${id}`,
  CREATE_SUB_ADMIN: `${ADMIN}/sub-admins`,
  UPDATE_SUB_ADMIN: (id: string) => `${ADMIN}/sub-admins/${id}`,
  UPDATE_SUB_ADMIN_STATUS: (id: string) => `${ADMIN}/sub-admins/${id}/status`,
  DELETE_SUB_ADMIN: (id: string) => `${ADMIN}/sub-admins/${id}`,
  GET_RECYCLED_SUB_ADMINS: `${ADMIN}/sub-admins/recycle-bin`,
  RESTORE_SUB_ADMIN: (id: string) => `${ADMIN}/sub-admins/recycle-bin/${id}/restore`,
  BULK_RESTORE_SUB_ADMINS: `${ADMIN}/sub-admins/recycle-bin/bulk-restore`,
  PERMANENT_DELETE_SUB_ADMIN: (id: string) => `${ADMIN}/sub-admins/recycle-bin/${id}`,
  BULK_PERMANENT_DELETE_SUB_ADMINS: `${ADMIN}/sub-admins/recycle-bin/bulk-permanent-delete`,
  BULK_DELETE_SUB_ADMINS: `${ADMIN}/sub-admins/bulk-delete`,
} as const;
