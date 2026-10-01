import { OrderData } from "@/feature/private/(store-admin)/order-management/types/order.types";
import {
  FINAL_STATUS,
  isAssignedOrder,
  isPendingOrder,
  isProcessingOrder,
  ORDER_STATUS,
} from "@/feature/private/(store-admin)/order-management/utils/order-workflow";
import { getOrderReference } from "@/feature/private/(store-admin)/order-management/utils/mask-order-reference";

export function getEmployeeOrderState(order: OrderData) {
  const pending = isPendingOrder(order);
  const assigned = isAssignedOrder(order);
  const canStart = pending || assigned;
  const processing = isProcessingOrder(order);
  const pickedUp = order.orderStatus === ORDER_STATUS.COMPLETED;
  const closed = order.orderStatus === ORDER_STATUS.CLOSED;
  const abandoned = closed && order.finalStatus === FINAL_STATUS.ABANDONED;
  const handlerName = order.startedByName || order.assignedEmployeeName;
  const itemCount =
    order.items?.reduce((s, i) => s + (i.quantity || 0), 0) || order.items?.length || 0;
  const orderRef = getOrderReference(order);
  const customerName = order.recieverName || order.userName || "the customer";

  return {
    pending,
    assigned,
    canStart,
    processing,
    pickedUp,
    closed,
    abandoned,
    handlerName,
    itemCount,
    orderRef,
    customerName,
  };
}

export type EmployeeOrderState = ReturnType<typeof getEmployeeOrderState>;

export function getEmployeeOrderDescription({
  pending,
  assigned,
  processing,
  pickedUp,
  abandoned,
}: EmployeeOrderState) {
  if (pending) return "Paid and waiting to be started.";
  if (assigned) return "Assigned to you by your manager — tap Start Order to begin.";
  if (processing) return "You are preparing this order.";
  if (pickedUp) return "Ready for Pickup / Delivery — verify the QR / reference when collected.";
  if (abandoned) return "This order was abandoned.";
  return "Order details";
}
