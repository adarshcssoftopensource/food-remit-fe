"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import { clearAuthSession } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { successToast } from "./toaster";

export function LogoutButton() {
  const router = useRouter();
  const { mutateAsync, isPending } = useApiMutation("post", AUTH_ENDPOINTS.LOGOUT);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogout = async () => {
    setIsConfirmOpen(false);
    try {
      await mutateAsync({});
      successToast({
        title: "",
        description: "Session logout successfully",
      });
    } catch {
    } finally {
      clearAuthSession();
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsConfirmOpen(true)}
        isLoading={isPending}
        className="flex justify-start text-start"
        variant={"ghost"}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
          <LogOut className="h-4 w-4 text-red-500" />
        </div>
        Logout
      </Button>

      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="Confirm Logout"
        description="Are you sure you want to logout from this device? You will need to sign in again to access your account."
        confirmLabel="Yes, Logout"
        cancelLabel="Stay Logged In"
        onConfirm={handleLogout}
        isLoading={isPending}
        variant="destructive"
        icon={<LogOut className="h-5 w-5" />}
      />
    </>
  );
}
