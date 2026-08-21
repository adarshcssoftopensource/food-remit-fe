"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUpdateCategoryStatus } from "../hooks/use-update-category-status";
import { useDeleteCategory } from "../hooks/use-delete-category";
import { CategoryData } from "../types/category.types";

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

  const handleStatusChange = async (checked: boolean) => {
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

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500"
        onClick={() => onView(category)}
        title="View category"
      >
        <Eye className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500"
        onClick={() => onEdit(category)}
        title="Edit category"
      >
        <Pencil className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        onClick={() => setDeleteOpen(true)}
        disabled={isDeleting}
        title="Delete category"
      >
        <Trash2 className="size-4" />
      </Button>

      <Switch
        checked={isActive}
        onCheckedChange={handleStatusChange}
        disabled={isPending}
        className="data-[state=checked]:bg-green-500"
      />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Category"
        description={`Are you sure you want to delete ${category.categoryName}? This action cannot be undone.`}
        confirmLabel="Delete Category"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
