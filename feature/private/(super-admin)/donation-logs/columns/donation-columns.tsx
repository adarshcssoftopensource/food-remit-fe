import { type DonationLog, DONATION_STATUS_STYLES } from "@/constants/donation-logs";
import { ColumnDef } from "@tanstack/react-table";

function StatusBadge({ status }: { status: DonationLog["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${DONATION_STATUS_STYLES[status]}`}
    >
      <span
        className={`inline-block size-1.5 rounded-full ${
          status === "Completed"
            ? "bg-emerald-500"
            : status === "Pending"
              ? "bg-amber-500"
              : status === "Failed"
                ? "bg-red-500"
                : "bg-slate-400"
        }`}
      />
      {status}
    </span>
  );
}

function AmountCell({ amount, currency }: { amount: number; currency: string }) {
  return (
    <span className="text-primary font-semibold">
      {currency} {amount.toLocaleString()}
    </span>
  );
}

export const donationColumns: ColumnDef<DonationLog>[] = [
  {
    accessorKey: "id",
    header: "Donation ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium text-slate-500">#{row.original.id}</span>
    ),
  },
  {
    accessorKey: "senderFirstName",
    header: "Sender First Name",
    cell: ({ row }) => {
      const initials =
        `${row.original.senderFirstName[0] ?? ""}${row.original.senderLastName[0] ?? ""}`.toUpperCase();
      return (
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-800">{row.original.senderFirstName}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "senderLastName",
    header: "Sender Last Name",
    cell: ({ row }) => (
      <span className="text-sm text-slate-700">{row.original.senderLastName}</span>
    ),
  },
  {
    accessorKey: "senderEmail",
    header: "Sender Email",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-blue-600 hover:underline">{row.original.senderEmail}</span>
    ),
  },
  {
    accessorKey: "storyCreator",
    header: "Story Creator",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-700">{row.original.storyCreator}</span>
    ),
  },
  {
    accessorKey: "amountDonated",
    header: "Amount Donated",
    enableSorting: true,
    cell: ({ row }) => (
      <AmountCell amount={row.original.amountDonated} currency={row.original.currency} />
    ),
  },
  {
    accessorKey: "donatedAt",
    header: "Donated On",
    enableSorting: true,
    cell: ({ row }) => <span className="text-sm text-slate-500">{row.original.donatedAt}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];
