"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetOrder } from "@/feature/private/order-management/hooks/use-get-order";
import { OrderDetailSkeleton } from "@/feature/private/order-management/components/order-detail-skeleton";
import { PrepareOrderDialog } from "./components/prepare-order-dialog";
import { CheckCircle2, Clock } from "lucide-react";
import { OrderNotFound } from "@/feature/private/order-management/components/order-not-found";
import { OrderSummaryCard } from "@/feature/private/order-management/components/order-summary-card";
import { OrderPeopleAndStore } from "@/feature/private/order-management/components/order-people-and-store";
import { OrderItemsTable } from "@/feature/private/order-management/components/order-items-table";
import { EmployeeOrderFinancials } from "./components/employee-order-financials";

export function EmployeeOrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrder(id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isPrepareDialogOpen, setIsPrepareDialogOpen] = useState(false);

  if (isLoading) return <OrderDetailSkeleton />;
  if (!order) return <OrderNotFound onBack={() => router.back()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Order Details"
          description={`Viewing order #...${(order.refrenceNumber || order.id).slice(-4)}`}
        />
        <div className="flex items-center gap-3">
          {(order.orderStatus === 4 || order.orderStatus === 5 || order.orderStatus === 8) && (
            <>
              <Button
                onClick={() => setIsPrepareDialogOpen(true)}
                className="rounded-full bg-amber-600 font-semibold text-white shadow-sm hover:bg-amber-700"
              >
                <Clock className="mr-2 size-4" /> Preparing Order
              </Button>
              <PrepareOrderDialog
                orderId={order.id}
                open={isPrepareDialogOpen}
                onOpenChange={setIsPrepareDialogOpen}
              />
            </>
          )}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-full shadow-sm"
          >
            <ArrowLeft className="mr-2 size-4" /> Back to My Orders
          </Button>
        </div>
      </div>

      <OrderSummaryCard order={order} hideQrCode={true} maskReference={true} />

      <EmployeeOrderFinancials order={order} />

      <OrderPeopleAndStore order={order} />

      <OrderItemsTable
        items={order.items ?? []}
        onImageClick={setLightboxImage}
        hideQrCode={true}
      />

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
