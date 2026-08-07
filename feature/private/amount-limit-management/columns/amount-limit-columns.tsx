import { AmountLimitData } from "@/constants/amount-limit-management";
import { ColumnDef } from "@tanstack/react-table";
import { AmountLimitActionsCell } from "../components/actions-buttons";

function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`inline-block size-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-red-500"}`}
      />
      {status}
    </span>
  );
}

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
