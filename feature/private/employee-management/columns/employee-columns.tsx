"use client";

import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { StatusBadge } from "@/components/common/status-badge";
import { Switch } from "@/components/ui/switch";
import { type Employee } from "@/feature/private/employee-management/types/employee-management";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { EmployeeActionsCell } from "../components/employee-actions-cell";
import { useUpdateEmployeeStatus } from "../hooks/use-update-employee-status";

function StatusToggle({ employee }: { employee: Employee }) {
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
    <div className="flex items-center space-x-2">
      <Switch checked={isActive} onCheckedChange={handleToggle} disabled={isPending} />
      <StatusBadge status={isActive ? "Active" : "Inactive"} />
    </div>
  );
}

export const employeeColumns = (onImageClick?: (image: string) => void): ColumnDef<Employee>[] => [
  {
    accessorKey: "id",
    header: "S No.",
    cell: ({ row, table }) => (
      <span className="pl-2 font-mono text-xs font-medium text-slate-400">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "firstName",
    header: "Employee Name",
    cell: ({ row }) => (
      <ImageNameCell
        name={`${row.original.firstName} ${row.original.lastName}`}
        image={row.original.image || undefined}
        type="profile"
        onImageClick={onImageClick}
        enableZoom={!!onImageClick}
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-600">{row.original.email}</span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-600">
        {row.original.countryCode ? `${row.original.countryCode} ` : ""}
        {row.original.phoneNumber || "-"}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <TruncatedTextCell
        text={row.original.address || "-"}
        className="max-w-45 cursor-default text-sm"
      />
    ),
    enableSorting: true,
  },
  {
    accessorKey: "city",
    header: "Location",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {[row.original.city, row.original.state].filter(Boolean).join(", ") || "-"}
      </span>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "accountStatus",
    header: "Status",
    cell: ({ row }) => <StatusToggle employee={row.original} />,
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <EmployeeActionsCell employee={row.original} />,
    enableSorting: false,
  },
];
