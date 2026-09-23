"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useGetOrder } from "@/feature/private/order-management/hooks/use-get-order";
import { OrderDetailSkeleton } from "@/feature/private/order-management/components/order-detail-skeleton";
import { OrderNotFound } from "@/feature/private/order-management/components/order-not-found";
import { OrderSummaryCard } from "@/feature/private/order-management/components/order-summary-card";
import { OrderPeopleAndStore } from "@/feature/private/order-management/components/order-people-and-store";
import { OrderItemsTable } from "@/feature/private/order-management/components/order-items-table";
import { OrderStatusBadge } from "@/feature/private/order-management/components/order-status-badge";
import { OrderInfoBanner } from "@/feature/private/order-management/components/order-info-banner";
import { OrderProgressTimeline } from "@/feature/private/order-management/components/order-progress-timeline";
import { OrderAbandonRemarkCard } from "@/feature/private/order-management/components/order-abandon-remark-card";
import {
  OrderLifecycleActionCard,
  OrderLifecycleActionsHint,
  OrderWaitingBadge,
} from "@/feature/private/order-management/components/order-lifecycle-actions";
import {
  useMarkOrderCompleted,
  useStartOrder,
} from "@/feature/private/order-management/hooks/use-order-lifecycle";
import {
  FINAL_STATUS,
  formatRelativeTime,
  isPendingOrder,
  isProcessingOrder,
  ORDER_STATUS,
} from "@/feature/private/order-management/utils/order-workflow";
import { getInitials } from "@/lib/get-initials";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompleteOrderByReferenceDialog } from "./components/complete-order-by-reference-dialog";
import { EmployeeOrderFinancials } from "./components/employee-order-financials";
import { StartOrderConfirmDialog } from "@/feature/private/order-management/components/start-order-confirm-dialog";
import {
  getOrderReference,
  maskOrderReference,
} from "@/feature/private/order-management/utils/mask-order-reference";

export function EmployeeOrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrder(id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const { mutateAsync: startOrder, isPending: starting } = useStartOrder();
  const { mutateAsync: markCompleted, isPending: completing } = useMarkOrderCompleted();

  if (isLoading) return <OrderDetailSkeleton />;
  if (!order) return <OrderNotFound onBack={() => router.back()} />;

  const pending = isPendingOrder(order);
  const processing = isProcessingOrder(order);
  const pickedUp = order.orderStatus === ORDER_STATUS.COMPLETED;
  const closed = order.orderStatus === ORDER_STATUS.CLOSED;
  const abandoned = closed && order.finalStatus === FINAL_STATUS.ABANDONED;
  const handlerName = order.startedByName || order.assignedEmployeeName;
  const itemCount =
    order.items?.reduce((s, i) => s + (i.quantity || 0), 0) || order.items?.length || 0;
  const orderRef = getOrderReference(order);
  const customerName = order.recieverName || order.userName || "the customer";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <PageHeader
            title={`Order #${maskOrderReference(orderRef)}`}
            description={
              pending
                ? "Paid and waiting to be started."
                : processing
                  ? "You are preparing this order."
                  : pickedUp
                    ? "Picked Up — Close with customer reference when collected."
                    : abandoned
                      ? "This order was abandoned."
                      : "Order details"
            }
          />
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge
              status={order.orderStatus}
              assignedEmployeeId={order.assignedEmployeeId}
              finalStatus={order.finalStatus}
              showFinal={closed}
            />
            {pickedUp && <OrderWaitingBadge label="Awaiting Close" />}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-xs font-medium"
        >
          <ArrowLeft className="size-3.5" /> Back to My Orders
        </Button>
      </div>

      {pending && (
        <OrderInfoBanner
          variant="employee-start"
          message="Start this order to claim it. Status becomes Processing and other employees cannot start it."
        />
      )}
      {processing && handlerName && (
        <OrderInfoBanner
          variant="processing"
          message={`In Processing · ${handlerName}${
            order.startedAt ? ` · ${formatRelativeTime(order.startedAt)}` : ""
          }`}
        />
      )}

      <OrderAbandonRemarkCard order={order} />
      <OrderProgressTimeline order={order} />

      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <OrderSummaryCard order={order} hideQrCode maskReference />
          <EmployeeOrderFinancials order={order} />
          <OrderPeopleAndStore order={order} />
          <OrderItemsTable items={order.items ?? []} onImageClick={setLightboxImage} hideQrCode />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
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
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {handlerName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Started {formatRelativeTime(order.startedAt || order.assignedAt) || "—"}
                  </p>
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

          <div className="space-y-3">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Actions</p>
            {pending && (
              <OrderLifecycleActionCard
                variant="start"
                title="Start Order"
                description="Claim this order and move it to Processing."
                loading={starting}
                onClick={() => setStartOpen(true)}
              />
            )}
            {processing && (
              <OrderLifecycleActionCard
                variant="complete"
                title="Mark as Completed"
                description="Finishes prep and auto-moves to Picked Up."
                loading={completing}
                onClick={async () => {
                  try {
                    await markCompleted(order.id);
                  } catch {}
                }}
              />
            )}
            {pickedUp && (
              <OrderLifecycleActionCard
                variant="close"
                title="Close Order"
                description="Customer collected — enter the full reference ID."
                onClick={() => setCloseOpen(true)}
              />
            )}
            {pickedUp && (
              <OrderLifecycleActionsHint>
                You can only Close. Store admin abandons with a remark if nobody collects.
              </OrderLifecycleActionsHint>
            )}
          </div>
        </aside>
      </div>

      <CompleteOrderByReferenceDialog
        orderId={order.id}
        open={closeOpen}
        onOpenChange={setCloseOpen}
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

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
