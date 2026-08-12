import { CategoryView } from "@/feature/private/catalogue-management/categories/view";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryViewPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CategoryView id={resolvedParams.id} />;
}
