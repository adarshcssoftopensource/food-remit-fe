"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { clearAuthSession } from "@/lib/authClient";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const handleLogout = () => {
    clearAuthSession();
    router.push(ROUTES.AUTH.LOGIN);
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
