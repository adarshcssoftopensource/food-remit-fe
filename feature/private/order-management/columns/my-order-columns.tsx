"use client";

import { Button } from "@/components/ui/button";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/date";
import { getInitials } from "@/lib/get-initials";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye, Loader2, PackageCheck, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompleteOrderByReferenceDialog } from "../../my-orders/components/complete-order-by-reference-dialog";
import { OrderStatusBadge } from "../components/order-status-badge";
import { useMarkOrderCompleted, useStartOrder } from "../hooks/use-order-lifecycle";
import { OrderData } from "../types/order.types";
import {
  formatRelativeTime,
  isPendingOrder,
  isProcessingOrder,
  ORDER_STATUS,
} from "../utils/order-workflow";

function MyOrderActionsCell({ order }: { order: OrderData }) {
  const router = useRouter();
  const [pickupOpen, setPickupOpen] = useState(false);
  const { mutateAsync: startOrder, isPending: starting } = useStartOrder();
  const { mutateAsync: markCompleted, isPending: completing } = useMarkOrderCompleted();

  const pending = isPendingOrder(order);
  const processing = isProcessingOrder(order);
  const completed = order.orderStatus === ORDER_STATUS.COMPLETED;
  const detail = ROUTES.ADMIN.MY_ORDER_DETAIL(order.id);

  const menuItems: DataTableRowActionItem[] = [
    {
      label: "View Order",
      icon: <Eye className="size-4" />,
      onClick: () => router.push(detail),
    },
  ];

  return (
    <div className="flex items-center justify-end gap-2">
      {pending && (
        <Button
          size="sm"
          className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
          disabled={starting}
          onClick={async () => {
            try {
              await startOrder(order.id);
              router.push(detail);
            } catch {
              /* toast in hook */
            }
          }}
        >
          {starting ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <Play className="mr-1.5 size-3.5 fill-current" />
          )}
          Start Order
        </Button>
      )}

      {processing && (
        <Button
          size="sm"
          className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
          disabled={completing}
          onClick={async () => {
            try {
              await markCompleted(order.id);
            } catch {
              /* toast in hook */
            }
          }}
        >
          {completing ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-1.5 size-3.5" />
          )}
          Mark Completed
        </Button>
      )}

      {completed && (
        <>
          <Button
            size="sm"
            className="h-9 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
            onClick={() => setPickupOpen(true)}
          >
            <PackageCheck className="mr-1.5 size-3.5" />
            Mark Picked Up
          </Button>
          <CompleteOrderByReferenceDialog
            orderId={order.id}
            open={pickupOpen}
            onOpenChange={setPickupOpen}
            mode="pickup"
          />
        </>
      )}

      <DataTableRowActions items={menuItems} />
    </div>
  );
}

function AssignedByCell({ order }: { order: OrderData }) {
  const name = order.startedByName || order.assignedEmployeeName;
  if (!name) return <span className="text-slate-400">—</span>;
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
        {getInitials(name)}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-800">{name}</p>
        <p className="text-[11px] text-slate-500">
          Started {formatRelativeTime(order.startedAt || order.assignedAt) || "—"}
        </p>
      </div>
    </div>
  );
}

export const myOrderColumns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "refrenceNumber",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-slate-800">
        #{row.original.refrenceNumber || row.original.id.substring(0, 8).toUpperCase()}
      </span>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-slate-800">
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
      return <span className="text-sm text-slate-600">{count} items</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold text-slate-900">{row.original.price || "—"}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Placed",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">{formatDate(row.original.createdAt)}</span>
    ),
  },
  {
    id: "orderStatus",
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
    id: "startedBy",
    header: "Started By",
    cell: ({ row }) => <AssignedByCell order={row.original} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <MyOrderActionsCell order={row.original} />,
  },
];
