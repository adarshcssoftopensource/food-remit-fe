"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Clock3, Eye, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CompleteOrderByReferenceDialog } from "../../my-orders/components/complete-order-by-reference-dialog";
import { PrepareOrderDialog } from "../../my-orders/components/prepare-order-dialog";
import { OrderStatusBadge } from "../components/order-status-badge";
import { OrderData } from "../types/order.types";
import { getOrderReference, maskOrderReference } from "../utils/mask-order-reference";

function MyOrderActionsCell({
  orderId,
  orderStatus,
  referenceHint,
}: {
  orderId: string;
  orderStatus: number;
  referenceHint?: string;
}) {
  const router = useRouter();
  const [prepareOpen, setPrepareOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);

  const canStartPreparing = orderStatus === 4 || orderStatus === 5 || orderStatus === 8;
  const canMarkComplete = orderStatus === 2; // After Preparing

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-300"
        onClick={() => router.push(ROUTES.ADMIN.MY_ORDER_DETAIL(orderId))}
      >
        <Eye className="mr-1.5 size-3.5" />
        View
      </Button>

      {canStartPreparing && (
        <>
          <Button
            size="sm"
            variant={"secondary"}
            className="h-8 rounded-lg bg-amber-600! px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-amber-700"
            onClick={() => setPrepareOpen(true)}
          >
            <Clock3 className="mr-1.5 size-3.5" />
            Mark as Preparing
          </Button>
          <PrepareOrderDialog orderId={orderId} open={prepareOpen} onOpenChange={setPrepareOpen} />
        </>
      )}

      {canMarkComplete && (
        <>
          <Button
            size="sm"
            className="h-8 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
            onClick={() => setCompleteOpen(true)}
          >
            <ShieldCheck className="mr-1.5 size-3.5" />
            Mark as Complete
          </Button>
          <CompleteOrderByReferenceDialog
            orderId={orderId}
            open={completeOpen}
            onOpenChange={setCompleteOpen}
            maskedHint={referenceHint}
          />
        </>
      )}

      {orderStatus === 6 && (
        <Button
          variant={"outline"}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          <CheckCircle2 className="size-3.5" />
          Completed
        </Button>
      )}
    </div>
  );
}

export const myOrderColumns: ColumnDef<OrderData>[] = [
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
    id: "refrenceNumber",
    header: "Reference",
    cell: ({ row }) => {
      const full = getOrderReference(row.original);
      return (
        <span
          className="font-mono text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-200"
          title="Only last 4 digits are visible"
        >
          {maskOrderReference(full)}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600 dark:text-slate-400">
        {formatDate(row.original.createdAt)} •{" "}
        {row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "userName",
    header: "Sender",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
        {row.original.userName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "recieverName",
    header: "Receiver",
    cell: ({ row }) => (
      <span className="text-sm text-slate-700 dark:text-slate-300">
        {row.original.recieverName || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Amount",
    cell: ({ row }) => {
      const originalPrice = row.original.price || "$0.00";
      const cp = row.original.customerPayment;
      const isCompletedRefund =
        cp?.refundStatus === "Completed" && Boolean(cp?.actualRetainedAmount);
      const isPendingRefund = cp?.refundStatus === "Pending";

      if (isCompletedRefund) {
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {cp?.actualRetainedAmount}
            </span>
            <span className="text-muted-foreground text-[11px] line-through">{originalPrice}</span>
            <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300">
              {cp?.refundAmount ? `(-${cp.refundAmount} refunded)` : "Refunded"}
            </span>
          </div>
        );
      }

      if (isPendingRefund && cp?.refundAmount) {
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {originalPrice}
            </span>
            <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400">
              Refund Pending: {cp.refundAmount}
            </span>
          </div>
        );
      }

      return (
        <span className="font-semibold text-slate-900 dark:text-slate-100">{originalPrice}</span>
      );
    },
  },
  {
    id: "orderStatus",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.orderStatus} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <MyOrderActionsCell
        orderId={row.original.id}
        orderStatus={row.original.orderStatus}
        referenceHint={getOrderReference(row.original)}
      />
    ),
  },
];
