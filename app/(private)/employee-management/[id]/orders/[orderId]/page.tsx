import { OrderDetailPage } from "@/feature/private/order-management/order-detail";

interface PageProps {
  params: Promise<{
    id: string;
    orderId: string;
  }>;
}

export default async function EmployeeOrderDetail({ params }: PageProps) {
  const { orderId } = await params;
  return <OrderDetailPage id={orderId} />;
}
