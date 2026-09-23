"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/components/providers/profile-provider";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetOrder } from "./hooks/use-get-order";
import { OrderDetailSkeleton } from "./components/order-detail-skeleton";
import { OrderNotFound } from "./components/order-not-found";
import { OrderSummaryCard } from "./components/order-summary-card";
import { OrderFinancials } from "./components/order-financials";
import { OrderPeopleAndStore } from "./components/order-people-and-store";
import { OrderItemsTable } from "./components/order-items-table";
import { OrderStatusBadge } from "./components/order-status-badge";
import { OrderInfoBanner } from "./components/order-info-banner";
import { OrderProgressTimeline } from "./components/order-progress-timeline";
import { OrderAbandonRemarkCard } from "./components/order-abandon-remark-card";
import {
  OrderLifecycleActionCard,
  OrderLifecycleActionsHint,
  OrderWaitingBadge,
} from "./components/order-lifecycle-actions";
import { AbandonOrderDialog } from "./components/abandon-order-dialog";
import { useMarkOrderCompleted, useStartOrder } from "./hooks/use-order-lifecycle";
import {
  FINAL_STATUS,
  formatRelativeTime,
  isPendingOrder,
  isProcessingOrder,
  ORDER_STATUS,
} from "./utils/order-workflow";
import { CompleteOrderByReferenceDialog } from "@/feature/private/my-orders/components/complete-order-by-reference-dialog";
import { getOrderReference } from "./utils/mask-order-reference";
import { getInitials } from "@/lib/get-initials";
import { getOrderActorRole } from "./utils/order-roles";
import { StartOrderConfirmDialog } from "./components/start-order-confirm-dialog";

export function OrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { profile } = useProfile();
  const { data: order, isLoading } = useGetOrder(id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);

  const { mutateAsync: startOrder, isPending: starting } = useStartOrder();
  const { mutateAsync: markCompleted, isPending: completing } = useMarkOrderCompleted();

  const { canAbandon, canClose, isEmployee, canAssign } = getOrderActorRole(profile);

  if (isLoading) return <OrderDetailSkeleton />;
  if (!order) return <OrderNotFound onBack={() => router.back()} />;

  const pending = isPendingOrder(order);
  const processing = isProcessingOrder(order);
  const pickedUp = order.orderStatus === ORDER_STATUS.COMPLETED;
  const closed = order.orderStatus === ORDER_STATUS.CLOSED;
  const abandoned = closed && order.finalStatus === FINAL_STATUS.ABANDONED;
  const handlerName = order.startedByName || order.assignedEmployeeName;
  const orderRef = order.refrenceNumber || order.id.substring(0, 8).toUpperCase();
  const customerName = order.recieverName || order.userName || "the customer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs text-slate-500">
            Orders / #{order.refrenceNumber || order.id.substring(0, 8).toUpperCase()}
          </p>
          <PageHeader
            title="Order Details"
            description={
              pending
                ? "Paid and waiting to start."
                : processing
                  ? "Currently being prepared."
                  : pickedUp
                    ? "Picked Up — Close when collected, or Abandon with remark."
                    : abandoned
                      ? "This order was abandoned."
                      : "View order information and journey."
            }
          />
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge
              status={order.orderStatus}
              assignedEmployeeId={order.assignedEmployeeId}
              finalStatus={order.finalStatus}
              showFinal={closed}
            />
            {pickedUp && <OrderWaitingBadge label="Awaiting Close or Abandon" />}
          </div>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="rounded-full shadow-sm">
          <ArrowLeft className="mr-2 size-4" /> Back to Orders
        </Button>
      </div>

      {processing && handlerName && (
        <OrderInfoBanner
          variant="processing"
          message={`Processing · started by ${handlerName}${
            order.startedAt ? ` · ${new Date(order.startedAt).toLocaleString("en-IN")}` : ""
          }`}
        />
      )}

      <OrderAbandonRemarkCard order={order} />
      <OrderProgressTimeline order={order} />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <OrderSummaryCard order={order} />
          <OrderFinancials order={order} />
          <OrderPeopleAndStore order={order} />
          <OrderItemsTable items={order.items ?? []} onImageClick={setLightboxImage} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
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
                    Started {formatRelativeTime(order.startedAt || order.assignedAt) || "—"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Not yet started or assigned.</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="px-0.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Actions
            </p>

            {pending && isEmployee && (
              <OrderLifecycleActionCard
                variant="start"
                title="Start Order"
                description="Claim this order and move it to Processing."
                loading={starting}
                onClick={() => setStartOpen(true)}
              />
            )}

            {pending && !isEmployee && canAssign && (
              <OrderLifecycleActionsHint>
                Managers assign orders to employees from the orders list (⋮ menu).
              </OrderLifecycleActionsHint>
            )}

            {processing && (
              <OrderLifecycleActionCard
                variant="complete"
                title="Mark as Completed"
                description="Finishes preparation and auto-moves the order to Picked Up."
                loading={completing}
                onClick={async () => {
                  try {
                    await markCompleted(order.id);
                  } catch {}
                }}
              />
            )}

            {pickedUp && canClose && (
              <OrderLifecycleActionCard
                variant="close"
                title="Close Order"
                description="Customer collected the order. Verify with full reference ID."
                onClick={() => setCloseOpen(true)}
              />
            )}

            {pickedUp && canAbandon && (
              <OrderLifecycleActionCard
                variant="abandon"
                title="Abandon Order"
                description="Not collected. Remark is required — sender & receiver get email."
                onClick={() => setAbandonOpen(true)}
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
          </div>
        </aside>
      </div>

      <CompleteOrderByReferenceDialog
        orderId={order.id}
        open={closeOpen}
        onOpenChange={setCloseOpen}
        maskedHint={getOrderReference(order)}
        mode="pickup"
      />

      <StartOrderConfirmDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        orderRef={orderRef}
        customerName={customerName}
        isLoading={starting}
        onConfirm={async () => {
          try {
            await startOrder(order.id);
            setStartOpen(false);
          } catch {}
        }}
      />

      <AbandonOrderDialog
        orderId={order.id}
        open={abandonOpen}
        onOpenChange={setAbandonOpen}
        orderRef={orderRef}
      />

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
