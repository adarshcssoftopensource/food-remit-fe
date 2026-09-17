export type OrderRow = {
  id: string;
  referenceNo: string;
  orderDate: string;
  senderName: string;
  receiverName: string;
  totalCost: string;
  processingFees: string;
  totalItemTax: string;
  status: string;
  country: string;
};

export type OrderSectionKey =
  | "all-orders"
  | "sent-orders"
  | "requested-orders"
  | "preparing"
  | "processing"
  | "partial-orders"
  | "completed-orders"
  | "history";

export const ORDER_SECTION_META: Record<OrderSectionKey, { title: string; description: string }> = {
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
  processing: {
    title: "Processing",
    description: "Orders that are currently assigned to employees and being processed.",
  },
  "partial-orders": {
    title: "Partial Orders",
    description: "Manage partially completed order records.",
  },
  "completed-orders": {
    title: "Completed Orders",
    description: "View successfully completed orders.",
  },
  history: {
    title: "History",
    description: "Browse historical order activity.",
  },
};

export const ORDER_TABS: { label: string; value: OrderSectionKey }[] = [
  { label: "All Orders", value: "all-orders" },
  { label: "Sent Orders", value: "sent-orders" },
  { label: "Requested Orders", value: "requested-orders" },
  { label: "Processing", value: "processing" },
  { label: "Preparing", value: "preparing" },
  { label: "Partial Orders", value: "partial-orders" },
  { label: "Completed Orders", value: "completed-orders" },
];
