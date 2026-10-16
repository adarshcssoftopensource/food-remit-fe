"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/common/status-badge";
import { RecycledEntityActionsCell } from "../components/recycled-entity-actions-cell";
import { createSelectColumn, createSNoColumn } from "./recycled-table-helpers";

export const categoriesColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "categoryName",
    header: "Category Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">{row.original.categoryName}</p>
    ),
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
      <RecycledEntityActionsCell
        entityType="categories"
        entity={row.original}
        entityNameField="categoryName"
      />
    ),
  },
];
