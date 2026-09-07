import { ADMIN } from "@/config/api";

export const AMOUNT_LIMIT_ENDPOINTS = {
  GET_AMOUNT_LIMITS: `${ADMIN}/amount-limits`,
  GET_AMOUNT_LIMIT: (id: string) => `${ADMIN}/amount-limits/${id}`,
  CREATE_AMOUNT_LIMIT: `${ADMIN}/amount-limits`,
  UPDATE_AMOUNT_LIMIT: (id: string) => `${ADMIN}/amount-limits/${id}`,
  DELETE_AMOUNT_LIMIT: (id: string) => `${ADMIN}/amount-limits/${id}`,
} as const;
