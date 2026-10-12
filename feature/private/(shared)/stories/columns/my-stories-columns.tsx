"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/date";
import type { MyStory } from "@/constants/stories-management";

export const myStoriesColumns: ColumnDef<MyStory>[] = [
  { accessorKey: "serialNumber", header: "Sr no." },
  { accessorKey: "storyId", header: "Story ID" },
  { accessorKey: "storyName", header: "Story Name" },
  { accessorKey: "createdBy", header: "Created By" },
  { accessorKey: "amountOrProductRequest", header: "Amount/Product Request" },
  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => formatDate(row.original.createdOn, row.original.createdOn),
  },
  { id: "actions", header: "Actions", cell: () => null, enableSorting: false },
];
