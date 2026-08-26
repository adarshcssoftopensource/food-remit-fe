"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteUser } from "../hooks/use-delete-user";
import { useUpdateUserStatus } from "../hooks/use-update-user-status";
import { UserData } from "../types/user.types";

export function ActionsCell({ user }: { user: UserData }) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(user.userStatus === "ACTIVE");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const updateUserStatus = useUpdateUserStatus(user.id);
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser(user.id);

  const displayName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.userName ||
    user.email ||
    "this user";

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

  const handleDelete = async () => {
    try {
      await deleteUser();
      setIsDeleteDialogOpen(false);
      toast.success(`"${displayName}" has been moved to the Recycle Bin.`);
    } catch {
      toast.error(`Failed to delete "${displayName}".`);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500"
          onClick={() => router.push(`${ROUTES.ADMIN.USERS_MANAGEMENT}/${user.id}`)}
          title="View user details"
        >
          <Eye className="size-4" />
        </Button>

        <Switch
          checked={isActive}
          title={isActive ? "Active" : "Inactive"}
          onCheckedChange={handleStatusChange}
          disabled={updateUserStatus.isPending || isDeleting}
          className="data-[state=checked]:bg-green-500"
        />

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeleting || updateUserStatus.isPending}
          title="Delete user"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete "${displayName}"? This will move the user to the Recycle Bin where it can later be restored or permanently removed.`}
        confirmLabel="Move to Recycle Bin"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
