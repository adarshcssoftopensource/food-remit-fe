import {
  FINAL_STATUS,
  ORDER_STATUS,
  isAcceptedRequest,
  isAssignedOrder,
  isAwaitingPayment,
  isPendingOrder,
  isProcessingOrder,
  isRejectedRequest,
  isRequestedOrder,
} from "../../utils/order-workflow";
import { OrderData } from "../../types/order.types";
import {
  CreditCard,
  HandPlatter,
  Lock,
  PackageCheck,
  PackageX,
  RefreshCw,
  ShoppingBag,
  ThumbsUp,
  UserCheck,
  X,
} from "lucide-react";

export function formatFullStamp(iso?: string | Date | null) {
  if (!iso) return null;
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return null;
  return {
    date: d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    full: d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

export type StepState = "done" | "current" | "upcoming" | "failed";

export type TimelineStep = {
  key: string;
  label: string;
  subtitle: string;
  stamp: ReturnType<typeof formatFullStamp>;
  state: StepState;
  Icon: any;
};

export function getTimelineFlags(order: OrderData) {
  const pureRequested = isRequestedOrder(order);
  const accepted = isAcceptedRequest(order);
  const rejected = isRejectedRequest(order);
  const awaitingPayment = isAwaitingPayment(order);
  const pending = isPendingOrder(order);
  const assigned = isAssignedOrder(order);
  const processing = isProcessingOrder(order);
  /** Manager assignment adds an extra step; self-started orders skip it */
  const managerAssigned = assigned || Boolean(order.assignedById);
  const pickedUp = order.orderStatus === ORDER_STATUS.COMPLETED;
  const closed = order.orderStatus === ORDER_STATUS.CLOSED;
  const abandoned = closed && order.finalStatus === FINAL_STATUS.ABANDONED;
  const collected = closed && order.finalStatus === FINAL_STATUS.PICKED_UP;
  const paymentDone = !awaitingPayment && !rejected && order.orderStatus !== ORDER_STATUS.CANCELLED;

  return {
    pureRequested,
    accepted,
    rejected,
    awaitingPayment,
    pending,
    assigned,
    processing,
    managerAssigned,
    pickedUp,
    closed,
    abandoned,
    collected,
    paymentDone,
  };
}

export type TimelineFlags = ReturnType<typeof getTimelineFlags>;

function buildRequestSteps(order: OrderData, flags: TimelineFlags): TimelineStep[] {
  const { pureRequested, accepted, rejected, awaitingPayment, paymentDone } = flags;
  const createdStamp = formatFullStamp(order.createdAt);
  const paymentStamp = awaitingPayment || paymentDone || rejected ? createdStamp : null;

  const responseState: StepState = pureRequested
    ? "current"
    : accepted || paymentDone
      ? "done"
      : rejected
        ? "failed"
        : "upcoming";

  const paymentState: StepState = rejected
    ? "upcoming"
    : pureRequested
      ? "upcoming"
      : accepted
        ? "current"
        : paymentDone
          ? "done"
          : "upcoming";

  return [
    {
      key: "response",
      label: rejected ? "Rejected" : accepted || paymentDone ? "Accepted" : "Accept / Reject",
      subtitle: rejected
        ? "Rejected on mobile — remains in Requested tab"
        : pureRequested
          ? "Accept/Reject is done on the mobile app"
          : "Accepted on mobile — waiting for payment",
      stamp: createdStamp,
      state: responseState,
      Icon: rejected ? X : ThumbsUp,
    },
    {
      key: "payment",
      label: accepted ? "Pending Payment" : paymentDone ? "Payment Received" : "Pending Payment",
      subtitle: rejected
        ? "Payment not applicable after rejection"
        : pureRequested
          ? "Available after the request is accepted"
          : accepted
            ? "Customer has not paid yet"
            : "Payment completed — order moved to Pending",
      stamp: paymentStamp,
      state: paymentState,
      Icon: CreditCard,
    },
  ];
}

function buildAssignedSteps(order: OrderData, flags: TimelineFlags): TimelineStep[] {
  const { managerAssigned, assigned, processing, pickedUp, closed } = flags;
  if (!managerAssigned) return [];
  return [
    {
      key: "assigned",
      label: "Assigned",
      subtitle: order.assignedEmployeeName
        ? assigned
          ? `Assigned to ${order.assignedEmployeeName} — waiting for Start Order`
          : `Assigned to ${order.assignedEmployeeName}`
        : "Assigned by store manager",
      stamp: formatFullStamp(order.assignedAt),
      state: assigned ? "current" : processing || pickedUp || closed ? "done" : "upcoming",
      Icon: UserCheck,
    },
  ];
}

function buildPendingStep(order: OrderData, flags: TimelineFlags): TimelineStep {
  const {
    awaitingPayment,
    rejected,
    pending,
    paymentDone,
    assigned,
    processing,
    pickedUp,
    closed,
  } = flags;
  const afterPending = assigned || processing || pickedUp || closed;
  const unpaidRequest = order.orderType === 2 && (awaitingPayment || rejected);
  const createdStamp = formatFullStamp(order.createdAt);

  return {
    key: "pending",
    label: "Order Pending",
    subtitle: unpaidRequest
      ? "Starts after payment is completed"
      : "Paid — waiting to be started or assigned",
    stamp: paymentDone ? createdStamp : null,
    state: unpaidRequest
      ? "upcoming"
      : pending
        ? "current"
        : paymentDone || afterPending
          ? "done"
          : "upcoming",
    Icon: ShoppingBag,
  };
}

function buildProcessingStep(order: OrderData, flags: TimelineFlags): TimelineStep {
  const { processing, pickedUp, closed } = flags;
  return {
    key: "processing",
    label: "Processing",
    subtitle: order.startedByName
      ? `Started by ${order.startedByName}`
      : "Starts when an employee taps Start Order",
    stamp: formatFullStamp(order.startedAt),
    state: processing ? "current" : pickedUp || closed ? "done" : "upcoming",
    Icon: RefreshCw,
  };
}

function buildReadyStep(order: OrderData, flags: TimelineFlags): TimelineStep {
  const { pickedUp, closed } = flags;
  const handlerName = order.startedByName || order.assignedEmployeeName;
  return {
    key: "ready",
    label: "Ready for Pickup",
    subtitle:
      pickedUp || closed
        ? `Completed by ${handlerName || "store employee"}${
            pickedUp ? " — waiting for customer QR / reference" : ""
          }`
        : "Moves here after Mark as Completed",
    stamp: formatFullStamp(order.completedAt),
    state: pickedUp ? "current" : closed ? "done" : "upcoming",
    Icon: PackageCheck,
  };
}

function buildOutcomeStep(order: OrderData, flags: TimelineFlags): TimelineStep {
  const { abandoned, collected, pickedUp } = flags;
  const receiverName = order.recieverName || order.userName || "customer";
  if (abandoned) {
    return {
      key: "abandoned",
      label: "Abandoned",
      subtitle: `Not collected by ${receiverName}`,
      stamp: formatFullStamp(order.abandonedAt || order.closedAt),
      state: "failed",
      Icon: PackageX,
    };
  }
  return {
    key: "pickedUp",
    label: "Picked Up",
    subtitle: collected
      ? `Picked up by ${receiverName}`
      : pickedUp
        ? `Waiting for ${receiverName} to collect`
        : "After QR / reference is verified",
    stamp: formatFullStamp(collected ? order.pickedUpAt || order.closedAt : null),
    state: collected ? "done" : "upcoming",
    Icon: HandPlatter,
  };
}

function buildClosedStep(order: OrderData, flags: TimelineFlags): TimelineStep {
  const { closed, abandoned } = flags;
  return {
    key: "closed",
    label: "Closed",
    subtitle: closed
      ? abandoned
        ? "Closed automatically after abandonment"
        : "Closed automatically after pickup verification"
      : "Closes automatically after pickup",
    stamp: formatFullStamp(closed ? order.closedAt : null),
    state: closed ? "done" : "upcoming",
    Icon: Lock,
  };
}

export function buildTimelineSteps(order: OrderData, flags: TimelineFlags): TimelineStep[] {
  return [
    ...(order.orderType === 2 ? buildRequestSteps(order, flags) : []),
    buildPendingStep(order, flags),
    ...buildAssignedSteps(order, flags),
    buildProcessingStep(order, flags),
    buildReadyStep(order, flags),
    buildOutcomeStep(order, flags),
    buildClosedStep(order, flags),
  ];
}

export function getJourneyText(order: OrderData, managerAssigned: boolean) {
  return order.orderType === 2
    ? `Mobile Accept/Reject → Payment → Pending${managerAssigned ? " → Assigned" : ""} → Processing → Ready for Pickup → Picked Up → Closed`
    : `Pending${managerAssigned ? " → Assigned" : ""} → Processing → Ready for Pickup → Picked Up → Closed`;
}

export function isAmberCurrentStep(step: TimelineStep, pureRequested: boolean) {
  return (
    step.state === "current" &&
    (step.key === "payment" || (step.key === "response" && pureRequested))
  );
}

export function getConnectorClass(
  step: TimelineStep,
  nextStep: TimelineStep | undefined,
  isAmberCurrent: boolean,
) {
  return nextStep?.state === "upcoming"
    ? "bg-slate-200"
    : nextStep?.state === "failed" || step.state === "failed"
      ? "bg-red-300"
      : isAmberCurrent
        ? "bg-amber-300"
        : "bg-emerald-400";
}

export function getStepLabelClass(state: StepState, isAmberCurrent: boolean) {
  return state === "failed"
    ? "text-red-700"
    : state === "current"
      ? isAmberCurrent
        ? "text-amber-800"
        : "text-emerald-800"
      : state === "done"
        ? "text-slate-900 dark:text-white"
        : "text-slate-400";
}
