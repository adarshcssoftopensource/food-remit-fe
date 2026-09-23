"use client";

import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/components/providers/profile-provider";
import { ROUTES } from "@/config/routes";
import { type Employee } from "@/feature/private/employee-management/types/employee-management";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUpdateEmployeeStatus } from "../hooks/use-update-employee-status";
import { EmployeeDialog } from "./employee-dialog";
import { useDeleteEmployee } from "../hooks/use-delete-employee";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

interface EmployeeActionsCellProps {
  employee: Employee;
}

export function EmployeeActionsCell({ employee }: EmployeeActionsCellProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const { needsBankVerification } = useProfile();
  const canWrite = !needsBankVerification;
  const { mutate: updateStatus, isPending } = useUpdateEmployeeStatus();
  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee(employee.id);
  const [isActive, setIsActive] = useState(employee.accountStatus === "ACTIVE");

  const handleToggle = (checked: boolean) => {
    if (!canWrite) return;
    setIsActive(checked);
    updateStatus(
      {
        id: employee.id,
        status: checked ? "ACTIVE" : "INACTIVE",
      },
      {
        onError: () => setIsActive(!checked),
      },
    );
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee();
      setDeleteOpen(false);
    } catch {}
  };

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Employee",
      icon: <Eye className="size-4" />,
      onClick: () => router.push(`${ROUTES.ADMIN.EMPLOYEE_MANAGEMENT}/${employee.id}`),
    },
    {
      label: "Edit Employee",
      icon: <Edit className="size-4" />,
      onClick: () => setIsEditOpen(true),
      hidden: !canWrite,
    },
    {
      label: "Delete Employee",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: isDeleting,
      hidden: !canWrite,
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={isActive}
          title={isActive ? "Active" : "Inactive"}
          onCheckedChange={handleToggle}
          disabled={isPending || !canWrite}
          className="data-[state=checked]:bg-green-500"
        />

        <DataTableRowActions items={actionItems} />
      </div>

      {canWrite && (
        <EmployeeDialog open={isEditOpen} onOpenChange={setIsEditOpen} employee={employee} />
      )}

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Employee"
        description={`Are you sure you want to delete employee "${employee.firstName} ${employee.lastName}"?This item will be moved to the Recycle Bin and can be restored later.`}
        confirmLabel="Delete Employee"
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </>
  );
}
