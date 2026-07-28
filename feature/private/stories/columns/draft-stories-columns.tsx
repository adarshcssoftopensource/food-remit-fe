"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { DraftStory } from "@/constants/stories-management";

export const draftStoriesColumns: ColumnDef<DraftStory>[] = [
  { accessorKey: "serialNumber", header: "Sr no." },
  { accessorKey: "storyId", header: "Story ID" },
  { accessorKey: "storyName", header: "Story Name" },
  { accessorKey: "amountOrProductRequest", header: "Amount/Product Request" },
  { accessorKey: "createdOn", header: "Created On" },
  { id: "actions", header: "Actions", cell: () => null, enableSorting: false },
];
