"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePermanentDeleteUser } from "../../users-management/hooks/use-permanent-delete-user";
import { useRestoreUser } from "../../users-management/hooks/use-restore-user";
import { UserData } from "../../users-management/types/user.types";

export function RecycledActionsCell({ user }: { user: UserData }) {
  const [isPermanentDeleteDialogOpen, setIsPermanentDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const restoreUser = useRestoreUser();
  const { mutateAsync: permanentDelete, isPending: isDeleting } = usePermanentDeleteUser(user.id);

  const displayName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.userName ||
    user.email ||
    "this user";

  const handleRestore = () => {
    restoreUser.mutate(
      { id: user.id },
      {
        onSuccess: () => {
          toast.success(`"${displayName}" has been restored successfully.`);
          setIsRestoreDialogOpen(false);
        },
        onError: () => {
          toast.error(`Failed to restore "${displayName}".`);
        },
      },
    );
  };

  const handlePermanentDelete = async () => {
    try {
      await permanentDelete();
      setIsPermanentDeleteDialogOpen(false);
      toast.success(`"${displayName}" has been permanently deleted.`);
    } catch {
      toast.error(`Failed to permanently delete "${displayName}".`);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
          onClick={() => setIsRestoreDialogOpen(true)}
          disabled={restoreUser.isPending || isDeleting}
          title="Restore user"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
          onClick={() => setIsPermanentDeleteDialogOpen(true)}
          disabled={restoreUser.isPending || isDeleting}
          title="Permanently delete user"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ConfirmationDialog
        open={isRestoreDialogOpen}
        onOpenChange={setIsRestoreDialogOpen}
        title="Restore User"
        description={`Are you sure you want to restore "${displayName}"? This user will be active in the system again.`}
        confirmLabel="Restore User"
        variant="default"
        onConfirm={handleRestore}
        isLoading={restoreUser.isPending}
      />

      <ConfirmationDialog
        open={isPermanentDeleteDialogOpen}
        onOpenChange={setIsPermanentDeleteDialogOpen}
        title="Permanently Delete User"
        description={`Are you sure you want to permanently delete "${displayName}"? All associated data will be erased forever. This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        variant="destructive"
        onConfirm={handlePermanentDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
