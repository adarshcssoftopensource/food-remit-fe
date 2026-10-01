"use client";

import { getInitials } from "@/lib/get-initials";
import { ColumnDef } from "@tanstack/react-table";

interface SalesOrder {
  id: string;
  referenceNumber: string;
  customerName: string;
  date: string;
  orderAmount: string;
}

export const salesColumns: ColumnDef<SalesOrder>[] = [
  {
    accessorKey: "referenceNumber",
    header: "Order ID",
    cell: ({ row }) => {
      const ref = (row.getValue("referenceNumber") as string) || "";
      const displayRef = ref ? (ref.startsWith("#") ? ref : `#${ref}`) : "—";
      return (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {displayRef}
        </span>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Sender Name",
    cell: ({ row }) => {
      const name: string = row.getValue("customerName") || "Customer";
      const initials = getInitials(name);
      return (
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            {initials}
          </div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {row.getValue("date") || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "orderAmount",
    header: "Order Amount",
    cell: ({ row }) => (
      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
        {row.getValue("orderAmount")}
      </div>
    ),
  },
];
