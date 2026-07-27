"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Philanthrophist } from "@/constants/philanthrophist-management";

export const philanthropistColumns: ColumnDef<Philanthrophist>[] = [
  { accessorKey: "userId", header: "User ID" },
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "contact", header: "Contact" },
  {
    accessorKey: "totalDonation",
    header: "Total Donation",
    cell: ({ row }) => `₹${row.original.totalDonation.toLocaleString("en-IN")}`,
  },
  { accessorKey: "status", header: "Status" },
  { id: "actions", header: "Actions", cell: () => null, enableSorting: false },
];
