"use client";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { useUpdateDepartmentStatus } from "../hooks/use-update-department-status";
import { DepartmentData } from "../types/department.types";

interface DepartmentActionsCellProps {
  department: DepartmentData;
  onEdit: (department: DepartmentData) => void;
  onView: (department: DepartmentData) => void;
}

export function DepartmentActionsCell({ department, onEdit, onView }: DepartmentActionsCellProps) {
  const [isActive, setIsActive] = useState(department.status === "ACTIVE");
  const { mutateAsync: updateStatus, isPending } = useUpdateDepartmentStatus(department.id);

  const handleStatusChange = async (checked: boolean) => {
    setIsActive(checked);
    try {
      await updateStatus({ status: checked ? "ACTIVE" : "INACTIVE" });
      successToast({ description: "Department status updated successfully" });
    } catch {
      setIsActive(!checked);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-colors"
        onClick={() => onView(department)}
        title="View department"
      >
        <Eye size={20} />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onEdit(department)}
        title="Edit department"
      >
        <Pencil size={20} />
      </Button>

      <Switch
        checked={isActive}
        onCheckedChange={handleStatusChange}
        disabled={isPending}
        className="data-[state=checked]:bg-green-500"
      />
    </div>
  );
}
