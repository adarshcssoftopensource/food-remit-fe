import { StatusBadge } from "@/components/common/status-badge";
import { AmountLimitData } from "@/constants/amount-limit-management";
import { ColumnDef } from "@tanstack/react-table";
import { AmountLimitActionsCell } from "../components/actions-buttons";

export const amountLimitColumns: ColumnDef<AmountLimitData>[] = [
  {
    accessorKey: "id",
    header: "Sr. No",
    cell: ({ row }) => (
      <span className="pl-3 font-mono text-xs font-medium text-slate-500">#{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "countryName",
    header: "Country Name",
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
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-slate-700">${row.original.amount}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.original.createdAt}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: () => <StatusBadge status="Active" />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <AmountLimitActionsCell data={row.original} />,
  },
];
