import { Suspense } from "react";
import { OrdersManagementPage } from "@/feature/private/order-management";

export default function OrderManagementRootPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Loading orders...</div>}>
      <OrdersManagementPage />
    </Suspense>
  );
}
