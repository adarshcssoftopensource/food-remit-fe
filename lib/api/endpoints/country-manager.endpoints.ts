import { ADMIN } from "@/config/api";

export const COUNTRY_MANAGER_ENDPOINTS = {
  GET_COUNTRY_MANAGERS: `${ADMIN}/country-managers`,
  CREATE_COUNTRY_MANAGER: `${ADMIN}/country-managers`,
  UPDATE_COUNTRY_MANAGER: (id: string) => `${ADMIN}/country-managers/${id}`,
  DELETE_COUNTRY_MANAGER: (id: string) => `${ADMIN}/country-managers/${id}`,
} as const;
