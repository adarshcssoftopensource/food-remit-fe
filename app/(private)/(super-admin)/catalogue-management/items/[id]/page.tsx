import { ItemView } from "@/feature/private/(super-admin)/catalogue-management/items/view";
import { ItemViewSkeleton } from "@/feature/private/(super-admin)/catalogue-management/items/components/details/item-view-skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Item Details | Catalogue Management",
};

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<ItemViewSkeleton />}>
      <ItemView id={id} />
    </Suspense>
  );
}
