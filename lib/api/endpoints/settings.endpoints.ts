import { ADMIN } from "@/config/api";

export const SETTINGS_ENDPOINTS = {
  GET_COUNTRIES: `${ADMIN}/countries`,
  CREATE_COUNTRY: `${ADMIN}/countries`,
  UPDATE_COUNTRY: (id: string) => `${ADMIN}/countries/${id}`,
  DELETE_COUNTRY: (id: string) => `${ADMIN}/countries/${id}`,
  GET_CITIES: `${ADMIN}/cities`,
  CREATE_CITY: `${ADMIN}/cities`,
  UPDATE_CITY: (id: string) => `${ADMIN}/cities/${id}`,
  DELETE_CITY: (id: string) => `${ADMIN}/cities/${id}`,
} as const;
