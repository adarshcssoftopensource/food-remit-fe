"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { UserCheck } from "lucide-react";
import { OrderData } from "../types/order.types";
import { OrderActionsCell } from "../components/shared/order-actions-cell";
import { OrderStatusBadge } from "../components/shared/order-status-badge";
import { OrderHandlerCell } from "../components/shared/order-handler-cell";
import { FINAL_STATUS, isPendingOrder } from "../utils/order-workflow";
import { parseAbandonRemark } from "../components/shared/abandon-remark";
import { SystemAbandonBadge } from "../components/shared/abandon-remark-badge";
import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
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
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  ) {
    return `Yesterday, ${time}`;
  }
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
}

const selectColumn: ColumnDef<OrderData> = {
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        (table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")) as boolean
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      disabled={!table.getRowModel().rows.some((row) => row.getCanSelect())}
      aria-label="Select all"
      className="translate-y-0.5"
    />
  ),
  cell: ({ row }) => {
    if (!isPendingOrder(row.original)) {
      return (
        <TooltipProvider delay={200}>
          <Tooltip>
            <TooltipTrigger>
              <div className="inline-flex cursor-not-allowed items-center opacity-40">
                <Checkbox checked={false} disabled aria-label="Not assignable" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <span className="flex items-center gap-1.5 font-medium">
                <UserCheck className="size-3.5 text-emerald-400" />
                Only paid Pending orders can be assigned
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    );
  },
  enableSorting: false,
  enableHiding: false,
};

export const orderColumns: ColumnDef<OrderData>[] = [
  selectColumn,
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
        startedById={row.original.startedById}
        finalStatus={row.original.finalStatus}
      />
    ),
  },
  {
    id: "assigned",
    header: "Assigned / Started By",
    cell: ({ row }) => <OrderHandlerCell order={row.original} />,
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
    id: "handledBy",
    header: "Handled By",
    cell: ({ row }) => {
      const name = row.original.startedByName || row.original.assignedEmployeeName;
      return name ? (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{name}</span>
      ) : (
        <span className="text-xs text-slate-400">—</span>
      );
    },
  },
  {
    id: "pickedUpBy",
    header: "Picked Up By",
    cell: ({ row }) =>
      row.original.finalStatus === FINAL_STATUS.PICKED_UP ? (
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {row.original.recieverName || row.original.userName || "Customer"}
          </p>
          <p className="text-[11px] whitespace-nowrap text-slate-500">
            {formatTimePlaced(row.original.pickedUpAt || undefined)}
          </p>
        </div>
      ) : (
        <span className="text-xs text-slate-400">—</span>
      ),
  },
  {
    id: "closedAt",
    header: "Closed At",
    cell: ({ row }) => (
      <span className="text-sm whitespace-nowrap text-slate-600">
        {formatTimePlaced(row.original.closedAt || undefined)}
      </span>
    ),
  },
  {
    id: "finalStatus",
    header: "Status",
    cell: ({ row }) => (
      <OrderStatusBadge
        status={row.original.orderStatus}
        finalStatus={row.original.finalStatus}
        showFinal
      />
    ),
  },
  {
    id: "abandonRemark",
    header: "Abandon Remark",
    cell: ({ row }) => {
      const raw = row.original.abandonRemark?.trim();
      if (!raw) return <span className="text-xs text-slate-400">—</span>;
      const { isSystem, remark } = parseAbandonRemark(raw);
      return (
        <div className="flex max-w-60 space-y-1.5">
          <SystemAbandonBadge isSystem={isSystem} />
          <TruncatedTextCell
            text={remark}
            maxWords={2}
            className="ml-2 block text-xs font-medium text-slate-700 dark:text-slate-300"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <OrderActionsCell order={row.original} />,
  },
];
