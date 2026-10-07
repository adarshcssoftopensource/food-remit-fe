"use client";

import { OrderInfoBanner } from "@/feature/private/(store-admin)/order-management/components/details/order-info-banner";
import {
  OrderLifecycleActionCard,
  OrderLifecycleActionsHint,
} from "@/feature/private/(store-admin)/order-management/components/details/order-lifecycle-actions";
import { OrderData } from "@/feature/private/(store-admin)/order-management/types/order.types";
import { formatRelativeTime } from "@/feature/private/(store-admin)/order-management/utils/order-workflow";
import { getInitials } from "@/lib/get-initials";
import { EmployeeOrderState } from "./employee-order-state";

function withRelativeTime(date?: string | Date | null) {
  return date ? ` · ${formatRelativeTime(date)}` : "";
}

interface EmployeeOrderBannersProps {
  order: OrderData;
  state: EmployeeOrderState;
}

export function EmployeeOrderBanners({ order, state }: EmployeeOrderBannersProps) {
  const { pending, assigned, processing, handlerName } = state;
  return (
    <>
      {pending && (
        <OrderInfoBanner
          variant="employee-start"
          message="Start this order to claim it. Status becomes Processing and other employees cannot start it."
        />
      )}
      {assigned && (
        <OrderInfoBanner
          variant="employee-start"
          message={`Assigned to you${withRelativeTime(
            order.assignedAt,
          )}. Tap Start Order to move it to Processing.`}
        />
      )}
      {processing && handlerName && (
        <OrderInfoBanner
          variant="processing"
          message={`In Processing · ${handlerName}${withRelativeTime(order.startedAt)}`}
        />
      )}
    </>
  );
}

function getOwnershipTimeLabel(order: OrderData) {
  return order.startedAt
    ? `Started ${formatRelativeTime(order.startedAt)}`
    : `Assigned ${formatRelativeTime(order.assignedAt) || "—"}`;
}

interface EmployeeOrderOwnershipCardProps {
  order: OrderData;
  handlerName: EmployeeOrderState["handlerName"];
  itemCount: number;
}

export function EmployeeOrderOwnershipCard({
  order,
  handlerName,
  itemCount,
}: EmployeeOrderOwnershipCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-emerald-50/80 to-white p-4 shadow-xs dark:border-slate-800 dark:from-emerald-950/20 dark:to-slate-900">
      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Order ownership
      </p>
      {handlerName ? (
        <div className="mt-3 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white shadow-sm">
            {getInitials(handlerName)}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{handlerName}</p>
            <p className="text-xs text-slate-500">{getOwnershipTimeLabel(order)}</p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Nobody has started this order yet.</p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-emerald-100 pt-3 dark:border-emerald-900/40">
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase">Items</p>
          <p className="text-sm font-semibold">{itemCount}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-slate-400 uppercase">Total</p>
          <p className="text-sm font-semibold">{order.price || "—"}</p>
        </div>
      </div>
    </div>
  );
}

interface EmployeeOrderActionsProps {
  state: EmployeeOrderState;
  starting: boolean;
  completing: boolean;
  onStartClick: () => void;
  onMarkCompleted: () => Promise<void>;
  onCloseClick: () => void;
}

export function EmployeeOrderActions({
  state,
  starting,
  completing,
  onStartClick,
  onMarkCompleted,
  onCloseClick,
}: EmployeeOrderActionsProps) {
  const { canStart, assigned, processing, pickedUp } = state;
  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Actions</p>
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
          onClick={onStartClick}
        />
      )}
      {processing && (
        <OrderLifecycleActionCard
          variant="complete"
          title="Mark as Completed"
          description="Finishes prep — status becomes Ready for Pickup / Delivery."
          loading={completing}
          onClick={onMarkCompleted}
        />
      )}
      {pickedUp && (
        <OrderLifecycleActionCard
          variant="close"
          title="Verify & Close"
          description="Customer collected — verify the QR / reference. Marks Picked Up and Closes automatically."
          onClick={onCloseClick}
        />
      )}
      {pickedUp && (
        <OrderLifecycleActionsHint>
          Store admin abandons with a remark if nobody collects.
        </OrderLifecycleActionsHint>
      )}
    </div>
  );
}
