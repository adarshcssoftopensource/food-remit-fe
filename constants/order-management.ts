export type OrderSectionKey =
  | "all"
  | "requested"
  | "pending"
  | "assigned"
  | "processing"
  | "completed"
  | "history"
  // Legacy keys kept so older URL params don't crash
  | "all-orders"
  | "sent-orders"
  | "requested-orders"
  | "preparing"
  | "partial-orders"
  | "completed-orders";

export const ORDER_SECTION_META: Record<OrderSectionKey, { title: string; description: string }> = {
  all: {
    title: "All Orders",
    description: "View and handle incoming store orders.",
  },
  requested: {
    title: "Requested Orders",
    description:
      "Food requests from mobile. Status shows Requested, Accepted, or Rejected. After payment, Accepted moves to Pending.",
  },
  pending: {
    title: "Pending",
    description:
      "Paid orders not yet assigned or started. Managers can assign; any employee can start.",
  },
  assigned: {
    title: "Assigned",
    description:
      "Orders assigned to an employee by a manager, waiting for the employee to tap Start Order.",
  },
  processing: {
    title: "Processing",
    description: "Orders being prepared by employees. Mark as Completed when ready.",
  },
  completed: {
    title: "Ready for Pickup / Delivery",
    description:
      "Completed orders waiting for the customer. Verify the QR / reference when collected — the order is marked Picked Up and Closed automatically.",
  },
  history: {
    title: "Closed Orders",
    description: "Picked up or abandoned orders — latest closed first.",
  },
  "all-orders": {
    title: "All Orders",
    description: "View all orders regardless of status.",
  },
  "sent-orders": {
    title: "Sent Orders",
    description: "Review all sent food remittance orders.",
  },
  "requested-orders": {
    title: "Requested Orders",
    description: "Unpaid food requests awaiting payment.",
  },
  preparing: {
    title: "Preparing",
    description: "Orders that are currently being prepared by employees.",
  },
  "partial-orders": {
    title: "Partial Orders",
    description: "Manage partially completed order records.",
  },
  "completed-orders": {
    title: "Completed Orders",
    description: "View successfully completed orders.",
  },
};

export const ORDER_TABS: { label: string; value: OrderSectionKey }[] = [
  { label: "All Orders", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Pending", value: "pending" },
  { label: "Assigned", value: "assigned" },
  { label: "Processing", value: "processing" },
  { label: "Ready for Pickup", value: "completed" },
  { label: "Closed", value: "history" },
];

/** Map legacy tab query values to the new workflow tabs */
export function normalizeOrderTab(tab: string | null): OrderSectionKey {
  if (!tab) return "all";
  if (tab === "all-orders") return "all";
  if (tab === "completed-orders") return "completed";
  if (tab === "preparing" || tab === "processing") return "processing";
  if (tab === "requested-orders") return "requested";
  if (ORDER_TABS.some((t) => t.value === tab)) return tab as OrderSectionKey;
  return "all";
}
