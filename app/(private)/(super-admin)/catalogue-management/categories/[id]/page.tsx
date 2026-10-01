import { CategoryItemsWorkspace } from "@/feature/private/(super-admin)/catalogue-management/categories/workspace";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryItemsWorkspacePage({ params }: PageProps) {
  const { id } = await params;
  return <CategoryItemsWorkspace key={id} id={id} />;
}
