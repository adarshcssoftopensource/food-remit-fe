import { ADMIN } from "@/config/api";

export const SETTINGS_ENDPOINTS = {
  GET_COUNTRIES: `${ADMIN}/countries`,
  GET_COUNTRIES_DROPDOWN: `${ADMIN}/countries/dropdown`,
  CREATE_COUNTRY: `${ADMIN}/countries`,
  UPDATE_COUNTRY: (id: string) => `${ADMIN}/countries/${id}`,
  DELETE_COUNTRY: (id: string) => `${ADMIN}/countries/${id}`,
  GET_CITIES: `${ADMIN}/cities`,
  GET_CITIES_DROPDOWN: `${ADMIN}/cities/dropdown`,
  CREATE_CITY: `${ADMIN}/cities`,
  UPDATE_CITY: (id: string) => `${ADMIN}/cities/${id}`,
  DELETE_CITY: (id: string) => `${ADMIN}/cities/${id}`,
  GET_MARKUP: `${ADMIN}/settings/markup`,
  UPDATE_MARKUP: `${ADMIN}/settings/markup`,
  GET_PROCESSING_FEES: `${ADMIN}/settings/processing-fees`,
  UPDATE_PROCESSING_FEE: (countryId: string) => `${ADMIN}/settings/processing-fees/${countryId}`,
} as const;
