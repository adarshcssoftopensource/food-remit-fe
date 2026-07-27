"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrderData, USER_MANAGEMENT_STATUS_STYLES } from "@/constants/users-management";
import { Button } from "@/components/ui/button";

function OrderStatusBadge({ status }: { status: OrderData["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${USER_MANAGEMENT_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

const costCell = ({ row }: { row: { original: OrderData } }) => `$${row.original.cost.toFixed(2)}`;

const statusCell = ({ row }: { row: { original: OrderData } }) => (
  <OrderStatusBadge status={row.original.status} />
);

const actionCell = () => (
  <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 h-8">
    View
  </Button>
);

const TAIL_COLS: ColumnDef<OrderData>[] = [
  { accessorKey: "storeName", header: "Store Name" },
  { accessorKey: "cost", header: "Cost", cell: costCell },
  { accessorKey: "status", header: "Status", cell: statusCell },
  { id: "actions", header: "Actions", cell: actionCell },
];

export const REQUESTED_ORDER_COLUMNS: ColumnDef<OrderData>[] = [
  { accessorKey: "orderId", header: "Order ID" },
  { accessorKey: "orderDate", header: "Order Date" },
  { accessorKey: "receiverName", header: "Receiver Name" },
  ...TAIL_COLS,
];

export const SENT_ORDER_COLUMNS: ColumnDef<OrderData>[] = [
  { accessorKey: "orderId", header: "Order ID" },
  { accessorKey: "orderDate", header: "Order Date" },
  { accessorKey: "receiverName", header: "Receiver Name" },
  ...TAIL_COLS,
];

export const RECEIVED_ORDER_COLUMNS: ColumnDef<OrderData>[] = [
  { accessorKey: "orderId", header: "Order ID" },
  { accessorKey: "orderDate", header: "Order Date" },
  { accessorKey: "senderName", header: "Sender Name" },
  ...TAIL_COLS,
];
