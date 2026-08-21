import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { ScopeBadge } from "@/components/common/scope-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryActionsCell } from "../components/category-actions-cell";
import { CategoryData } from "../types/category.types";

export function getCategoryColumns(
  onEdit: (dept: CategoryData) => void,
  onView: (dept: CategoryData) => void,
  onImageClick?: (image: string) => void,
): ColumnDef<CategoryData>[] {
  return [
    {
      id: "serial",
      header: "S.No",
      cell: ({ row }) => (
        <span className="pl-2 text-sm font-medium text-slate-500">{row.index + 1}</span>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Category Name",
      cell: ({ row }) => (
        <div className="space-y-1.5">
          <ImageNameCell
            name={row.original.categoryName}
            image={row.original.categoryIcon}
            type="logo"
            onImageClick={onImageClick}
            enableZoom={!!onImageClick}
          />
          <ScopeBadge
            isGlobal={row.original.isGlobal}
            scopeLabel={row.original.scopeLabel}
            cityName={row.original.cityName}
          />
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-primary text-sm font-medium">
          {row.original.departmentDisplayName || row.original.department?.departmentName || "-"}
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
          status={row.original.status}
          activeLabel="ACTIVE"
          displayLabel={row.original.status === "ACTIVE" ? "Active" : "Inactive"}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <CategoryActionsCell category={row.original} onEdit={onEdit} onView={onView} />
      ),
    },
  ];
}
