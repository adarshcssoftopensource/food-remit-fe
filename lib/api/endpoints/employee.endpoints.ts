import { ADMIN } from "@/config/api";

export const EMPLOYEE_ENDPOINTS = {
  GET_EMPLOYEES: `${ADMIN}/employees`,
  GET_EMPLOYEE: (id: string) => `${ADMIN}/employees/${id}`,
  CREATE_EMPLOYEE: `${ADMIN}/employees`,
  UPDATE_EMPLOYEE: (id: string) => `${ADMIN}/employees/${id}`,
  DELETE_EMPLOYEE: (id: string) => `${ADMIN}/employees/${id}`,
  UPDATE_STATUS: (id: string) => `${ADMIN}/employees/${id}/status`,
  ASSIGN_ORDER: (id: string) => `${ADMIN}/employees/${id}/assign-order`,
  UNASSIGN_ORDER: `${ADMIN}/employees/unassign-order`,
  GET_EMPLOYEE_ORDERS: (id: string) => `${ADMIN}/employees/${id}/orders`,
  GET_RECYCLED_EMPLOYEES: `${ADMIN}/employees/recycled`,
  RESTORE_EMPLOYEE: (id: string) => `${ADMIN}/employees/${id}/restore`,
  PERMANENT_DELETE_EMPLOYEE: (id: string) => `${ADMIN}/employees/${id}/permanent-delete`,
  BULK_RESTORE_EMPLOYEES: `${ADMIN}/employees/bulk-restore`,
  BULK_PERMANENT_DELETE_EMPLOYEES: `${ADMIN}/employees/bulk-permanent-delete`,
} as const;
