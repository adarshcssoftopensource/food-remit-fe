"use client";

import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { StatusBadge } from "@/components/common/status-badge";
import { type Employee } from "@/feature/private/employee-management/types/employee-management";
import { ColumnDef } from "@tanstack/react-table";
import { EmployeeActionsCell } from "../components/employee-actions-cell";

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
    cell: ({ row }) => (
      <StatusBadge status={row.original.accountStatus === "ACTIVE" ? "Active" : "Inactive"} />
    ),
    enableSorting: true,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <EmployeeActionsCell employee={row.original} />,
    enableSorting: false,
  },
];
