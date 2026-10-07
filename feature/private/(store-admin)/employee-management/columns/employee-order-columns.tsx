"use client";

import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import { EmployeeOrderActionsCell } from "../components/employee-order-actions-cell";
import { OrderStatusBadge } from "@/feature/private/(store-admin)/order-management/components/shared/order-status-badge";

interface GetEmployeeOrderColumnsOptions {
  _employeeId: string;
  onView: (orderId: string) => void;
  onUnassign: (orderId: string) => void;
  isUnassigning: boolean;
}

export function getEmployeeOrderColumns({
  _employeeId,
  onView,
  onUnassign,
  isUnassigning,
}: GetEmployeeOrderColumnsOptions): ColumnDef<Record<string, unknown>>[] {
  return [
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
      header: "Reference No",
      cell: ({ row }) => {
        const orderId =
          (row.original.refrenceNumber as string) || (row.original.id as string).substring(0, 8);
        return (
          <div className="flex items-center">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 font-mono text-xs font-semibold text-emerald-700 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
              <span className="text-emerald-500/70">#</span>
              {orderId.replace(/^#/, "")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => <span>{formatDate(row.original.createdAt as string)}</span>,
    },
    {
      accessorKey: "userName",
      header: "Sender",
      cell: ({ row }) => (
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {(row.original.userName as string) || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "recieverName",
      header: "Receiver",
      cell: ({ row }) => (
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {(row.original.recieverName as string) || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "storeName",
      header: "Store",
      cell: ({ row }) => (
        <span className="font-medium text-slate-800 dark:text-slate-200">
          {(row.original.storeName as string) || "N/A"}
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const originalPrice = (row.original.price as string) || "$0.00";
        const cp = row.original.customerPayment as any;
        const isCompletedRefund =
          cp?.refundStatus === "Completed" && Boolean(cp?.actualRetainedAmount);
        const isPendingRefund = cp?.refundStatus === "Pending";

        if (isCompletedRefund) {
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {cp?.actualRetainedAmount}
              </span>
              <span className="text-muted-foreground text-[11px] line-through">
                {originalPrice}
              </span>
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
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => (
        <OrderStatusBadge
          status={row.original.orderStatus as number}
          assignedEmployeeId={row.original.assignedEmployeeId as string | null | undefined}
          startedById={row.original.startedById as string | null | undefined}
          finalStatus={row.original.finalStatus as number | null | undefined}
        />
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <EmployeeOrderActionsCell
          order={row.original as { id: string; orderStatus: number }}
          onView={onView}
          onUnassign={onUnassign}
          isUnassigning={isUnassigning}
        />
      ),
    },
  ];
}
