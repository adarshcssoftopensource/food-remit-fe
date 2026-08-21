"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUpdateDepartmentStatus } from "../hooks/use-update-department-status";
import { useDeleteDepartment } from "../hooks/use-delete-department";
import { DepartmentData } from "../types/department.types";

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

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500"
        onClick={() => onView(department)}
        title="View department"
      >
        <Eye className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500"
        onClick={() => onEdit(department)}
        title="Edit department"
      >
        <Pencil className="size-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
        onClick={() => setDeleteOpen(true)}
        disabled={isDeleting}
        title="Delete department"
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
        title="Delete Department"
        description={`Are you sure you want to delete ${department.departmentName}? This action cannot be undone.`}
        confirmLabel="Delete Department"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
