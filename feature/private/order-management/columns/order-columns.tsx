import { ColumnDef } from "@tanstack/react-table";
import { OrderData } from "../types/order.types";
import { OrderActionsCell } from "../components/order-actions-cell";
import { formatDate } from "@/lib/date";
import { Checkbox } from "@/components/ui/checkbox";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { UserCheck } from "lucide-react";

export const orderColumns: ColumnDef<OrderData>[] = [
  {
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
      const isAssigned = !!row.original.assignedEmployeeId;

      if (isAssigned) {
        return (
          <TooltipProvider delay={200}>
            <Tooltip>
              <TooltipTrigger>
                <div className="inline-flex cursor-not-allowed items-center opacity-40">
                  <Checkbox
                    checked={false}
                    disabled
                    aria-label="Already assigned"
                    className="translate-y-[2px]"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-slate-900 text-slate-50 dark:bg-white dark:text-slate-900"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="size-3.5 text-emerald-400 dark:text-emerald-600" />
                  Already assigned
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      const isRequested = row.original.orderType === 2;
      if (isRequested && row.original.orderStatus !== 8) {
        return (
          <TooltipProvider delay={200}>
            <Tooltip>
              <TooltipTrigger>
                <div className="inline-flex cursor-not-allowed items-center opacity-40">
                  <Checkbox
                    checked={false}
                    disabled
                    aria-label="Must be Accepted & Paid"
                    className="translate-y-[2px]"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-slate-900 text-slate-50 dark:bg-white dark:text-slate-900"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  Order must be Accepted and Paid to assign
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
  },
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
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.refrenceNumber || row.original.id.substring(0, 8)}
      </span>
    ),
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
    accessorKey: "price",
    header: "Price",
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
    accessorKey: "assignedEmployeeName",
    header: "Employee",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-slate-200">
        {row.original.assignedEmployeeName || "Unassigned"}
      </span>
    ),
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.orderStatus;
      const isRequested = row.original.orderType === 2;
      let label = "Pending";
      let colorClass = "border-slate-200 bg-slate-50 text-slate-700";
      let dotClass = "bg-slate-500";

      if (status === 0 || status === 7) {
        label = "Declined";
        colorClass =
          "border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400";
        dotClass = "bg-red-500";
      } else if (status === 1) {
        label = "Requested";
        colorClass =
          "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400";
        dotClass = "bg-amber-500";
      } else if (status === 10) {
        label = "Accepted";
        colorClass =
          "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400";
        dotClass = "bg-indigo-500";
      } else if (status === 2) {
        label = "Preparing";
        colorClass =
          "border-sky-200 bg-sky-50 text-sky-600 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400";
        dotClass = "bg-sky-500";
      } else if (status === 5) {
        label = "Processing";
        colorClass =
          "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400";
        dotClass = "bg-blue-500";
      } else if (status === 6 || status === 8) {
        label = status === 8 ? (isRequested ? "Accepted & Paid" : "Paid") : "Completed";
        colorClass =
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400";
        dotClass = "bg-emerald-500";
      } else if (status === 9) {
        label = "Partial";
        colorClass =
          "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-400";
        dotClass = "bg-purple-500";
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
