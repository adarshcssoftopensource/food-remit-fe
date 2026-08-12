"use client";

import { useGetDepartmentsDropdown } from "@/feature/private/catalogue-management/departments/hooks/use-get-departments-dropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface DepartmentSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DepartmentSelect({
  value,
  onValueChange,
  placeholder = "Select department...",
  className = "h-11 rounded-xl",
  disabled,
}: DepartmentSelectProps) {
  const { data, isLoading } = useGetDepartmentsDropdown();

  const departments = Array.isArray((data as any)?.data) ? (data as any).data : [];

  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as string)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={className}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            <span className="text-slate-400">Loading departments...</span>
          </div>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {departments.length === 0 && !isLoading ? (
          <div className="p-2 text-center text-sm text-slate-500">No departments found</div>
        ) : (
          departments.map((dept: any) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name || dept.departmentName}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
