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
  "sent-orders" | "requested-orders" | "partial-orders" | "completed-orders" | "history";

export const ORDER_SECTION_META: Record<OrderSectionKey, { title: string; description: string }> = {
  "sent-orders": {
    title: "Sent Orders",
    description: "Review all sent food remittance orders.",
  },
  "requested-orders": {
    title: "Requested Orders",
    description: "Track requested orders awaiting fulfillment.",
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
