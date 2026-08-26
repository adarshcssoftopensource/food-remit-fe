import { ADMIN } from "@/config/api";

export const STORE_ENDPOINTS = {
  GET_STORES: `${ADMIN}/stores`,
  CREATE_STORE: `${ADMIN}/stores`,
  UPDATE_STORE: (id: string) => `${ADMIN}/stores/${id}`,
  DELETE_STORE: (id: string) => `${ADMIN}/stores/${id}`,
  GET_RECYCLED_STORES: `${ADMIN}/stores/recycle-bin`,
  RESTORE_STORE: (id: string) => `${ADMIN}/stores/recycle-bin/${id}/restore`,
  BULK_RESTORE_STORES: `${ADMIN}/stores/recycle-bin/bulk-restore`,
  PERMANENT_DELETE_STORE: (id: string) => `${ADMIN}/stores/${id}/permanent`,
  BULK_PERMANENT_DELETE_STORES: `${ADMIN}/stores/recycle-bin/bulk-permanent-delete`,
  BULK_DELETE_STORES: `${ADMIN}/stores/bulk-delete`,
} as const;
