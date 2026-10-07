"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useGetOrder } from "@/feature/private/(store-admin)/order-management/hooks/use-get-order";
import { OrderDetailSkeleton } from "@/feature/private/(store-admin)/order-management/components/details/order-detail-skeleton";
import { OrderNotFound } from "@/feature/private/(store-admin)/order-management/components/details/order-not-found";
import { OrderSummaryCard } from "@/feature/private/(store-admin)/order-management/components/details/order-summary-card";
import { OrderPeopleAndStore } from "@/feature/private/(store-admin)/order-management/components/details/order-people-and-store";
import { OrderItemsTable } from "@/feature/private/(store-admin)/order-management/components/details/order-items-table";
import { OrderStatusBadge } from "@/feature/private/(store-admin)/order-management/components/shared/order-status-badge";
import { OrderProgressTimeline } from "@/feature/private/(store-admin)/order-management/components/details/order-progress-timeline";
import { OrderAbandonRemarkCard } from "@/feature/private/(store-admin)/order-management/components/details/order-abandon-remark-card";
import { OrderWaitingBadge } from "@/feature/private/(store-admin)/order-management/components/details/order-lifecycle-actions";
import {
  useMarkOrderCompleted,
  useStartOrder,
} from "@/feature/private/(store-admin)/order-management/hooks/use-order-lifecycle";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompleteOrderByReferenceDialog } from "./components/complete-order-by-reference-dialog";
import {
  EmployeeOrderActions,
  EmployeeOrderBanners,
  EmployeeOrderOwnershipCard,
} from "./components/employee-order-detail-sections";
import {
  getEmployeeOrderDescription,
  getEmployeeOrderState,
} from "./components/employee-order-state";
import { EmployeeOrderFinancials } from "./components/employee-order-financials";
import { StartOrderConfirmDialog } from "@/feature/private/(store-admin)/order-management/components/dialogs/start-order-confirm-dialog";
import { maskOrderReference } from "@/feature/private/(store-admin)/order-management/utils/mask-order-reference";

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

  const state = getEmployeeOrderState(order);
  const { assigned, pickedUp, closed, handlerName, itemCount, orderRef, customerName } = state;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <PageHeader
            title={`Order #${maskOrderReference(orderRef)}`}
            description={getEmployeeOrderDescription(state)}
          />
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge
              status={order.orderStatus}
              assignedEmployeeId={order.assignedEmployeeId}
              startedById={order.startedById}
              finalStatus={order.finalStatus}
              showFinal={closed}
            />
            {assigned && <OrderWaitingBadge label="Awaiting Start" />}
            {pickedUp && <OrderWaitingBadge label="Awaiting Pickup" />}
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

      <EmployeeOrderBanners order={order} state={state} />

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
          <EmployeeOrderOwnershipCard
            order={order}
            handlerName={handlerName}
            itemCount={itemCount}
          />

          <EmployeeOrderActions
            state={state}
            starting={starting}
            completing={completing}
            onStartClick={() => setStartOpen(true)}
            onMarkCompleted={async () => {
              try {
                await markCompleted(order.id);
              } catch {}
            }}
            onCloseClick={() => setCloseOpen(true)}
          />
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
