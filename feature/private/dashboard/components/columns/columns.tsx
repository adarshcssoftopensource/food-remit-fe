"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/constants/dashboard";

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    enableSorting: true,
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    enableSorting: true,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="max-w-50 truncate" title={row.getValue("location")}>
        {row.getValue("location")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status.toLowerCase() === "paid"
              ? "rounded-sm bg-[#2ECC71] px-4 font-medium text-white hover:bg-[#27ae60]"
              : "rounded-sm bg-amber-500 px-4 font-medium text-white hover:bg-amber-600"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "deliveredTime",
    header: "Delivered Time",
    cell: ({ row }) => (
      <span className="text-sm text-slate-500">{row.getValue("deliveredTime")}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue("price")}</div>;
    },
  },
];
