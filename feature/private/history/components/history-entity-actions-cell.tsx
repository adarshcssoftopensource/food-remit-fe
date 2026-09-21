"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { HistoryEntityType } from "../hooks/use-get-history-data";
import { usePermanentDeleteFromHistory } from "../hooks/use-history-actions";

interface HistoryEntityActionsCellProps {
  entityType: HistoryEntityType;
  entity: any;
  entityNameField?: string;
}

export function HistoryEntityActionsCell({
  entityType,
  entity,
  entityNameField,
}: HistoryEntityActionsCellProps) {
  const [isPermanentDeleteDialogOpen, setIsPermanentDeleteDialogOpen] = useState(false);

  const permanentDeleteMutation = usePermanentDeleteFromHistory(entityType, entity.id);

  const displayName =
    (entityNameField && entity[entityNameField]) ||
    entity.businessName ||
    entity.storeName ||
    `${entity.firstName || ""} ${entity.lastName || ""}`.trim() ||
    "this item";

  const handlePermanentDelete = () => {
    permanentDeleteMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(`"${displayName}" has been permanently erased.`);
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
          className="size-8 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
          onClick={() => setIsPermanentDeleteDialogOpen(true)}
          disabled={permanentDeleteMutation.isPending}
          title="Permanently delete item"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

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
