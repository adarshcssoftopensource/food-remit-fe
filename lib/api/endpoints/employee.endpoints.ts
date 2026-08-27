import { ADMIN } from "@/config/api";

export const EMPLOYEE_ENDPOINTS = {
  GET_EMPLOYEES: `${ADMIN}/employees`,
  CREATE_EMPLOYEE: `${ADMIN}/employees`,
  UPDATE_EMPLOYEE: (id: string) => `${ADMIN}/employees/${id}`,
  DELETE_EMPLOYEE: (id: string) => `${ADMIN}/employees/${id}`,
  UPDATE_STATUS: (id: string) => `${ADMIN}/employees/${id}/status`,
} as const;
