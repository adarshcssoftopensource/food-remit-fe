"use client";

import { use } from "react";
import { ItemTransactionsPage } from "@/feature/private/report-management/components/item-transactions-page";

type ItemTransactionsRouteProps = {
  params: Promise<{
    id: string;
    itemId: string;
  }>;
};

export default function ItemTransactionsRoute({ params }: ItemTransactionsRouteProps) {
  const { id: storeId, itemId } = use(params);

  return <ItemTransactionsPage storeId={storeId} itemId={itemId} />;
}
