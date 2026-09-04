"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { errorToast, successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteItem } from "../hooks/use-delete-item";
import { useUpdateItemStatus } from "../hooks/use-update-item-status";
import { ItemData } from "../types/item.types";

interface ItemActionsCellProps {
  item: ItemData;
  onEdit: (item: ItemData) => void;
  onView: (item: ItemData) => void;
}

export function ItemActionsCell({ item, onEdit, onView }: ItemActionsCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem(item.id);

  const handleDelete = async () => {
    try {
      const response = await deleteItem();
      setDeleteOpen(false);
      successToast({
        title: "Item Deleted",
        description: response?.message || "Item has been deleted successfully.",
      });
    } catch {}
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500"
        onClick={() => onView(item)}
        title="View item"
      >
        <Eye className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500"
        onClick={() => onEdit(item)}
        title="Edit item"
      >
        <Pencil className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        onClick={() => setDeleteOpen(true)}
        disabled={isDeleting}
        title="Delete item"
      >
        <Trash2 className="size-4" />
      </Button>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Item"
        description={`Are you sure you want to delete ${item.productName}? This action cannot be undone.`}
        confirmLabel="Delete Item"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}

export function ItemAvailabilityCell({ item }: { item: ItemData }) {
  const { mutate: updateStatus } = useUpdateItemStatus(item.id);
  const isActive = item.status === "ACTIVE";

  return (
    <Switch
      checked={isActive}
      onCheckedChange={(checked) =>
        updateStatus(
          {
            status: checked ? "ACTIVE" : "INACTIVE",
            type: "STATUS",
          },
          {
            onSuccess: () => successToast({ description: "Item status updated successfully" }),
            onError: () => errorToast({ description: "Failed to update item status" }),
          },
        )
      }
      className="data-[state=checked]:bg-green-500"
      title={isActive ? "Active" : "Inactive"}
    />
  );
}

export function ItemAdminShareCell({ item }: { item: ItemData }) {
  const { mutate: updateStatus } = useUpdateItemStatus(item.id);
  const isActive = item.adminShare;

  return (
    <Switch
      checked={isActive}
      onCheckedChange={(checked) =>
        updateStatus(
          { type: "ADMIN_SHARE", adminShare: checked },
          {
            onSuccess: () => successToast({ description: "Markup value updated successfully" }),
            onError: () => errorToast({ description: "Failed to update markup value" }),
          },
        )
      }
      className="data-[state=checked]:bg-green-500"
      title={isActive ? "Active" : "Inactive"}
    />
  );
}

export function ItemDiscountAvailabilityCell({ item }: { item: ItemData }) {
  const { mutate: updateStatus } = useUpdateItemStatus(item.id);
  const isActive = item.discountAvailability;

  return (
    <Switch
      checked={isActive}
      onCheckedChange={(checked) =>
        updateStatus(
          { type: "DISCOUNT_AVAILABILITY", discountAvailability: checked },
          {
            onSuccess: () =>
              successToast({ description: "Discount availability updated successfully" }),
          },
        )
      }
      className="data-[state=checked]:bg-green-500"
      title={isActive ? "Active" : "Inactive"}
    />
  );
}
