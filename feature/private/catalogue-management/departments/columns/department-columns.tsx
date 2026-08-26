import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { ScopeBadge } from "@/components/common/scope-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { DepartmentActionsCell } from "../components/department-actions-cell";
import { DepartmentData } from "../types/department.types";

export function getDepartmentColumns(
  onEdit: (dept: DepartmentData) => void,
  onView: (dept: DepartmentData) => void,
  onImageClick?: (image: string) => void,
): ColumnDef<DepartmentData>[] {
  return [
    {
      id: "serial",
      header: "S.No",
      cell: ({ row, table }) => (
        <span className="pl-2 text-sm font-medium text-slate-500">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
            row.index +
            1}
        </span>
      ),
    },
    {
      accessorKey: "departmentName",
      header: "Department Name",
      cell: ({ row }) => (
        <div className="space-y-1.5">
          <ImageNameCell
            name={row.original.departmentName}
            image={row.original.departmentIcon}
            type="logo"
            onImageClick={onImageClick}
            enableZoom={!!onImageClick}
          />
          <ScopeBadge
            isGlobal={row.original.isGlobal}
            scopeLabel={row.original.scopeLabel}
            cityName={row.original.cityName || row.original.city?.name}
          />
        </div>
      ),
    },
    {
      accessorKey: "country",
      header: "Country",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-primary text-sm font-medium">
          {row.original.country?.name || row.original.countryName || "-"}
        </span>
      ),
    },
    {
      id: "createdBy",
      header: "Created By",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {row.original.createdBy || "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created On",
      enableSorting: true,
      cell: ({ row }) => {
        const date = formatDate(row.original.createdAt);
        return <span className="font-mono text-xs text-slate-500">{date}</span>;
      },
    },
    {
      accessorKey: "updatedAt",
      header: "Updated On",
      enableSorting: true,
      cell: ({ row }) => {
        const date = formatDate(row.original.updatedAt);
        return <span className="font-mono text-xs text-slate-500">{date}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status === "ACTIVE" ? "Active" : "Inactive"}
          activeLabel="Active"
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DepartmentActionsCell department={row.original} onEdit={onEdit} onView={onView} />
      ),
    },
  ];
}
