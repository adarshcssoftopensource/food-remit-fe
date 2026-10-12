"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/date";
import type { AllStory } from "@/constants/stories-management";

export const allStoriesColumns: ColumnDef<AllStory>[] = [
  { accessorKey: "serialNumber", header: "Sr no." },
  { accessorKey: "storyName", header: "Story Name" },
  { accessorKey: "foundationName", header: "Foundation Name" },
  { accessorKey: "foundationEmail", header: "Foundation Email" },
  { accessorKey: "foundationAddress", header: "Foundation Address" },
  { accessorKey: "amountOrProductRequest", header: "Amount/Product Request" },
  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => formatDate(row.original.createdOn, row.original.createdOn),
  },
  { id: "actions", header: "Actions", cell: () => null, enableSorting: false },
];
