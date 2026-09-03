import { ADMIN } from "@/config/api";

export const REPORT_ENDPOINTS = {
  GET_STORE_REPORTS: `${ADMIN}/reports/stores`,
  EXPORT_STORE_REPORTS: `${ADMIN}/reports/stores/export`,
  GET_STORE_REPORT_DETAIL: (id: string) => `${ADMIN}/reports/stores/${id}`,
  GET_STORE_ITEMS: (id: string) => `${ADMIN}/reports/stores/${id}/items`,
  EXPORT_STORE_ITEMS: (id: string) => `${ADMIN}/reports/stores/${id}/items/export`,
  GET_ITEM_TRANSACTIONS: (storeId: string, itemId: string) =>
    `${ADMIN}/reports/stores/${storeId}/items/${itemId}/transactions`,
  EXPORT_ITEM_TRANSACTIONS: (storeId: string, itemId: string) =>
    `${ADMIN}/reports/stores/${storeId}/items/${itemId}/transactions/export`,
  GET_ORDER_REPORTS: `${ADMIN}/reports/orders`,
  EXPORT_ORDER_REPORTS: `${ADMIN}/reports/orders/export`,
  GET_ORDER_REPORT_DETAIL: (id: string) => `${ADMIN}/reports/orders/${id}`,
} as const;
