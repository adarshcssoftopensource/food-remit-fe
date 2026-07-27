import { notFound } from "next/navigation";
import { MOCK_USERS_DATA } from "@/constants/users-management";
import { UserDetailView } from "@/feature/private/users-management/components/user-detail-view";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const user = MOCK_USERS_DATA.find((u) => u.id === id);

  if (!user) {
    notFound();
  }

  return <UserDetailView user={user} />;
}
