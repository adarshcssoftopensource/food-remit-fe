import { ADMIN } from "@/config/api";

export const CITY_MANAGER_ENDPOINTS = {
  GET_CITY_MANAGERS: `${ADMIN}/city-managers`,
  CREATE_CITY_MANAGER: `${ADMIN}/city-managers`,
  UPDATE_CITY_MANAGER: (id: string) => `${ADMIN}/city-managers/${id}`,
  DELETE_CITY_MANAGER: (id: string) => `${ADMIN}/city-managers/${id}`,
  GET_RECYCLED_CITY_MANAGERS: `${ADMIN}/city-managers/recycle-bin`,
  RESTORE_CITY_MANAGER: (id: string) => `${ADMIN}/city-managers/recycle-bin/${id}/restore`,
  BULK_RESTORE_CITY_MANAGERS: `${ADMIN}/city-managers/recycle-bin/bulk-restore`,
  PERMANENT_DELETE_CITY_MANAGER: (id: string) => `${ADMIN}/city-managers/${id}/permanent`,
  BULK_PERMANENT_DELETE_CITY_MANAGERS: `${ADMIN}/city-managers/recycle-bin/bulk-permanent-delete`,
  BULK_DELETE_CITY_MANAGERS: `${ADMIN}/city-managers/bulk-delete`,
} as const;
