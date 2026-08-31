"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/config/routes";
import { type Employee } from "@/feature/private/employee-management/types/employee-management";
import { Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUpdateEmployeeStatus } from "../hooks/use-update-employee-status";
import { EmployeeDialog } from "./employee-dialog";

interface EmployeeActionsCellProps {
  employee: Employee;
}

export function EmployeeActionsCell({ employee }: EmployeeActionsCellProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();
  const { mutate: updateStatus, isPending } = useUpdateEmployeeStatus();
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
      </div>

      <EmployeeDialog open={isEditOpen} onOpenChange={setIsEditOpen} employee={employee} />
    </>
  );
}
