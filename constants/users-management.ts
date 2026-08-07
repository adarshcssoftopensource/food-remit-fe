import { UserCheck, Users, UserX } from "lucide-react";

export type OrderData = {
  orderId: string;
  orderDate: string;
  receiverName?: string;
  senderName?: string;
  storeName: string;
  cost: number;
  status: "Pending" | "Completed" | "Cancelled" | "Processing";
};

export const USER_STATUS_OPTIONS = [
  { label: "All Users", value: "" },
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const MOCK_REQUESTED_ORDERS: Record<string, OrderData[]> = {};
export const MOCK_SENT_ORDERS: Record<string, OrderData[]> = {};
export const MOCK_RECEIVED_ORDERS: Record<string, OrderData[]> = {};

export const STAT_CONFIG = [
  { key: "total", label: "Total Users", Icon: Users, color: "text-primary", bg: "bg-primary/10" },
  {
    key: "active",
    label: "Active Users",
    Icon: UserCheck,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  { key: "inactive", label: "Inactive Users", Icon: UserX, color: "text-red-500", bg: "bg-red-50" },
] as const;

export const USER_MANAGEMENT_VIEW_TABS = [
  { value: "profile", label: "Profile" },
  { value: "requested", label: "Requested Orders" },
  { value: "sent", label: "Sent Orders" },
  { value: "received", label: "Received Orders" },
] as const;

export const USER_MANAGEMENT_STATUS_STYLES: Record<OrderData["status"], string> = {
  Completed: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Processing: "bg-blue-100 text-blue-700 border-blue-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};
