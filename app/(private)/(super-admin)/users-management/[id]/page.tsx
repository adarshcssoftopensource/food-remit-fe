import { UserDetailView } from "@/feature/private/(super-admin)/users-management/components/user-detail-view";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;

  return <UserDetailView id={id} />;
}
