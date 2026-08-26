"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { RecycleEntityType } from "../hooks/use-get-recycled-data";
import { usePermanentDeleteEntity, useRestoreEntity } from "../hooks/use-recycle-bin-actions";

interface RecycledEntityActionsCellProps {
  entityType: RecycleEntityType;
  entity: any;
  entityNameField?: string;
}

export function RecycledEntityActionsCell({
  entityType,
  entity,
  entityNameField,
}: RecycledEntityActionsCellProps) {
  const [isPermanentDeleteDialogOpen, setIsPermanentDeleteDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  const restoreMutation = useRestoreEntity(entityType, entity.id);
  const permanentDeleteMutation = usePermanentDeleteEntity(entityType, entity.id);

  const displayName =
    (entityNameField && entity[entityNameField]) ||
    entity.storeName ||
    entity.productName ||
    entity.departmentName ||
    entity.categoryName ||
    `${entity.firstName || ""} ${entity.lastName || ""}`.trim() ||
    entity.userName ||
    entity.email ||
    "this item";

  const handleRestore = () => {
    restoreMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(`"${displayName}" has been restored successfully.`);
        setIsRestoreDialogOpen(false);
      },
      onError: () => {
        toast.error(`Failed to restore "${displayName}".`);
      },
    });
  };

  const handlePermanentDelete = () => {
    permanentDeleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(`"${displayName}" has been permanently deleted.`);
        setIsPermanentDeleteDialogOpen(false);
      },
      onError: () => {
        toast.error(`Failed to permanently delete "${displayName}".`);
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30"
          onClick={() => setIsRestoreDialogOpen(true)}
          disabled={restoreMutation.isPending || permanentDeleteMutation.isPending}
          title="Restore item"
        >
          <RotateCcw className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
          onClick={() => setIsPermanentDeleteDialogOpen(true)}
          disabled={restoreMutation.isPending || permanentDeleteMutation.isPending}
          title="Permanently delete item"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <ConfirmationDialog
        open={isRestoreDialogOpen}
        onOpenChange={setIsRestoreDialogOpen}
        title="Restore Item"
        description={`Are you sure you want to restore "${displayName}"? It will be restored back to the system.`}
        confirmLabel="Restore Item"
        variant="default"
        onConfirm={handleRestore}
        isLoading={restoreMutation.isPending}
      />

      <ConfirmationDialog
        open={isPermanentDeleteDialogOpen}
        onOpenChange={setIsPermanentDeleteDialogOpen}
        title="Permanently Delete Item"
        description={`Are you sure you want to permanently delete "${displayName}"? All associated data will be erased forever. This action cannot be undone.`}
        confirmLabel="Delete Permanently"
        variant="destructive"
        onConfirm={handlePermanentDelete}
        isLoading={permanentDeleteMutation.isPending}
      />
    </>
  );
}
