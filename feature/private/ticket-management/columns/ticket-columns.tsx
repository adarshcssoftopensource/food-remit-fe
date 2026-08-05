import type { TicketRow } from "@/constants/ticket-management";
import { ColumnDef } from "@tanstack/react-table";

const baseColumns: ColumnDef<TicketRow>[] = [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">{row.index + 1}</span>
    ),
  },
  { accessorKey: "orderId", header: "Order ID" },
  { accessorKey: "ticketId", header: "Ticket ID" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "customerName", header: "Customer Name" },
  { accessorKey: "storeName", header: "Store Name" },
  { accessorKey: "subject", header: "Subject" },
];

const actionColumn: ColumnDef<TicketRow> = {
  id: "actions",
  header: "Action",
  cell: () => <span className="text-muted-foreground text-sm">—</span>,
};

export const activeTicketColumns: ColumnDef<TicketRow>[] = [
  ...baseColumns,
  { accessorKey: "status", header: "Status" },
  actionColumn,
];

export const closedTicketColumns: ColumnDef<TicketRow>[] = [
  ...baseColumns,
  { accessorKey: "closedBy", header: "Closed By" },
  actionColumn,
];
