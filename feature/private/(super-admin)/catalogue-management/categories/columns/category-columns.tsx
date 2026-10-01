import { ImageNameCell } from "@/components/common/data-table/image-name-cell";
import { ScopeBadge } from "@/components/common/scope-badge";
import { StatusBadge } from "@/components/common/status-badge";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import { CategoryActionsCell } from "../components/category-actions-cell";
import { CategoryData } from "../types/category.types";

export function getCategoryColumns(
  onEdit: (dept: CategoryData) => void,
  onView: (dept: CategoryData) => void,
  onImageClick?: (image: string) => void,
  isStoreScoped?: boolean,
): ColumnDef<CategoryData>[] {
  const columns: ColumnDef<CategoryData>[] = [
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
          {!isStoreScoped && (row.original.scopeLabel || row.original.isGlobal !== undefined) && (
            <div className="pt-0.5">
              <ScopeBadge isGlobal={row.original.isGlobal} scopeLabel={row.original.scopeLabel} />
            </div>
          )}
        </div>
      ),
    },

    {
      id: "itemCount",
      header: "Items",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          className="group text-primary hover:bg-primary/5 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold"
          title="Open items workspace"
        >
          {row.original.itemCount ?? 0}
          <span className="group-hover:text-primary text-xs font-medium text-slate-400">Open</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
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

  return isStoreScoped ? columns.filter((col) => col.id !== "createdBy") : columns;
}
