import { ADMIN } from "@/config/api";

export const REPORT_ENDPOINTS = {
  GET_STORE_REPORTS: `${ADMIN}/reports/stores`,
  EXPORT_STORE_REPORTS: `${ADMIN}/reports/stores/export`,
  GET_STORE_REPORT_DETAIL: (id: string) => `${ADMIN}/reports/stores/${id}`,
  GET_STORE_ORDERS: (id: string) => `${ADMIN}/reports/stores/${id}/orders`,
  EXPORT_STORE_ORDERS: (id: string) => `${ADMIN}/reports/stores/${id}/orders/export`,
  GET_ORDER_REPORTS: `${ADMIN}/reports/orders`,
  EXPORT_ORDER_REPORTS: `${ADMIN}/reports/orders/export`,
  GET_ORDER_REPORT_DETAIL: (id: string) => `${ADMIN}/reports/orders/${id}`,
  GET_CUSTOMER_REPORTS: `${ADMIN}/reports/customers`,
  EXPORT_CUSTOMER_REPORTS: `${ADMIN}/reports/customers/export`,
  GET_CUSTOMER_REPORT_DETAIL: (id: string) => `${ADMIN}/reports/customers/${id}`,
  GET_CUSTOMER_ORDERS: (id: string) => `${ADMIN}/reports/customers/${id}/orders`,
  EXPORT_CUSTOMER_ORDERS: (id: string) => `${ADMIN}/reports/customers/${id}/orders/export`,
} as const;
