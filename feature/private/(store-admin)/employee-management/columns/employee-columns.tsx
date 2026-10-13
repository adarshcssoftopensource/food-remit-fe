"use client";

import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { CopyButton } from "@/components/common/copy-button";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { StatusBadge } from "@/components/common/status-badge";
import { PhoneDisplay } from "@/components/ui/phone-display";
import { formatAddress } from "@/lib/utils";
import { type Employee } from "@/feature/private/(store-admin)/employee-management/types/employee-management";
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
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {row.original.email}
        </span>
        <CopyButton
          value={row.original.email}
          label="Email"
          className="h-4 w-4 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        />
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => {
      const fullPhone =
        `${row.original.countryCode ? (row.original.countryCode.startsWith("+") ? row.original.countryCode : `+${row.original.countryCode}`) : ""} ${row.original.phoneNumber || ""}`.trim();
      return (
        <div className="flex items-center gap-1.5">
          <PhoneDisplay
            countryCode={row.original.countryCode}
            phoneNumber={row.original.phoneNumber}
            emptyLabel="-"
          />
          {row.original.phoneNumber ? (
            <CopyButton
              value={fullPhone}
              label="Contact Number"
              className="h-4 w-4 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            />
          ) : null}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    id: "address",
    accessorFn: (row) =>
      [formatAddress(row.address), row.city, row.state, row.zipCode].filter(Boolean).join(", "),
    header: "Address",
    cell: ({ row }) => {
      const fullAddress = [
        formatAddress(row.original.address),
        row.original.city,
        row.original.state,
        row.original.zipCode,
      ]
        .filter(Boolean)
        .join(", ");

      if (!fullAddress) return <span className="text-slate-400">-</span>;

      return (
        <div className="flex max-w-85 items-center gap-1.5">
          <TruncatedTextCell
            text={fullAddress}
            maxChars={35}
            className="cursor-default text-sm text-slate-600 dark:text-slate-300"
          />
          <CopyButton
            value={fullAddress}
            label="Address"
            className="h-4 w-4 shrink-0 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          />
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "assignedOrdersCount",
    header: "Assigned Orders",
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-slate-700">
        {(row.original as any).assignedOrdersCount || 0}
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
