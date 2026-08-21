import { ColumnDef } from "@tanstack/react-table";
import { OrderData } from "../types/order.types";
import { OrderActionsCell } from "../components/order-actions-cell";
import { formatDate } from "@/lib/date";
import { StatusBadge } from "@/components/common/status-badge";

export const orderColumns: ColumnDef<OrderData>[] = [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">{row.index + 1}</span>
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
    accessorKey: "userId",
    header: "Sender",
    cell: ({ row }) => <span>{row.original.userId || "N/A"}</span>,
  },
  {
    accessorKey: "recieverId",
    header: "Receiver",
    cell: ({ row }) => <span>{row.original.recieverId || "N/A"}</span>,
  },
  {
    accessorKey: "storeId",
    header: "Store",
    cell: ({ row }) => <span>{row.original.storeId || "N/A"}</span>,
  },
  {
    accessorKey: "orderType",
    header: "Order Type",
    cell: ({ row }) => <span>{row.original.orderType || 1}</span>,
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.orderStatus === 1 ? "Active" : "Inactive"} />
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <OrderActionsCell order={row.original} />,
  },
];
