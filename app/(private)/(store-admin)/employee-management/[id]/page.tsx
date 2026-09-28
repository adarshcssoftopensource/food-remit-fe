import { EmployeeViewPage } from "@/feature/private/(store-admin)/employee-management/employee-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeView({ params }: PageProps) {
  const { id } = await params;
  return <EmployeeViewPage id={id} />;
}
