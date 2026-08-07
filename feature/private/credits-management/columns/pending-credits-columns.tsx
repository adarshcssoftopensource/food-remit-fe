import { ColumnDef } from "@tanstack/react-table";
import { CreditsData } from "../types/credits.types";

function StatusBadge({ status }: { status: CreditsData["status"] }) {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-600",
    Completed: "bg-emerald-100 text-emerald-600",
    Rejected: "bg-red-100 text-red-600",
  };

  const dotColors = {
    Pending: "bg-yellow-500",
    Completed: "bg-emerald-500",
    Rejected: "bg-red-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      <span className={`inline-block size-1.5 rounded-full ${dotColors[status]}`} />
      {status}
    </span>
  );
}

export const pendingCreditsColumns: ColumnDef<CreditsData>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.date}</span>,
  },
  {
    accessorKey: "referenceNumber",
    header: "Reference Number",
    cell: ({ row }) => (
      <span className="font-mono text-sm text-slate-600">{row.original.referenceNumber}</span>
    ),
  },
  {
    accessorKey: "receiverName",
    header: "Receiver Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {row.original.receiverName.slice(0, 2).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-slate-800">{row.original.receiverName}</span>
      </div>
    ),
  },
  {
    accessorKey: "storeName",
    header: "Store Name",
    cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.storeName}</span>,
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.country}</span>,
  },
  {
    accessorKey: "refundValue",
    header: "Refund Value",
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-slate-700">${row.original.refundValue}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Action",
    cell: () => <span className="text-sm text-slate-400">No actions available</span>,
  },
];
