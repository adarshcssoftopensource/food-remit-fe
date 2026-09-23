"use client";

import { ColumnDef } from "@tanstack/react-table";

export type DeletedByAdmin = {
  id?: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  userType?: string | null;
} | null;

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  SUB_ADMIN: "Sub Admin",
  CO_ADMIN: "Co Admin",
  COUNTRY_MANAGER: "Country Manager",
  CITY_MANAGER: "City Manager",
  STORE_MANAGER: "Store Manager",
  STORE_ADMIN: "Store Manager",
  EMPLOYEE: "Employee",
  Superadmin: "Super Admin",
  store_manager: "Store Manager",
  store_admin: "Store Manager",
};

function formatDeletedByRole(userType?: string | null) {
  if (!userType) return "Admin";
  return ROLE_LABELS[userType] || userType.replace(/_/g, " ");
}

function formatDeletedByName(admin: DeletedByAdmin) {
  if (!admin) return "";
  const fromParts = `${admin.firstName || ""} ${admin.lastName || ""}`.trim();
  if (fromParts) return fromParts;
  return (admin.name || "").trim() || "Unknown";
}

/** Name + role badge for Deleted By (Super Admin recycle/history only). */
export function DeletedByCell({ admin }: { admin?: DeletedByAdmin }) {
  if (!admin) {
    return <span className="text-xs text-slate-400">—</span>;
  }

  const name = formatDeletedByName(admin);
  const role = formatDeletedByRole(admin.userType);

  return (
    <div className="flex min-w-[140px] flex-col gap-1">
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{name}</span>
      <span className="inline-flex w-fit items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-rose-700 uppercase ring-1 ring-rose-700/10 ring-inset dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-400/20">
        {role}
      </span>
    </div>
  );
}

export const deletedByColumn: ColumnDef<any> = {
  id: "deletedBy",
  header: "Deleted By",
  enableSorting: false,
  cell: ({ row }) => <DeletedByCell admin={row.original.deletedByAdmin} />,
};

/** Insert Deleted By before the Actions column when `include` is true. */
export function withDeletedByColumn<T>(columns: ColumnDef<T>[], include: boolean): ColumnDef<T>[] {
  if (!include) {
    return columns.filter((c) => c.id !== "deletedBy");
  }
  if (columns.some((c) => c.id === "deletedBy")) {
    return columns;
  }
  const actionsIdx = columns.findIndex((c) => c.id === "actions");
  if (actionsIdx === -1) {
    return [...columns, deletedByColumn as ColumnDef<T>];
  }
  return [
    ...columns.slice(0, actionsIdx),
    deletedByColumn as ColumnDef<T>,
    ...columns.slice(actionsIdx),
  ];
}
