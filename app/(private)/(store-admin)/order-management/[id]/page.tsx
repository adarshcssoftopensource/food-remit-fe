import { OrderDetailPage } from "@/feature/private/(store-admin)/order-management/order-detail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderManagementDetail({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailPage id={id} />;
}
