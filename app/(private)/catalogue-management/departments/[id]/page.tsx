import { DepartmentView } from "@/feature/private/catalogue-management/departments/view";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DepartmentViewPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <DepartmentView id={resolvedParams.id} />;
}
