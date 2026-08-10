"use client";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  const deleteUser = useDeleteUser();

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

  const handleDelete = () => {
    deleteUser.mutate(
      { userId: user.id },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          toast.success("User has been deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete user");
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
          onClick={() => router.push(`/users-management/${user.id}`)}
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
        {user.userStatus === "INACTIVE" && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg text-red-500 transition-colors hover:bg-red-50"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={deleteUser.isPending}
            title="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete ${user?.firstName} ${user?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete User"
        onConfirm={handleDelete}
        isLoading={deleteUser.isPending}
      />
    </>
  );
}
