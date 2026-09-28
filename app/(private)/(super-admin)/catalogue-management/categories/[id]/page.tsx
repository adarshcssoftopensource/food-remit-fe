import { CategoryView } from "@/feature/private/(super-admin)/catalogue-management/categories/view";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryViewPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CategoryView id={resolvedParams.id} />;
}
