"use client";

import { ColumnDef } from "@tanstack/react-table";
import { FoundationData, FOUNDATION_STATUS_STYLES } from "@/constants/foundation-management";
import {
  DataTableRowActionItem,
  DataTableRowActions,
} from "@/components/common/data-table/data-table-row-actions";
import { Eye, Trash2 } from "lucide-react";

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

const actionCell = () => {
  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Details",
      icon: <Eye className="size-4" />,
      onClick: () => {},
    },
    {
      label: "Delete Foundation",
      icon: <Trash2 className="size-4" />,
      onClick: () => {},
      variant: "destructive",
    },
  ];

  return (
    <div className="flex items-center gap-1.5">
      <DataTableRowActions items={actionItems} />
    </div>
  );
};

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
