"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CopyButton } from "@/components/common/copy-button";
import { StatusBadge } from "@/components/common/status-badge";
import { RecycledEntityActionsCell } from "../components/recycled-entity-actions-cell";
import { createSelectColumn, createSNoColumn } from "./recycled-table-helpers";

// CITY MANAGERS COLUMNS
export const cityManagersColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "firstName",
    header: "Full Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-blue-600">
        <span>{row.original.email}</span>
        <CopyButton
          value={row.original.email}
          label="Email"
          className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        />
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
        <span>{row.original.phoneNumber || "N/A"}</span>
        {row.original.phoneNumber ? (
          <CopyButton
            value={row.original.phoneNumber}
            label="Phone"
            className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          />
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "assignedCityNames",
    header: "Assigned City",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {row.original.assignedCityNames || row.original.assignCities || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "managerStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.managerStatus}
        activeLabel="ACTIVE"
        displayLabel={row.original.managerStatus === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell entityType="city-managers" entity={row.original} />
    ),
  },
];

// COUNTRY MANAGERS COLUMNS
export const countryManagersColumns: ColumnDef<any>[] = [
  createSNoColumn(),
  createSelectColumn(),
  {
    accessorKey: "firstName",
    header: "Full Name",
    enableSorting: true,
    cell: ({ row }) => (
      <p className="font-semibold text-slate-900 dark:text-white">
        {row.original.firstName} {row.original.lastName}
      </p>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-blue-600">
        <span>{row.original.email}</span>
        <CopyButton
          value={row.original.email}
          label="Email"
          className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        />
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
        <span>{row.original.phoneNumber || "N/A"}</span>
        {row.original.phoneNumber ? (
          <CopyButton
            value={row.original.phoneNumber}
            label="Phone"
            className="h-3.5 w-3.5 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          />
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "assignCountryName",
    header: "Assigned Country",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {row.original.assignCountryName || row.original.assignCountries || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "managerStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.managerStatus}
        activeLabel="ACTIVE"
        displayLabel={row.original.managerStatus === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <RecycledEntityActionsCell entityType="country-managers" entity={row.original} />
    ),
  },
];
