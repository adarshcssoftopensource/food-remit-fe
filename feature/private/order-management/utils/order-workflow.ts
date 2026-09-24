/** Mirrors backend order lifecycle for the employee processing flow */
export const ORDER_STATUS = {
  CANCELLED: 0,
  REQUESTED: 1,
  PREPARING: 2,
  OUT_FOR_DELIVERY_ALT: 3,
  OUT_FOR_DELIVERY: 4,
  PROCESSING: 5,
  COMPLETED: 6,
  DECLINED: 7,
  /** Paid — UI "Pending" when unassigned */
  PAID: 8,
  PARTIAL: 9,
  ACCEPTED: 10,
  CLOSED: 11,
} as const;

export const FINAL_STATUS = {
  PICKED_UP: 1,
  ABANDONED: 2,
} as const;

export const PROCESSING_STATUSES = [
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.OUT_FOR_DELIVERY_ALT,
] as const;

/** Requested tab: Requested / Accepted (awaiting pay) / Rejected */
export const REQUEST_QUEUE_STATUSES = [
  ORDER_STATUS.REQUESTED,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.DECLINED,
] as const;

export type OrderWorkflowTab =
  "all" | "requested" | "pending" | "processing" | "completed" | "history";

export type HistorySubFilter = "all" | "picked-up" | "abandoned";

/** Pure Requested — not yet accepted or rejected */
export function isRequestedOrder(order: { orderStatus: number }): boolean {
  return order.orderStatus === ORDER_STATUS.REQUESTED;
}

export function isAcceptedRequest(order: { orderStatus: number }): boolean {
  return order.orderStatus === ORDER_STATUS.ACCEPTED;
}

export function isRejectedRequest(order: { orderStatus: number }): boolean {
  return order.orderStatus === ORDER_STATUS.DECLINED;
}

/** Still in request queue (Requested tab) */
export function isRequestQueueOrder(order: { orderStatus: number }): boolean {
  return (REQUEST_QUEUE_STATUSES as readonly number[]).includes(order.orderStatus);
}

/** Unpaid request that can still be paid after Accept */
export function isAwaitingPayment(order: { orderStatus: number }): boolean {
  return (
    order.orderStatus === ORDER_STATUS.REQUESTED || order.orderStatus === ORDER_STATUS.ACCEPTED
  );
}

export function isPendingOrder(order: {
  orderStatus: number;
  assignedEmployeeId?: string | null;
  startedById?: string | null;
}): boolean {
  return order.orderStatus === ORDER_STATUS.PAID && !order.assignedEmployeeId && !order.startedById;
}

export function isProcessingOrder(order: { orderStatus: number }): boolean {
  return (PROCESSING_STATUSES as readonly number[]).includes(order.orderStatus);
}

export function getDisplayStatus(order: {
  orderStatus: number;
  assignedEmployeeId?: string | null;
  finalStatus?: number | null;
}): {
  label: string;
  tone:
    | "requested"
    | "accepted"
    | "rejected"
    | "pending"
    | "processing"
    | "completed"
    | "picked-up"
    | "abandoned"
    | "closed"
    | "other";
} {
  if (order.orderStatus === ORDER_STATUS.CLOSED) {
    if (order.finalStatus === FINAL_STATUS.PICKED_UP) {
      return { label: "Closed", tone: "closed" };
    }
    if (order.finalStatus === FINAL_STATUS.ABANDONED) {
      return { label: "Closed", tone: "closed" };
    }
    return { label: "Closed", tone: "closed" };
  }
  if (isRequestedOrder(order)) return { label: "Requested", tone: "requested" };
  if (isAcceptedRequest(order)) return { label: "Accepted", tone: "accepted" };
  if (isRejectedRequest(order)) return { label: "Rejected", tone: "rejected" };
  if (isPendingOrder(order)) return { label: "Pending", tone: "pending" };
  if (isProcessingOrder(order)) return { label: "Processing", tone: "processing" };
  if (order.orderStatus === ORDER_STATUS.COMPLETED) {
    return { label: "Picked Up", tone: "picked-up" };
  }
  if (order.orderStatus === ORDER_STATUS.PAID) return { label: "Pending", tone: "pending" };
  if (order.orderStatus === ORDER_STATUS.PARTIAL) return { label: "Partial", tone: "other" };
  if (order.orderStatus === ORDER_STATUS.CANCELLED) {
    return { label: "Cancelled", tone: "other" };
  }
  return { label: "Unknown", tone: "other" };
}

export function getFinalStatusLabel(finalStatus?: number | null): string | null {
  if (finalStatus === FINAL_STATUS.PICKED_UP) return "Closed (Collected)";
  if (finalStatus === FINAL_STATUS.ABANDONED) return "Abandoned";
  return null;
}

export function formatRelativeTime(date?: string | Date | null): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
