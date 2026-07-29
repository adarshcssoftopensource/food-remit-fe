"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { clearAuthSession } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";

export function LogoutButton() {
  const router = useRouter();
  const { mutateAsync, isPending } = useApiMutation("post", AUTH_ENDPOINTS.LOGOUT);

  const handleLogout = async () => {
    try {
      await mutateAsync({});
    } catch {
    } finally {
      clearAuthSession();
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    }
  };

  return (
    <Button
      onClick={handleLogout}
      isLoading={isPending}
      className="flex items-center gap-2"
      variant={"destructive"}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
