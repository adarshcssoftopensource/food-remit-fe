import { OrderData } from "../types/order.types";
import {
  FINAL_STATUS,
  isAcceptedRequest,
  isAssignedOrder,
  isPendingOrder,
  isProcessingOrder,
  isRejectedRequest,
  isRequestedOrder,
  ORDER_STATUS,
} from "./order-workflow";

export function getOrderDetailState(order: OrderData) {
  const pureRequested = isRequestedOrder(order);
  const accepted = isAcceptedRequest(order);
  const rejected = isRejectedRequest(order);
  const pending = isPendingOrder(order);
  const assigned = isAssignedOrder(order);
  const processing = isProcessingOrder(order);
  const pickedUp = order.orderStatus === ORDER_STATUS.COMPLETED;
  const closed = order.orderStatus === ORDER_STATUS.CLOSED;
  const abandoned = closed && order.finalStatus === FINAL_STATUS.ABANDONED;
  const handlerName = order.startedByName || order.assignedEmployeeName;
  const orderRef = order.refrenceNumber || order.id.substring(0, 8).toUpperCase();
  const customerName = order.recieverName || order.userName || "the customer";

  return {
    pureRequested,
    accepted,
    rejected,
    pending,
    assigned,
    processing,
    pickedUp,
    closed,
    abandoned,
    handlerName,
    orderRef,
    customerName,
  };
}

export type OrderDetailState = ReturnType<typeof getOrderDetailState>;

export function getOrderPageDescription(state: OrderDetailState) {
  const { pureRequested, accepted, rejected, pending, assigned, processing, pickedUp, abandoned } =
    state;
  return pureRequested
    ? "Food request — Accept/Reject happens on mobile. Status shown here."
    : accepted
      ? "Accepted on mobile — awaiting customer payment. Stays in Requested until paid."
      : rejected
        ? "This request was rejected on mobile."
        : pending
          ? "Paid and waiting to be assigned or started."
          : assigned
            ? "Assigned to an employee — waiting for Start Order."
            : processing
              ? "Currently being prepared."
              : pickedUp
                ? "Ready for Pickup / Delivery — verify the QR / reference when collected."
                : abandoned
                  ? "This order was abandoned."
                  : "View order information and journey.";
}

export function formatBannerStamp(iso: string | null | undefined) {
  return iso ? ` · ${new Date(iso).toLocaleString("en-IN")}` : "";
}
