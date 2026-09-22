"use client";

import { ColumnDef } from "@tanstack/react-table";
import { OrderData } from "../types/order.types";
import { OrderActionsCell } from "../components/order-actions-cell";
import { OrderStatusBadge } from "../components/order-status-badge";
import { formatRelativeTime, ORDER_STATUS } from "../utils/order-workflow";
import { getInitials } from "@/lib/get-initials";

function formatTimePlaced(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
}

function AssignedCell({ order }: { order: OrderData }) {
  const name = order.startedByName || order.assignedEmployeeName;
  if (!name) {
    return <span className="text-slate-400">—</span>;
  }

  const image = order.startedByImage || order.assignedEmployeeImage;
  const when = order.startedAt || order.assignedAt;
  const relative = formatRelativeTime(when);
  const isCompleted =
    order.orderStatus === ORDER_STATUS.COMPLETED || order.orderStatus === ORDER_STATUS.CLOSED;
  const verb = isCompleted
    ? "Completed"
    : order.assignedAt && !order.startedAt
      ? "Assigned"
      : "Started";

  return (
    <div className="flex items-center gap-2.5">
      {image ? (
        <img src={image} alt="" className="size-8 rounded-full object-cover" />
      ) : (
        <span className="flex size-8 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">
          {getInitials(name)}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{name}</p>
        {relative && (
          <p className="text-[11px] text-slate-500">
            {verb} {relative}
          </p>
        )}
      </div>
    </div>
  );
}

export const orderColumns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "refrenceNumber",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
        #{row.original.refrenceNumber || row.original.id.substring(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div className="min-w-[140px]">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {row.original.recieverName || row.original.userName || "N/A"}
        </p>
        <p className="text-xs text-slate-500">{row.original.storeName || "—"}</p>
      </div>
    ),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const count =
        row.original.items?.reduce((s, i) => s + (i.quantity || 0), 0) ||
        row.original.items?.length ||
        0;
      return (
        <span className="text-sm text-slate-700 dark:text-slate-300">
          {count} item{count === 1 ? "" : "s"}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Total Amount",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900 dark:text-slate-100">
        {row.original.price || "—"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Time Placed",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600 dark:text-slate-400">
        {formatTimePlaced(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => (
      <OrderStatusBadge
        status={row.original.orderStatus}
        assignedEmployeeId={row.original.assignedEmployeeId}
        finalStatus={row.original.finalStatus}
      />
    ),
  },
  {
    id: "assigned",
    header: "Assigned / Started By",
    cell: ({ row }) => <AssignedCell order={row.original} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <OrderActionsCell order={row.original} />,
  },
];

export const historyOrderColumns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "refrenceNumber",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold">
        #{row.original.refrenceNumber || row.original.id.substring(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">
          {row.original.recieverName || row.original.userName || "N/A"}
        </p>
        <p className="text-xs text-slate-500">{row.original.storeName || "—"}</p>
      </div>
    ),
  },
  {
    id: "items",
    header: "Items",
    cell: ({ row }) => {
      const count =
        row.original.items?.reduce((s, i) => s + (i.quantity || 0), 0) ||
        row.original.items?.length ||
        0;
      return <span className="text-sm">{count} items</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Total Amount",
    cell: ({ row }) => <span className="font-semibold">{row.original.price || "—"}</span>,
  },
  {
    id: "completedAt",
    header: "Completed At",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.completedAt ? new Date(row.original.completedAt).toLocaleString() : "—"}
      </span>
    ),
  },
  {
    id: "finalStatus",
    header: "Final Status",
    cell: ({ row }) => (
      <OrderStatusBadge
        status={row.original.orderStatus}
        finalStatus={row.original.finalStatus}
        showFinal
      />
    ),
  },
  {
    id: "orderStatus",
    header: "Order Status",
    cell: ({ row }) => (
      <OrderStatusBadge status={row.original.orderStatus} finalStatus={row.original.finalStatus} />
    ),
  },
  {
    id: "closedAt",
    header: "Closed At",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.closedAt ? new Date(row.original.closedAt).toLocaleString() : "—"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <OrderActionsCell order={row.original} />,
  },
];
