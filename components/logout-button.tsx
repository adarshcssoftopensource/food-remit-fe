"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useApiMutation } from "@/hooks/useApi";
import { AUTH_ENDPOINTS } from "@/lib/api/endpoints/auth.endpoints";
import { clearAuthSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { successToast } from "./toaster";

type LogoutButtonProps = {
  showConfirmation?: boolean;
};

export function LogoutButton({ showConfirmation = false }: LogoutButtonProps) {
  const router = useRouter();
  const { mutateAsync, isPending } = useApiMutation("post", AUTH_ENDPOINTS.LOGOUT);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogout = async () => {
    setIsConfirmOpen(false);
    try {
      await mutateAsync({});
      clearAuthSession();
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
      successToast({
        description: "Session logout successfully",
      });
    } catch {}
  };

  return (
    <>
      <Button
        onClick={showConfirmation ? () => setIsConfirmOpen(true) : handleLogout}
        isLoading={isPending}
        className={`flex justify-start text-start ${!showConfirmation ? "flex w-full justify-center text-center" : ""}`}
        variant={showConfirmation ? "ghost" : "default"}
      >
        <div
          className={cn(
            "",
            showConfirmation && "flex h-8 w-8 items-center justify-center rounded-lg bg-red-100",
          )}
        >
          <LogOut className={cn("", showConfirmation && "h-4 w-4 text-red-500")} />
        </div>
        Logout
      </Button>

      {showConfirmation && (
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
      )}
    </>
  );
}
