import type { OrderRow } from "@/constants/order-management";
import { ColumnDef } from "@tanstack/react-table";

export const orderColumns: ColumnDef<OrderRow>[] = [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row }) => (
      <span className="pl-2 font-mono text-xs text-slate-500">{row.index + 1}</span>
    ),
  },
  {
    accessorKey: "referenceNo",
    header: "Reference No",
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
  },
  {
    accessorKey: "senderName",
    header: "Sender Name",
  },
  {
    accessorKey: "receiverName",
    header: "Receiver Name",
  },
  {
    accessorKey: "totalCost",
    header: "Total Cost",
  },
  {
    accessorKey: "processingFees",
    header: "Processing Fees",
  },
  {
    accessorKey: "totalItemTax",
    header: "Total Item Tax",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Action",
    cell: () => <span className="text-muted-foreground text-sm">—</span>,
  },
];
