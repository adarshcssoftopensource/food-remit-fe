"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUpdateDepartmentStatus } from "../hooks/use-update-department-status";
import { useDeleteDepartment } from "../hooks/use-delete-department";
import { DepartmentData } from "../types/department.types";
import { useProfile } from "@/components/providers/profile-provider";

import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

interface DepartmentActionsCellProps {
  department: DepartmentData;
  onEdit: (department: DepartmentData) => void;
  onView: (department: DepartmentData) => void;
}

export function DepartmentActionsCell({ department, onEdit, onView }: DepartmentActionsCellProps) {
  const [isActive, setIsActive] = useState(department.status === "ACTIVE");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: updateStatus, isPending } = useUpdateDepartmentStatus(department.id);
  const { mutateAsync: deleteDepartment, isPending: isDeleting } = useDeleteDepartment(
    department.id,
  );
  const { profile } = useProfile();
  const isStoreScoped = profile?.role === "store_manager" || profile?.roleCode === "STORE_MANAGER";

  const handleStatusChange = async (checked: boolean) => {
    setIsActive(checked);
    try {
      await updateStatus({ status: checked ? "ACTIVE" : "INACTIVE" });
      successToast({ description: "Department status updated successfully" });
    } catch {
      setIsActive(!checked);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteDepartment();
      setDeleteOpen(false);
      successToast({
        title: "Department Deleted",
        description: response?.message || "Department has been deleted successfully.",
      });
    } catch {}
  };

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Details",
      icon: <Eye className="size-4" />,
      onClick: () => onView(department),
      hidden: isStoreScoped,
    },
    {
      label: "Edit Department",
      icon: <Pencil className="size-4" />,
      onClick: () => onEdit(department),
    },
    {
      label: "Delete Department",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: isDeleting,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isActive}
        onCheckedChange={handleStatusChange}
        disabled={isPending}
        className="data-[state=checked]:bg-green-500"
        title={isActive ? "Active" : "Inactive"}
      />

      <DataTableRowActions items={actionItems} />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Department"
        description={`Are you sure you want to delete ${department.departmentName}? It will be moved to the Recycle Bin and can be restored later.`}
        confirmLabel="Delete Department"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
