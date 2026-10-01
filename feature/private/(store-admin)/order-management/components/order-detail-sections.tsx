"use client";

import { getInitials } from "@/lib/get-initials";
import { OrderData } from "../types/order.types";
import { formatRelativeTime } from "../utils/order-workflow";
import { OrderDetailState, formatBannerStamp } from "../utils/order-detail-state";
import { OrderInfoBanner } from "./order-info-banner";
import {
  OrderLifecycleActionCard,
  OrderLifecycleActionsHint,
  OrderWaitingBadge,
} from "./order-lifecycle-actions";

export function OrderDetailWaitingBadges({ state }: { state: OrderDetailState }) {
  const { pureRequested, accepted, assigned, pickedUp } = state;
  return (
    <>
      {pureRequested && <OrderWaitingBadge label="Awaiting mobile response" />}
      {accepted && <OrderWaitingBadge label="Awaiting Payment" />}
      {assigned && <OrderWaitingBadge label="Awaiting Start" />}
      {pickedUp && <OrderWaitingBadge label="Awaiting Pickup" />}
    </>
  );
}

export function OrderDetailBanners({
  order,
  state,
}: {
  order: OrderData;
  state: OrderDetailState;
}) {
  const { pureRequested, accepted, rejected, assigned, processing, handlerName } = state;
  return (
    <>
      {pureRequested && (
        <OrderInfoBanner
          variant="requested"
          message="Accept/Reject is done on the mobile app. This panel only shows the current status."
        />
      )}
      {accepted && (
        <OrderInfoBanner
          variant="requested"
          message="Accepted on mobile. After the customer pays, this order moves to Pending for assign/start."
        />
      )}
      {rejected && (
        <OrderInfoBanner
          variant="requested"
          message="Rejected on mobile. Order stays visible in Requested and All with Rejected status."
        />
      )}
      {assigned && (
        <OrderInfoBanner
          variant="processing"
          message={`Assigned to ${order.assignedEmployeeName || "an employee"}${formatBannerStamp(
            order.assignedAt,
          )} · waiting for the employee to tap Start Order.`}
        />
      )}
      {processing && handlerName && (
        <OrderInfoBanner
          variant="processing"
          message={`Processing · started by ${handlerName}${formatBannerStamp(order.startedAt)}`}
        />
      )}
    </>
  );
}

function OwnershipPlaceholder({ state }: { state: OrderDetailState }) {
  const { pureRequested, accepted, rejected } = state;
  return (
    <p className="mt-2 text-sm text-slate-500">
      {pureRequested
        ? "Awaiting Accept/Reject on mobile."
        : accepted
          ? "Accepted on mobile — waiting for payment."
          : rejected
            ? "Rejected on mobile — no preparation."
            : "Not yet started or assigned."}
    </p>
  );
}

export function OrderOwnershipCard({
  order,
  state,
}: {
  order: OrderData;
  state: OrderDetailState;
}) {
  const { handlerName } = state;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Order ownership
      </p>
      {handlerName ? (
        <div className="mt-3 flex items-center gap-3">
          {order.startedByImage || order.assignedEmployeeImage ? (
            <img
              src={order.startedByImage || order.assignedEmployeeImage || ""}
              alt=""
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">
              {getInitials(handlerName)}
            </span>
          )}
          <div>
            <p className="text-sm font-semibold">{handlerName}</p>
            <p className="text-xs text-slate-500">
              {order.startedAt
                ? `Started ${formatRelativeTime(order.startedAt)}`
                : `Assigned ${formatRelativeTime(order.assignedAt) || "—"}`}
            </p>
          </div>
        </div>
      ) : (
        <OwnershipPlaceholder state={state} />
      )}
    </div>
  );
}

export function RequestActionsHint({ state }: { state: OrderDetailState }) {
  const { pureRequested, accepted, rejected } = state;
  if (!(pureRequested || accepted || rejected)) return null;
  return (
    <OrderLifecycleActionsHint>
      {pureRequested
        ? "No store actions yet. Accept/Reject happens on the mobile app — status updates here automatically."
        : accepted
          ? "Waiting for customer payment. After payment this moves to Pending."
          : "This request was rejected on mobile. No further actions available."}
    </OrderLifecycleActionsHint>
  );
}

interface PreparationActionsProps {
  state: OrderDetailState;
  canStart: boolean;
  isEmployee: boolean;
  canAssign: boolean;
  starting: boolean;
  completing: boolean;
  onStart: () => void;
  onComplete: () => void;
}

export function PreparationActions({
  state,
  canStart,
  isEmployee,
  canAssign,
  starting,
  completing,
  onStart,
  onComplete,
}: PreparationActionsProps) {
  const { pending, assigned, processing } = state;
  return (
    <>
      {canStart && (
        <OrderLifecycleActionCard
          variant="start"
          title="Start Order"
          description={
            assigned
              ? "This order is assigned to you. Start it to move it to Processing."
              : "Claim this order and move it to Processing."
          }
          loading={starting}
          onClick={onStart}
        />
      )}

      {pending && !isEmployee && canAssign && (
        <OrderLifecycleActionsHint>
          Managers assign orders to employees from the orders list (⋮ menu). Assigned orders wait
          for the employee to tap Start Order.
        </OrderLifecycleActionsHint>
      )}

      {assigned && !canStart && (
        <OrderLifecycleActionsHint>
          {isEmployee
            ? "This order is assigned to another employee."
            : "Waiting for the assigned employee to tap Start Order."}
        </OrderLifecycleActionsHint>
      )}

      {processing && (
        <OrderLifecycleActionCard
          variant="complete"
          title="Mark as Completed"
          description="Finishes preparation — status becomes Ready for Pickup / Delivery."
          loading={completing}
          onClick={onComplete}
        />
      )}
    </>
  );
}

interface PickupActionsProps {
  state: OrderDetailState;
  isEmployee: boolean;
  canClose: boolean;
  canAbandon: boolean;
  onClose: () => void;
  onAbandon: () => void;
}

export function PickupActions({
  state,
  isEmployee,
  canClose,
  canAbandon,
  onClose,
  onAbandon,
}: PickupActionsProps) {
  const { pickedUp, closed } = state;
  return (
    <>
      {pickedUp && canClose && (
        <OrderLifecycleActionCard
          variant="close"
          title="Verify & Close"
          description="Customer collected the order. Verify the QR / reference — marks Picked Up and Closes automatically."
          onClick={onClose}
        />
      )}

      {pickedUp && canAbandon && (
        <OrderLifecycleActionCard
          variant="abandon"
          title="Abandon Order"
          description="Not collected. Remark is required — sender & receiver get email."
          onClick={onAbandon}
        />
      )}

      {pickedUp && isEmployee && !canAbandon && (
        <OrderLifecycleActionsHint>
          Employees can only Close with a reference. Store admin abandons with a remark.
        </OrderLifecycleActionsHint>
      )}

      {closed && (
        <OrderLifecycleActionsHint>
          This order is closed and moved to History. No further actions available.
        </OrderLifecycleActionsHint>
      )}
    </>
  );
}
