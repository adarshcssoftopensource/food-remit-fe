import { CreateItemPage } from "@/feature/private/(super-admin)/catalogue-management/items/components/editor/item-editor-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Item | Catalogue Management",
};

export default async function NewCategoryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CreateItemPage categoryId={id} />;
}
