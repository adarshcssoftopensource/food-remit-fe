"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { errorToast, successToast } from "@/components/toaster";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/components/providers/profile-provider";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteItem } from "../hooks/use-delete-item";
import { useUpdateItemStatus } from "../hooks/use-update-item-status";
import { ItemData } from "../types/item.types";

import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

interface ItemActionsCellProps {
  item: ItemData;
  onEdit: (item: ItemData) => void;
  onView: (item: ItemData) => void;
}

export function ItemActionsCell({ item, onEdit, onView }: ItemActionsCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: deleteItem, isPending: isDeleting } = useDeleteItem(item.id);
  const { needsBankVerification } = useProfile();
  const canWrite = !needsBankVerification;

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

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Details",
      icon: <Eye className="size-4" />,
      onClick: () => onView(item),
    },
    {
      label: "Edit Item",
      icon: <Pencil className="size-4" />,
      onClick: () => onEdit(item),
      hidden: !canWrite,
    },
    {
      label: "Delete Item",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: isDeleting,
      hidden: !canWrite,
    },
  ];

  return (
    <>
      <DataTableRowActions items={actionItems} />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Item"
        description={`Are you sure you want to delete ${item.productName}? It will be moved to the Recycle Bin and can be restored later.`}
        confirmLabel="Delete Item"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
}

export function ItemAvailabilityCell({ item }: { item: ItemData }) {
  const [pendingActive, setPendingActive] = useState<boolean | null>(null);
  const { mutate: updateStatus, isPending } = useUpdateItemStatus(item.id);
  const { needsBankVerification } = useProfile();

  const isActive = pendingActive !== null ? pendingActive : item.status === "ACTIVE";

  const handleToggle = (checked: boolean) => {
    if (needsBankVerification) return;
    if (checked && (!item.stockQuantity || Number(item.stockQuantity) <= 0)) {
      errorToast({ description: "Cannot enable availability when stock quantity is 0" });
      return;
    }
    setPendingActive(checked);
    updateStatus(
      {
        status: checked ? "ACTIVE" : "INACTIVE",
        type: "STATUS",
      },
      {
        onSuccess: () => {
          setPendingActive(null);
          successToast({ description: "Item status updated successfully" });
        },
        onError: () => {
          setPendingActive(null);
          errorToast({ description: "Failed to update item status" });
        },
      },
    );
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={isPending || needsBankVerification}
      className="data-[state=checked]:bg-green-500"
      title={isActive ? "Active" : "Inactive"}
    />
  );
}

export function ItemAdminShareCell({
  item,
  isSuperAdmin = false,
}: {
  item: ItemData;
  isSuperAdmin?: boolean;
}) {
  const [pendingActive, setPendingActive] = useState<boolean | null>(null);
  const { mutate: updateStatus, isPending } = useUpdateItemStatus(item.id);

  const isActive = pendingActive !== null ? pendingActive : !!item.adminShare;

  const handleToggle = (checked: boolean) => {
    setPendingActive(checked);
    updateStatus(
      { type: "ADMIN_SHARE", adminShare: checked },
      {
        onSuccess: () => {
          setPendingActive(null);
          successToast({ description: "Markup value updated successfully" });
        },
        onError: () => {
          setPendingActive(null);
          errorToast({ description: "Failed to update markup value" });
        },
      },
    );
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={!isSuperAdmin || isPending}
      className="data-[state=checked]:bg-green-500"
      title={isActive ? "Active" : "Inactive"}
    />
  );
}

export function ItemDiscountAvailabilityCell({ item }: { item: ItemData }) {
  const [pendingActive, setPendingActive] = useState<boolean | null>(null);
  const { mutate: updateStatus, isPending } = useUpdateItemStatus(item.id);
  const { needsBankVerification } = useProfile();

  const isActive = pendingActive !== null ? pendingActive : !!item.discountAvailability;

  const handleToggle = (checked: boolean) => {
    if (needsBankVerification) return;
    setPendingActive(checked);
    updateStatus(
      { type: "DISCOUNT_AVAILABILITY", discountAvailability: checked },
      {
        onSuccess: () => {
          setPendingActive(null);
          successToast({ description: "Discount availability updated successfully" });
        },
        onError: () => {
          setPendingActive(null);
        },
      },
    );
  };

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleToggle}
      disabled={isPending || needsBankVerification}
      className="data-[state=checked]:bg-green-500"
      title={isActive ? "Active" : "Inactive"}
    />
  );
}
