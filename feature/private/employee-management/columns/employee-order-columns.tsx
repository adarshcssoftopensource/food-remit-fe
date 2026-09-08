"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { map } from "@/constants/employee-management";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: number;
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const s = map[status] ?? {
    label: "Unknown",
    cls: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        s.cls,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {s.label}
    </span>
  );
}

interface GetEmployeeOrderColumnsOptions {
  onUnassign: (orderId: string) => void;
  isUnassigning: boolean;
}

export function getEmployeeOrderColumns({
  onUnassign,
  isUnassigning,
}: GetEmployeeOrderColumnsOptions): ColumnDef<any>[] {
  return [
    {
      accessorKey: "id",
      header: "Ref No",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-500">
          #{row.original.refrenceNumber || row.original.id.substring(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: "orderStatus",
      header: "Status",
      cell: ({ row }) => <OrderStatusBadge status={row.original.orderStatus} />,
    },
    {
      id: "unassign",
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8 rounded-lg border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 transition-all hover:bg-red-100 hover:text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
          onClick={() => onUnassign(row.original.id)}
          disabled={isUnassigning}
        >
          {isUnassigning ? (
            <Loader2 className="mr-1.5 size-3.5 animate-spin" />
          ) : (
            <XCircle className="mr-1.5 size-3.5" />
          )}
          Unassign
        </Button>
      ),
    },
  ];
}
