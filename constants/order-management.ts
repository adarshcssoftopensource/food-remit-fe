export type OrderSectionKey =
  | "all"
  | "pending"
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
  pending: {
    title: "Pending",
    description: "Paid orders ready to be started or assigned.",
  },
  processing: {
    title: "Processing",
    description: "Orders being prepared by employees.",
  },
  completed: {
    title: "Completed",
    description: "Orders ready for customer pickup.",
  },
  history: {
    title: "Order History",
    description: "Closed orders (Picked Up or Abandoned).",
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
    description: "Track requested orders awaiting fulfillment.",
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
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Completed", value: "completed" },
  { label: "History", value: "history" },
];

/** Map legacy tab query values to the new workflow tabs */
export function normalizeOrderTab(tab: string | null): OrderSectionKey {
  if (!tab) return "all";
  if (tab === "all-orders") return "all";
  if (tab === "completed-orders") return "completed";
  if (tab === "preparing" || tab === "processing") return "processing";
  if (ORDER_TABS.some((t) => t.value === tab)) return tab as OrderSectionKey;
  return "all";
}
