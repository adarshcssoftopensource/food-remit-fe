"use client";

import { CompleteOrderByReferenceDialog } from "@/feature/private/(shared)/my-orders/components/complete-order-by-reference-dialog";
import { OrderHandlerCell } from "../components/shared/order-handler-cell";
import { OrderStatusBadge } from "../components/shared/order-status-badge";
import { StartOrderConfirmDialog } from "../components/dialogs/start-order-confirm-dialog";
import { useMarkOrderCompleted, useStartOrder } from "../hooks/use-order-lifecycle";
import { OrderData } from "../types/order.types";
import {
  isAssignedOrder,
  isPendingOrder,
  isProcessingOrder,
  ORDER_STATUS,
} from "../utils/order-workflow";
import { ROUTES } from "@/config/routes";
import { formatRecentDateTime } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Eye, Loader2, PackageCheck, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { CopyButton } from "@/components/common/copy-button";
import { maskOrderReference } from "../utils/mask-order-reference";

function MyOrderActionsCell({ order }: { order: OrderData }) {
  const router = useRouter();
  const [pickupOpen, setPickupOpen] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const { mutateAsync: startOrder, isPending: starting } = useStartOrder();
  const { mutateAsync: markCompleted, isPending: completing } = useMarkOrderCompleted();

  const pending = isPendingOrder(order) || isAssignedOrder(order);
  const processing = isProcessingOrder(order);
  const completed = order.orderStatus === ORDER_STATUS.COMPLETED;
  const detail = ROUTES.ADMIN.MY_ORDER_DETAIL(order.id);
  const orderRef = order.refrenceNumber || order.id.substring(0, 8).toUpperCase();
  const customerName = order.recieverName || order.userName || "the customer";

  const menuItems: DataTableRowActionItem[] = [
    {
      label: "View Order",
      icon: <Eye className="size-4" />,
      onClick: () => router.push(detail),
    },
  ];

  return (
    <div className="flex w-full items-center justify-start gap-2">
      <DataTableRowActions items={menuItems} />

      {pending && (
        <Button
          size="sm"
          className="h-9 w-36 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
          disabled={starting}
          onClick={() => setStartOpen(true)}
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
          className="h-9 w-36 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
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
            className="h-9 min-w-34 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
            onClick={() => setPickupOpen(true)}
          >
            <PackageCheck className="mr-1.5 size-3.5" />
            Verify Pickup
          </Button>
          <CompleteOrderByReferenceDialog
            orderId={order.id}
            open={pickupOpen}
            onOpenChange={setPickupOpen}
            mode="pickup"
          />
        </>
      )}

      <StartOrderConfirmDialog
        open={startOpen}
        onOpenChange={setStartOpen}
        orderRef={orderRef}
        customerName={customerName}
        isLoading={starting}
        onConfirm={async () => {
          try {
            await startOrder(order.id);
            setStartOpen(false);
            router.push(detail);
          } catch {
            /* toast in hook */
          }
        }}
      />
    </div>
  );
}

export const myOrderColumns: ColumnDef<OrderData>[] = [
  {
    accessorKey: "refrenceNumber",
    header: "Order ID",
    cell: ({ row }) => {
      const orderRef = row.original.refrenceNumber || row.original.id;
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
          <span className="text-emerald-500/70">#</span>
          <span>{maskOrderReference(orderRef)}</span>
          <CopyButton
            value={orderRef}
            label="Order ID"
            className="h-3.5 w-3.5 p-0 text-emerald-600/70 hover:text-emerald-700 dark:hover:text-emerald-300"
          />
        </span>
      );
    },
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
    header: "Time Placed",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {formatRecentDateTime(row.original.createdAt, "—")}
      </span>
    ),
  },
  {
    id: "orderStatus",
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
    id: "startedBy",
    header: "Handled By",
    cell: ({ row }) => <OrderHandlerCell order={row.original} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <MyOrderActionsCell order={row.original} />,
  },
];
