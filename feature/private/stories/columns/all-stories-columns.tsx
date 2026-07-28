"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AllStory } from "@/constants/stories-management";

export const allStoriesColumns: ColumnDef<AllStory>[] = [
  { accessorKey: "serialNumber", header: "Sr no." },
  { accessorKey: "storyName", header: "Story Name" },
  { accessorKey: "foundationName", header: "Foundation Name" },
  { accessorKey: "foundationEmail", header: "Foundation Email" },
  { accessorKey: "foundationAddress", header: "Foundation Address" },
  { accessorKey: "amountOrProductRequest", header: "Amount/Product Request" },
  { accessorKey: "createdOn", header: "Created On" },
  { id: "actions", header: "Actions", cell: () => null, enableSorting: false },
];
