import { StatusBadge } from "@/components/common/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { SubAdminActionsCell } from "../components/actions-cell";
import { SubAdminData } from "../types/sub-admin.types";

export const subAdminColumns: ColumnDef<SubAdminData>[] = [
  {
    id: "sno",
    header: "S.No",
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex;
      const pageSize = table.getState().pagination.pageSize;

      return pageIndex * pageSize + row.index + 1;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userName",
    header: "User Name",
    enableSorting: true,
    cell: ({ row }) => {
      const initials = row.original.userName
        .split(/[\s-_]/)
        .map((w: any) => w[0]?.toUpperCase())
        .slice(0, 2)
        .join("");
      return (
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {initials}
          </div>
          <span className="text-sm font-medium text-slate-800">{row.original.userName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-blue-600 hover:underline">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
    enableSorting: true,
    cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.contactNumber}</span>,
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
        {row.original.permissions.length} modules
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <SubAdminActionsCell admin={row.original} />,
  },
];
