import { ADMIN } from "@/config/api";

export const NOTIFICATION_ENDPOINTS = {
  SEND: `${ADMIN}/notifications/send`,
  RECIPIENTS: `${ADMIN}/notifications/recipients`,
  LIST: `${ADMIN}/notifications`,
  COUNT: `${ADMIN}/notifications/count`,
  READ_ALL: `${ADMIN}/notifications/read-all`,
  READ_ONE: (id: string) => `${ADMIN}/notifications/${id}/read`,
  DELETE_ONE: (id: string) => `${ADMIN}/notifications/${id}`,
} as const;

export const NOTIFICATION_ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "sub_admin", label: "Sub Admin" },
  { value: "co_admin", label: "Co Admin" },
  { value: "country_manager", label: "Country Manager" },
  { value: "city_manager", label: "City Manager" },
  { value: "store_manager", label: "Store Manager" },
  { value: "employee", label: "Employee" },
  { value: "app_user", label: "App Users" },
] as const;

export type NotificationTargetRole = (typeof NOTIFICATION_ROLE_OPTIONS)[number]["value"];
