import { EditItemPage } from "@/feature/private/(super-admin)/catalogue-management/items/item-editor-pages";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Item | Catalogue Management",
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function EditCatalogueItemPage({ params, searchParams }: PageProps) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);
  return <EditItemPage itemId={id} from={from} />;
}
