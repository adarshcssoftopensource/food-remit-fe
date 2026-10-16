"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Store, User } from "lucide-react";
import { StatusBadge } from "@/components/common/status-badge";
import { RecycledEntityActionsCell } from "../components/recycled-entity-actions-cell";
import { createSelectColumn, createSNoColumn } from "./recycled-table-helpers";

export const itemsColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "productName",
    header: "Product Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">{row.original.productName}</p>
    ),
  },
  {
    accessorKey: "storeName",
    header: "Vendor / Store",
    cell: ({ row }) => {
      const storeName =
        row.original.storeName ||
        row.original.store?.storeName ||
        row.original.department?.store?.storeName;
      const vendorName =
        row.original.vendorName ||
        row.original.store?.vendorName ||
        (row.original.store?.storeManager
          ? `${row.original.store.storeManager.firstName || ""} ${row.original.store.storeManager.lastName || ""}`.trim() ||
            row.original.store.storeManager.email
          : null);

      if (!storeName && !vendorName) {
        return (
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            Global / Platform
          </span>
        );
      }

      return (
        <div className="flex min-w-[130px] flex-col gap-0.5">
          {storeName && (
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
              <Store className="text-primary h-3.5 w-3.5 shrink-0" />
              <span className="max-w-[180px] truncate text-xs" title={storeName}>
                {storeName}
              </span>
            </div>
          )}
          {vendorName && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <User className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="max-w-[180px] truncate" title={vendorName}>
                {vendorName}
              </span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-600">
        {row.original.categoryName || "N/A"}
      </span>
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
        entityType="items"
        entity={row.original}
        entityNameField="productName"
      />
    ),
  },
];
