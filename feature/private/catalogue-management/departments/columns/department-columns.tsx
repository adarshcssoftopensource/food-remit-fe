import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { ScopeBadge } from "@/components/common/scope-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { DepartmentActionsCell } from "../components/department-actions-cell";
import { DepartmentData } from "../types/department.types";
import { Globe, Eye, MapPin } from "lucide-react";

export function getDepartmentColumns(
  onEdit: (dept: DepartmentData) => void,
  onView: (dept: DepartmentData) => void,
  onImageClick?: (image: string) => void,
  isStoreScoped?: boolean,
): ColumnDef<DepartmentData>[] {
  const columns: ColumnDef<DepartmentData>[] = [
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
      accessorKey: "city",
      header: "City",
      enableSorting: true,
      cell: ({ row }) => {
        if (row.original.isGlobal) {
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Globe className="h-3 w-3" />
              All Cities ({row.original.countryName || "Global"})
            </span>
          );
        }
        if (row.original.cities && row.original.cities.length > 1) {
          return (
            <button className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50">
              <MapPin className="h-3 w-3" />
              {row.original.cities.length} Cities
            </button>
          );
        }
        return (
          <span className="text-primary text-sm font-medium">
            {row.original.cityName || row.original.city?.name || "-"}
          </span>
        );
      },
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

  return isStoreScoped
    ? columns.filter((col) => {
        const colId = col.id || (col as any).accessorKey;
        return colId !== "createdBy" && colId !== "country" && colId !== "city";
      })
    : columns;
}
