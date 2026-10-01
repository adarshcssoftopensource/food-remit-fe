"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { DeletedByCell } from "./deleted-by-cell";

export const movedDateColumn: ColumnDef<any> = {
  id: "movedDate",
  accessorKey: "deletedAt",
  header: "Moved Date",
  enableSorting: true,
  cell: ({ row }) => {
    const raw =
      row.original.deletedAt ||
      row.original.updatedAt ||
      row.original.modifiedOn ||
      row.original.addedOn ||
      row.original.createdAt;
    if (!raw) return <span className="text-xs text-slate-400">—</span>;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return <span className="text-xs text-slate-400">—</span>;
    return (
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {format(d, "MMM dd, yyyy")}
        </span>
        <span className="text-[10px] text-slate-400">{format(d, "hh:mm a")}</span>
      </div>
    );
  },
};

export const deletedByColumn: ColumnDef<any> = {
  id: "deletedBy",
  header: "Moved By",
  enableSorting: false,
  cell: ({ row }) => <DeletedByCell admin={row.original.deletedByAdmin} />,
};

/** Insert Moved Date and Moved By before the Actions column when `include` is true. */
export function withDeletedByColumn<T>(columns: ColumnDef<T>[], include: boolean): ColumnDef<T>[] {
  if (!include) {
    return columns.filter((c) => c.id !== "deletedBy" && c.id !== "movedDate");
  }
  const res = [...columns];
  const toInsert: ColumnDef<T>[] = [];
  if (!res.some((c) => c.id === "movedDate")) {
    toInsert.push(movedDateColumn as ColumnDef<T>);
  }
  if (!res.some((c) => c.id === "deletedBy")) {
    toInsert.push(deletedByColumn as ColumnDef<T>);
  }

  const actionsIdx = res.findIndex((c) => c.id === "actions");
  if (actionsIdx === -1) {
    return [...res, ...toInsert];
  }
  return [...res.slice(0, actionsIdx), ...toInsert, ...res.slice(actionsIdx)];
}
