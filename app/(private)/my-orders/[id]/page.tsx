import { EmployeeOrderDetailPage } from "@/feature/private/my-orders/employee-order-detail";

export default async function MyOrderDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmployeeOrderDetailPage id={id} />;
}
