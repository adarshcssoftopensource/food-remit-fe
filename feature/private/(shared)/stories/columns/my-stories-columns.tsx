"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { MyStory } from "@/constants/stories-management";

export const myStoriesColumns: ColumnDef<MyStory>[] = [
  { accessorKey: "serialNumber", header: "Sr no." },
  { accessorKey: "storyId", header: "Story ID" },
  { accessorKey: "storyName", header: "Story Name" },
  { accessorKey: "createdBy", header: "Created By" },
  { accessorKey: "amountOrProductRequest", header: "Amount/Product Request" },
  { accessorKey: "createdOn", header: "Created On" },
  { id: "actions", header: "Actions", cell: () => null, enableSorting: false },
];
