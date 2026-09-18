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
import { MaskedReferenceBadge } from "@/feature/private/order-management/components/masked-reference-badge";
import { getOrderReference } from "@/feature/private/order-management/utils/mask-order-reference";
import { ArrowLeft, Clock3, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompleteOrderByReferenceDialog } from "./components/complete-order-by-reference-dialog";
import { EmployeeOrderFinancials } from "./components/employee-order-financials";
import { PrepareOrderDialog } from "./components/prepare-order-dialog";

export function EmployeeOrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrder(id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  if (isLoading) return <OrderDetailSkeleton />;
  if (!order) return <OrderNotFound onBack={() => router.back()} />;

  const fullRef = getOrderReference(order);
  const canStartPreparing =
    order.orderStatus === 4 || order.orderStatus === 5 || order.orderStatus === 8;
  const canMarkComplete = order.orderStatus === 2;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <PageHeader title="Order Details" />
          <div className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={order.orderStatus} />
            <MaskedReferenceBadge reference={fullRef} size="md" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canStartPreparing && (
            <>
              <Button
                onClick={() => setPrepareOpen(true)}
                variant={"secondary"}
                className="rounded-xl bg-amber-600 font-semibold text-white shadow-sm hover:bg-amber-700"
              >
                <Clock3 className="mr-2 size-4" />
                Mark as Preparing
              </Button>
              <PrepareOrderDialog
                orderId={order.id}
                open={prepareOpen}
                onOpenChange={setPrepareOpen}
              />
            </>
          )}

          {canMarkComplete && (
            <>
              <Button
                onClick={() => setCompleteOpen(true)}
                className="rounded-xl bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                <ShieldCheck className="mr-2 size-4" />
                Mark as Complete
              </Button>
              <CompleteOrderByReferenceDialog
                orderId={order.id}
                open={completeOpen}
                onOpenChange={setCompleteOpen}
                maskedHint={fullRef}
              />
            </>
          )}

          <Button variant="outline" onClick={() => router.back()} className="rounded-xl shadow-sm">
            <ArrowLeft className="mr-2 size-4" />
            Back to My Orders
          </Button>
        </div>
      </div>

      <OrderSummaryCard order={order} hideQrCode maskReference />

      <EmployeeOrderFinancials order={order} />

      <OrderPeopleAndStore order={order} />

      <OrderItemsTable items={order.items ?? []} onImageClick={setLightboxImage} hideQrCode />

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
