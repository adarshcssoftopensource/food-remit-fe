"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/components/providers/profile-provider";
import { ArrowLeft, CheckCircle2, Loader2, PackageCheck, Undo2 } from "lucide-react";
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
import {
  useMarkOrderAbandoned,
  useMarkOrderCompleted,
  useStartOrder,
} from "./hooks/use-order-lifecycle";
import {
  formatRelativeTime,
  isPendingOrder,
  isProcessingOrder,
  ORDER_STATUS,
} from "./utils/order-workflow";
import { CompleteOrderByReferenceDialog } from "@/feature/private/my-orders/components/complete-order-by-reference-dialog";
import { getOrderReference } from "./utils/mask-order-reference";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { getInitials } from "@/lib/get-initials";
import { getOrderActorRole } from "./utils/order-roles";
import { StartOrderConfirmDialog } from "./components/start-order-confirm-dialog";

export function OrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { profile } = useProfile();
  const { data: order, isLoading } = useGetOrder(id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [pickupOpen, setPickupOpen] = useState(false);
  const [abandonOpen, setAbandonOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);

  const { mutateAsync: startOrder, isPending: starting } = useStartOrder();
  const { mutateAsync: markCompleted, isPending: completing } = useMarkOrderCompleted();
  const { mutateAsync: markAbandoned, isPending: abandoning } = useMarkOrderAbandoned();

  const { canAbandon, canMarkPickedUp, isEmployee, canAssign } = getOrderActorRole(profile);

  if (isLoading) return <OrderDetailSkeleton />;
  if (!order) return <OrderNotFound onBack={() => router.back()} />;

  const pending = isPendingOrder(order);
  const processing = isProcessingOrder(order);
  const completed = order.orderStatus === ORDER_STATUS.COMPLETED;
  const handlerName = order.startedByName || order.assignedEmployeeName;
  const orderRef = order.refrenceNumber || order.id.substring(0, 8).toUpperCase();
  const customerName = order.recieverName || order.userName || "the customer";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs text-slate-500">
            Orders / All Orders / #{order.refrenceNumber || order.id.substring(0, 8).toUpperCase()}
          </p>
          <PageHeader
            title="Order Details"
            description={
              processing
                ? "This order is currently being processed."
                : "View order information and items."
            }
          />
          <OrderStatusBadge
            status={order.orderStatus}
            assignedEmployeeId={order.assignedEmployeeId}
            finalStatus={order.finalStatus}
          />
        </div>
        <Button variant="outline" onClick={() => router.back()} className="rounded-full shadow-sm">
          <ArrowLeft className="mr-2 size-4" /> Back to Orders
        </Button>
      </div>

      {processing && handlerName && (
        <OrderInfoBanner
          variant="processing"
          message={`This order is in Processing state. It was started by ${handlerName}${
            order.startedAt ? ` on ${new Date(order.startedAt).toLocaleString()}` : ""
          }. Start Order can no longer be clicked once an order is Processing.`}
        />
      )}

      <OrderProgressTimeline order={order} />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <OrderSummaryCard order={order} />
          <OrderFinancials order={order} />
          <OrderPeopleAndStore order={order} />
          <OrderItemsTable items={order.items ?? []} onImageClick={setLightboxImage} />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Order Ownership
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
                  <p className="text-sm font-medium">{handlerName}</p>
                  <p className="text-xs text-slate-500">
                    Started {formatRelativeTime(order.startedAt || order.assignedAt) || "—"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Not yet started or assigned.</p>
            )}
            {processing && (
              <p className="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
                Start Order is locked while this order is in Processing.
              </p>
            )}
          </div>

          <div className="space-y-2">
            {pending && isEmployee && (
              <Button
                className="w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                disabled={starting}
                onClick={() => setStartOpen(true)}
              >
                {starting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Start Order
              </Button>
            )}

            {pending && !isEmployee && canAssign && (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                Managers assign orders to employees. Use Assign from the orders list (or ⋮ menu).
              </p>
            )}

            {processing && (
              <Button
                className="w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
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
                <span className="mt-0.5 block w-full text-[10px] font-normal opacity-90">
                  All items are ready for pickup
                </span>
              </Button>
            )}

            {completed && (canMarkPickedUp || canAbandon) && (
              <>
                {canMarkPickedUp && (
                  <Button
                    className="w-full rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                    onClick={() => setPickupOpen(true)}
                  >
                    <PackageCheck className="mr-2 size-4" />
                    Mark as Picked Up
                  </Button>
                )}
                {canAbandon && (
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => setAbandonOpen(true)}
                  >
                    <Undo2 className="mr-2 size-4" />
                    Mark as Abandoned
                  </Button>
                )}
              </>
            )}
          </div>
        </aside>
      </div>

      <CompleteOrderByReferenceDialog
        orderId={order.id}
        open={pickupOpen}
        onOpenChange={setPickupOpen}
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

      <ConfirmationDialog
        open={abandonOpen}
        onOpenChange={setAbandonOpen}
        title="Mark as Abandoned"
        description="This will close the order as Abandoned (not collected). Only store managers can do this. Continue?"
        confirmLabel="Abandon Order"
        variant="destructive"
        isLoading={abandoning}
        onConfirm={async () => {
          try {
            await markAbandoned({ orderId: order.id });
            setAbandonOpen(false);
          } catch {}
        }}
      />

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
