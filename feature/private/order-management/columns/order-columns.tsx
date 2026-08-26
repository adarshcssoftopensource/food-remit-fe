import { ColumnDef } from "@tanstack/react-table";
import { OrderData } from "../types/order.types";
import { OrderActionsCell } from "../components/order-actions-cell";
import { formatDate } from "@/lib/date";
import { StatusBadge } from "@/components/common/status-badge";

export const orderColumns: ColumnDef<OrderData>[] = [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row, table }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Reference No",
    cell: ({ row }) => <span className="font-mono text-xs">{row.original.id.substring(0, 8)}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => <span>{formatDate(row.original.createdAt)}</span>,
  },
  {
    accessorKey: "userName",
    header: "Sender",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {row.original.userName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "recieverName",
    header: "Receiver",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {row.original.recieverName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "storeName",
    header: "Store",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {row.original.storeName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.orderStatus;
      let label = "Unknown";
      let colorClass = "border-slate-200 bg-slate-50 text-slate-700";
      let dotClass = "bg-slate-500";

      if (status === 0) {
        label = "Declined";
        colorClass =
          "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
        dotClass = "bg-red-500";
      } else if (status === 1) {
        label = "Pending";
        colorClass =
          "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
        dotClass = "bg-amber-500";
      } else if (status === 5) {
        label = "Partial";
        colorClass =
          "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400";
        dotClass = "bg-blue-500";
      } else if (status === 6) {
        label = "Completed";
        colorClass =
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
        dotClass = "bg-emerald-500";
      }

      return (
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 focus:outline-none dark:focus:ring-slate-300 ${colorClass}`}
        >
          <span className={`size-1.5 rounded-full ${dotClass}`} />
          {label}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <OrderActionsCell order={row.original} />,
  },
];
