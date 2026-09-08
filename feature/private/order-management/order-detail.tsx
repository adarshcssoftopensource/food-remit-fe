"use client";

import { ImageLightbox } from "@/components/common/image-lightbox";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
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

export function OrderDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { data: order, isLoading } = useGetOrder(id);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (isLoading) return <OrderDetailSkeleton />;
  if (!order) return <OrderNotFound onBack={() => router.back()} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Order Details"
          description={`Viewing comprehensive order #${order.refrenceNumber || order.id}`}
        />
        <Button variant="outline" onClick={() => router.back()} className="rounded-full shadow-sm">
          <ArrowLeft className="mr-2 size-4" /> Back to Orders
        </Button>
      </div>

      <OrderSummaryCard order={order} />
      <OrderFinancials order={order} />

      <OrderPeopleAndStore order={order} />

      <OrderItemsTable items={order.items ?? []} onImageClick={setLightboxImage} />

      <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  );
}
