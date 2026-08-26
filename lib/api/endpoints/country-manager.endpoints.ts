import { ADMIN } from "@/config/api";

export const COUNTRY_MANAGER_ENDPOINTS = {
  GET_COUNTRY_MANAGERS: `${ADMIN}/country-managers`,
  CREATE_COUNTRY_MANAGER: `${ADMIN}/country-managers`,
  UPDATE_COUNTRY_MANAGER: (id: string) => `${ADMIN}/country-managers/${id}`,
  DELETE_COUNTRY_MANAGER: (id: string) => `${ADMIN}/country-managers/${id}`,
  GET_RECYCLED_COUNTRY_MANAGERS: `${ADMIN}/country-managers/recycle-bin`,
  RESTORE_COUNTRY_MANAGER: (id: string) => `${ADMIN}/country-managers/recycle-bin/${id}/restore`,
  BULK_RESTORE_COUNTRY_MANAGERS: `${ADMIN}/country-managers/recycle-bin/bulk-restore`,
  PERMANENT_DELETE_COUNTRY_MANAGER: (id: string) => `${ADMIN}/country-managers/${id}/permanent`,
  BULK_PERMANENT_DELETE_COUNTRY_MANAGERS: `${ADMIN}/country-managers/recycle-bin/bulk-permanent-delete`,
  BULK_DELETE_COUNTRY_MANAGERS: `${ADMIN}/country-managers/bulk-delete`,
} as const;
