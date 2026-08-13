import { ADMIN } from "@/config/api";

export const STORE_ENDPOINTS = {
  GET_STORES: `${ADMIN}/stores`,
  CREATE_STORE: `${ADMIN}/stores`,
  UPDATE_STORE: (id: string) => `${ADMIN}/stores/${id}`,
  DELETE_STORE: (id: string) => `${ADMIN}/stores/${id}`,
} as const;
