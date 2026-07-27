"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FoundationData, FOUNDATION_STATUS_STYLES } from "@/constants/foundation-management";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";

function FoundationStatusBadge({ status }: { status: FoundationData["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${FOUNDATION_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

const statusCell = ({ row }: { row: { original: FoundationData } }) => (
  <FoundationStatusBadge status={row.original.status} />
);

const websiteCell = ({ row }: { row: { original: FoundationData } }) => (
  <a
    href={row.original.website}
    target="_blank"
    rel="noopener noreferrer"
    className="text-primary text-sm hover:underline"
  >
    Link
  </a>
);

const actionCell = () => (
  <div className="flex gap-2">
    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 h-8">
      <Eye size={22} />
    </Button>
    <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 h-8">
      <Trash size={22} />
    </Button>
  </div>
);

export const foundationColumns: ColumnDef<FoundationData>[] = [
  { accessorKey: "foundationId", header: "Foundation ID" },
  { accessorKey: "foundationName", header: "Foundation Name" },
  { accessorKey: "foundationEmail", header: "Foundation Email" },
  { accessorKey: "website", header: "Website", cell: websiteCell },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "city", header: "City" },
  { accessorKey: "storiesAdded", header: "Stories Added" },
  { accessorKey: "status", header: "Status", cell: statusCell },
  { id: "actions", header: "Actions", cell: actionCell },
];
