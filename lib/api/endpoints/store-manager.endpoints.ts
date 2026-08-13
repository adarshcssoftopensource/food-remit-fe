import { ADMIN } from "@/config/api";

export const STORE_MANAGER_ENDPOINTS = {
  GET_STORE_MANAGERS: `${ADMIN}/store-managers`,
  CREATE_STORE_MANAGER: `${ADMIN}/store-managers`,
  UPDATE_STORE_MANAGER: (id: string) => `${ADMIN}/store-managers/${id}`,
  DELETE_STORE_MANAGER: (id: string) => `${ADMIN}/store-managers/${id}`,
} as const;
