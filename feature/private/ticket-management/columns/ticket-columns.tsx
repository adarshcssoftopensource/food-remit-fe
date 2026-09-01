"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { TicketRowData } from "../hooks/use-get-tickets";

export function getTicketColumns(
  onViewTicket: (ticketId: string) => void,
): ColumnDef<TicketRowData>[] {
  return [
    {
      id: "sno",
      header: "S.No",
      enableSorting: false,
      cell: ({ row, table }) => (
        <span className="pl-2 font-mono text-xs text-slate-500">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
            row.index +
            1}
        </span>
      ),
    },
    {
      accessorKey: "refrenceNumber",
      header: "Order Reference",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-medium text-slate-700">
          {row.original.refrenceNumber || row.original.orderId || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "ticketId",
      header: "Ticket ID",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="block max-w-[120px] truncate font-mono text-xs text-slate-600">
          {row.original.ticketId}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      enableSorting: true,
      cell: ({ row }) => {
        const val = row.original.date;
        if (!val) return <span className="text-muted-foreground text-xs">—</span>;
        return (
          <span className="text-xs whitespace-nowrap text-slate-600">
            {new Date(val).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs font-medium text-slate-800">
          {row.original.customerName || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "storeName",
      header: "Store Name",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-slate-700">{row.original.storeName || "N/A"}</span>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      enableSorting: true,
      cell: ({ row }) => (
        <span
          className="line-clamp-1 max-w-[200px] text-xs font-medium text-slate-700"
          title={row.original.subject}
        >
          {row.original.subject || "No Subject"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => {
        const isClosed =
          row.original.ticketStatus === "INACTIVE" || row.original.status === "Closed";
        return (
          <Badge
            variant={isClosed ? "secondary" : "default"}
            className={
              isClosed
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }
          >
            {isClosed ? "Closed" : "Active"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      enableSorting: false,
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="flex h-8 items-center gap-1.5 px-2 text-xs"
          onClick={() => onViewTicket(row.original.id)}
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </Button>
      ),
    },
  ];
}
