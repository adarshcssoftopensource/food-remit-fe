"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CopyButton } from "@/components/common/copy-button";
import { StatusBadge } from "@/components/common/status-badge";
import { RecycledEntityActionsCell } from "../components/recycled-entity-actions-cell";
import { createSelectColumn, createSNoColumn } from "./recycled-table-helpers";

export const storesColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "storeName",
    header: "Store Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-slate-900 capitalize dark:text-white">
          {row.original.storeName}
        </p>
        <p className="max-w-xs truncate text-xs text-slate-400">{row.original.storeAddress}</p>
      </div>
    ),
  },
  {
    accessorKey: "countryName",
    header: "Country / City",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
        {row.original.countryName || "N/A"}{" "}
        {row.original.cityName ? `/ ${row.original.cityName}` : ""}
      </span>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => {
      const phone =
        `${row.original.storeCountryCode || ""} ${row.original.storePhoneNumber || ""}`.trim();
      return (
        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
          <span>{phone || "N/A"}</span>
          {phone && phone !== "N/A" ? (
            <CopyButton
              value={phone}
              label="Contact"
              className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            />
          ) : null}
        </div>
      );
    },
  },
  {
    accessorKey: "storeStatus",
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
        entityType="stores"
        entity={row.original}
        entityNameField="storeName"
      />
    ),
  },
];
