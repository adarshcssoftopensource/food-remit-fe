"use client";

import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { OrderStatusSelect } from "../components/order-status-select";
import { OrderData } from "../types/order.types";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

function MyOrderActionsCell({ orderId }: { orderId: string }) {
  const router = useRouter();

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 rounded-lg border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/20 dark:text-slate-300"
      onClick={() => router.push(ROUTES.ADMIN.MY_ORDER_DETAIL(orderId))}
    >
      <Eye className="mr-1.5 size-3.5" />
      View
    </Button>
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
    accessorKey: "refrenceNumber",
    header: "Ref No",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
        {row.original.refrenceNumber || `#${row.original.id.substring(0, 8).toUpperCase()}`}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Order Date",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600 dark:text-slate-400">
        {formatDate(row.original.createdAt)}
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
    cell: ({ row }) => (
      <OrderStatusSelect orderId={row.original.id} currentStatus={row.original.orderStatus} />
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => <MyOrderActionsCell orderId={row.original.id} />,
  },
];
