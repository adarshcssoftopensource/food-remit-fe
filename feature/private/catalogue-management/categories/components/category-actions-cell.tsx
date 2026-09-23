"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUpdateCategoryStatus } from "../hooks/use-update-category-status";
import { useDeleteCategory } from "../hooks/use-delete-category";
import { CategoryData } from "../types/category.types";
import { useProfile } from "@/components/providers/profile-provider";
import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

interface CategoryActionsCellProps {
  category: CategoryData;
  onEdit: (category: CategoryData) => void;
  onView: (category: CategoryData) => void;
}

export function CategoryActionsCell({ category, onEdit, onView }: CategoryActionsCellProps) {
  const [isActive, setIsActive] = useState(category.status === "ACTIVE");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: updateStatus, isPending } = useUpdateCategoryStatus(category.id);
  const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory(category.id);
  const { profile, needsBankVerification } = useProfile();
  const isStoreScoped = profile?.role === "store_manager" || profile?.roleCode === "STORE_MANAGER";
  const canWrite = !needsBankVerification;

  const handleStatusChange = async (checked: boolean) => {
    if (!canWrite) return;
    setIsActive(checked);
    try {
      await updateStatus({ status: checked ? "ACTIVE" : "INACTIVE" });
      successToast({ description: "Category status updated successfully" });
    } catch {
      setIsActive(!checked);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteCategory();
      setDeleteOpen(false);
      successToast({
        title: "Category Deleted",
        description: response?.message || "Category has been deleted successfully.",
      });
    } catch {}
  };

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Details",
      icon: <Eye className="size-4" />,
      onClick: () => onView(category),
      hidden: isStoreScoped,
    },
    {
      label: "Edit Category",
      icon: <Pencil className="size-4" />,
      onClick: () => onEdit(category),
      hidden: !canWrite,
    },
    {
      label: "Delete Category",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: isDeleting,
      hidden: !canWrite,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleStatusChange}
        disabled={isPending || !canWrite}
        className="data-[state=checked]:bg-green-500"
        title={isActive ? "Active" : "Inactive"}
      />

      <DataTableRowActions items={actionItems} />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Category"
        description={`Are you sure you want to delete ${category.categoryName}? It will be moved to the Recycle Bin and can be restored later.`}
        confirmLabel="Delete Category"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
