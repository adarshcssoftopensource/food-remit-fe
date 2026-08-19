"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdateUserStatus } from "../hooks/use-update-user-status";
import { UserData } from "../types/user.types";

export function ActionsCell({ user }: { user: UserData }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(user.userStatus === "ACTIVE");
  const updateUserStatus = useUpdateUserStatus(user.id);

  const handleStatusChange = (checked: boolean) => {
    setIsActive(checked);
    updateUserStatus.mutate(
      { status: checked ? "ACTIVE" : "INACTIVE" },
      {
        onSuccess: () => {
          toast.success(`User status has been updated to ${checked ? "ACTIVE" : "INACTIVE"}`);
        },
        onError: () => {
          setIsActive(!checked);
          toast.error("Failed to update user status");
        },
      },
    );
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-colors"
          onClick={() => router.push(`${ROUTES.ADMIN.USERS_MANAGEMENT}/${user.id}`)}
          title="View user details"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Switch
          checked={isActive}
          onCheckedChange={handleStatusChange}
          disabled={updateUserStatus.isPending}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
    </>
  );
}
