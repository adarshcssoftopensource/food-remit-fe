import { UserDetailView } from "@/feature/private/users-management/components/user-detail-view";
import { normalizeUser } from "@/feature/private/users-management/lib/normalize-user";
import type { UserData } from "@/feature/private/users-management/types/user.types";
import { USER_MANAGEMENT_ENDPOINTS } from "@/lib/api/endpoints/user-management.endpoints";
import { notFound } from "next/navigation";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const response = await fetch(USER_MANAGEMENT_ENDPOINTS.GET_USERS, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const api = await response.json();
  const users = (api.data || []).map((item: any) => normalizeUser(item));
  const user = users.find((u: UserData) => u.id === id);

  if (!user) {
    notFound();
  }

  return <UserDetailView user={user} />;
}
