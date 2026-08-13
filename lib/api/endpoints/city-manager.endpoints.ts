import { ADMIN } from "@/config/api";

export const CITY_MANAGER_ENDPOINTS = {
  GET_CITY_MANAGERS: `${ADMIN}/city-managers`,
  CREATE_CITY_MANAGER: `${ADMIN}/city-managers`,
  UPDATE_CITY_MANAGER: (id: string) => `${ADMIN}/city-managers/${id}`,
  DELETE_CITY_MANAGER: (id: string) => `${ADMIN}/city-managers/${id}`,
} as const;
