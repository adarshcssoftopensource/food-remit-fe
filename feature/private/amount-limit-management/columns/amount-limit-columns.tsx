import { StatusBadge } from "@/components/common/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { AmountLimitActionsCell } from "../components/actions-buttons";
import type { AmountLimitData } from "../types/amount-limit.types";

export const amountLimitColumns: ColumnDef<AmountLimitData>[] = [
  {
    accessorKey: "id",
    header: "Sr. No",
    enableSorting: false,
    cell: ({ row, table }) => (
      <span className="pl-3 font-mono text-xs font-medium text-slate-500">
        #
        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
          row.index +
          1}
      </span>
    ),
  },
  {
    accessorKey: "countryName",
    header: "Country Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {row.original.countryName.slice(0, 2).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-slate-800">{row.original.countryName}</span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-slate-700">
        {row.original.amount} {row.original.currency ?? ""}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: true,
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.createdAt}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: () => <StatusBadge status="Active" />,
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => <AmountLimitActionsCell data={row.original} />,
  },
];
