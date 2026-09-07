"use client";

import { getInitials } from "@/lib/get-initials";
import { ColumnDef } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import type { DashboardOrderRequested } from "../../types/dashboard.types";
import { DashboardStatusBadge } from "../common/dashboard-status-badge";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";

export const requestedOrdersColumns: ColumnDef<DashboardOrderRequested>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold whitespace-nowrap text-slate-800 dark:bg-slate-800 dark:text-slate-200">
        {row.getValue("orderId")}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    enableSorting: false,
    cell: ({ row }) => {
      const name: string = row.getValue("customerName") || "Customer";
      const initials = getInitials(name);
      return (
        <div className="flex max-w-35 items-center gap-2">
          <div className="bg-primary/10 text-primary dark:bg-primary/20 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
            {initials}
          </div>
          <TruncatedTextCell
            text={name}
            maxWords={2}
            className="text-xs font-semibold text-slate-800 dark:text-slate-200"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    enableSorting: false,
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      return (
        <div className="flex max-w-30 items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
          <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
          <TruncatedTextCell text={location || "—"} maxChars={16} />
        </div>
      );
    },
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => <DashboardStatusBadge status={row.getValue("orderStatus")} />,
  },
  {
    accessorKey: "deliveredTime",
    header: "Delivered Time",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-xs font-medium whitespace-nowrap text-slate-500 dark:text-slate-400">
        {row.getValue("deliveredTime") || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-xs font-bold whitespace-nowrap text-slate-900 dark:text-slate-100">
        {row.getValue("price")}
      </div>
    ),
  },
];
