import { ItemView } from "@/feature/private/(super-admin)/catalogue-management/items/view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Item Details | Catalogue Management",
};

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ItemView id={id} />;
}
