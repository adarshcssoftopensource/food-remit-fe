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
import {
  useMarkOrderCompleted,
  useStartOrder,
} from "@/feature/private/order-management/hooks/use-order-lifecycle";
import {
  formatRelativeTime,
  isPendingOrder,
  isProcessingOrder,
  ORDER_STATUS,
} from "@/feature/private/order-management/utils/order-workflow";
import { getInitials } from "@/lib/get-initials";
import { ArrowLeft, CheckCircle2, Loader2, PackageCheck } from "lucide-react";
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
  const [pickupOpen, setPickupOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const { mutateAsync: startOrder, isPending: starting } = useStartOrder();
  const { mutateAsync: markCompleted, isPending: completing } = useMarkOrderCompleted();

  if (isLoading) return <OrderDetailSkeleton />;
  if (!order) return <OrderNotFound onBack={() => router.back()} />;

  const pending = isPendingOrder(order);
  const processing = isProcessingOrder(order);
  const completed = order.orderStatus === ORDER_STATUS.COMPLETED;
  const handlerName = order.startedByName || order.assignedEmployeeName;
  const itemCount =
    order.items?.reduce((s, i) => s + (i.quantity || 0), 0) || order.items?.length || 0;
  const orderRef = getOrderReference(order);
  const customerName = order.recieverName || order.userName || "the customer";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs font-medium"
          >
            <ArrowLeft className="size-3.5" /> Back to My Orders
          </Button>
          <PageHeader
            title={`Order #${maskOrderReference(orderRef)}`}
            description={
              pending
                ? "This order is paid and waiting to be started."
                : processing
                  ? "You are preparing this order."
                  : completed
                    ? "Ready for customer pickup."
                    : "Order details"
            }
          />
          <OrderStatusBadge
            status={order.orderStatus}
            assignedEmployeeId={order.assignedEmployeeId}
            finalStatus={order.finalStatus}
          />
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
          {pending && (
            <Button
              className="h-11 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              disabled={starting}
              onClick={() => setStartOpen(true)}
            >
              {starting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Start Order
            </Button>
          )}
          {processing && (
            <Button
              className="h-11 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              disabled={completing}
              onClick={async () => {
                try {
                  await markCompleted(order.id);
                } catch {}
              }}
            >
              {completing ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 size-4" />
              )}
              Mark as Completed
            </Button>
          )}
          {completed && (
            <Button
              className="h-11 rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
              onClick={() => setPickupOpen(true)}
            >
              <PackageCheck className="mr-2 size-4" />
              Mark as Picked Up
            </Button>
          )}
        </div>
      </div>

      {pending && (
        <OrderInfoBanner
          variant="employee-start"
          message="Start this order to claim it. Your name will be recorded and status becomes Processing. Other employees will not be able to start it."
        />
      )}
      {processing && handlerName && (
        <OrderInfoBanner
          variant="processing"
          message={`In Processing · started by ${handlerName}${
            order.startedAt ? ` (${formatRelativeTime(order.startedAt)})` : ""
          }. Start Order is locked for others.`}
        />
      )}
      {completed && (
        <OrderInfoBanner
          variant="employee-start"
          message="Order is ready for pickup. Verify the customer's reference to mark Picked Up — it will close and move to History."
        />
      )}

      <OrderProgressTimeline order={order} />

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <OrderSummaryCard order={order} hideQrCode maskReference />
          <EmployeeOrderFinancials order={order} />
          <OrderPeopleAndStore order={order} />
          <OrderItemsTable items={order.items ?? []} onImageClick={setLightboxImage} hideQrCode />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-emerald-50/80 to-white p-4 dark:border-slate-800 dark:from-emerald-950/20 dark:to-slate-900">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Order Ownership
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

          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
            Employees cannot abandon orders. If a customer never picks up, a store manager must mark
            it Abandoned.
          </p>
        </aside>
      </div>

      <CompleteOrderByReferenceDialog
        orderId={order.id}
        open={pickupOpen}
        onOpenChange={setPickupOpen}
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
