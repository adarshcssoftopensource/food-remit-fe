"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { type Employee } from "@/feature/private/employee-management/types/employee-management";
import { Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmployeeDialog } from "./employee-dialog";

interface EmployeeActionsCellProps {
  employee: Employee;
}

export function EmployeeActionsCell({ employee }: EmployeeActionsCellProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          title="View Employee"
          onClick={() => router.push(`${ROUTES.ADMIN.EMPLOYEE_MANAGEMENT}/${employee.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          title="Edit Employee"
          onClick={() => setIsEditOpen(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </div>

      <EmployeeDialog open={isEditOpen} onOpenChange={setIsEditOpen} employee={employee} />
    </>
  );
}
