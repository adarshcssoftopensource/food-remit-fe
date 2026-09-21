"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteUser } from "../hooks/use-delete-user";
import { useUpdateUserStatus } from "../hooks/use-update-user-status";
import { UserData } from "../types/user.types";
import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

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

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Details",
      icon: <Eye className="size-4" />,
      onClick: () => router.push(`${ROUTES.ADMIN.USERS_MANAGEMENT}/${user.id}`),
    },
    {
      label: "Delete User",
      icon: <Trash2 className="size-4" />,
      onClick: () => setIsDeleteDialogOpen(true),
      variant: "destructive",
      disabled: isDeleting || updateUserStatus.isPending,
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={isActive}
          title={isActive ? "Active" : "Inactive"}
          onCheckedChange={handleStatusChange}
          disabled={updateUserStatus.isPending || isDeleting}
          className="data-[state=checked]:bg-green-500"
        />

        <DataTableRowActions items={actionItems} />
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
