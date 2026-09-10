"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { type Employee } from "@/feature/private/employee-management/types/employee-management";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUpdateEmployeeStatus } from "../hooks/use-update-employee-status";
import { EmployeeDialog } from "./employee-dialog";
import { useDeleteEmployee } from "../hooks/use-delete-employee";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";

interface EmployeeActionsCellProps {
  employee: Employee;
}

export function EmployeeActionsCell({ employee }: EmployeeActionsCellProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const { mutate: updateStatus, isPending } = useUpdateEmployeeStatus();
  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee(employee.id);
  const [isActive, setIsActive] = useState(employee.accountStatus === "ACTIVE");

  const handleToggle = (checked: boolean) => {
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

  return (
    <>
      <div className="flex items-center gap-2">
        <Switch
          checked={isActive}
          title={isActive ? "Active" : "Inactive"}
          onCheckedChange={handleToggle}
          disabled={isPending}
          className="data-[state=checked]:bg-green-500"
        />
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500"
          title="View Employee"
          onClick={() => router.push(`${ROUTES.ADMIN.EMPLOYEE_MANAGEMENT}/${employee.id}`)}
        >
          <Eye className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500 hover:border-slate-300 hover:bg-slate-50"
          title="Edit Employee"
          onClick={() => setIsEditOpen(true)}
        >
          <Edit className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          title="Delete Employee"
          onClick={() => setDeleteOpen(true)}
          disabled={isDeleting}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <EmployeeDialog open={isEditOpen} onOpenChange={setIsEditOpen} employee={employee} />

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
