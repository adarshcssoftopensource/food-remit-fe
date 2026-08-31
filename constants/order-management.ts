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
  | "sent-orders"
  | "requested-orders"
  | "partial-orders"
  | "completed-orders"
  | "fulfilment"
  | "history";

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
  fulfilment: {
    title: "Fulfilment",
    description: "Orders that have been paid and are being prepared or picked up.",
  },
  history: {
    title: "History",
    description: "Browse historical order activity.",
  },
};

export const ORDER_TABS: { label: string; value: OrderSectionKey }[] = [
  { label: "Sent Orders", value: "sent-orders" },
  { label: "Requested Orders", value: "requested-orders" },
  { label: "Partial Orders", value: "partial-orders" },
  { label: "Completed Orders", value: "completed-orders" },
  { label: "Fulfilment", value: "fulfilment" },
  { label: "History", value: "history" },
];
