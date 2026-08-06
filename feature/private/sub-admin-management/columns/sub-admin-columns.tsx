import { SubAdminData } from "@/constants/sub-admin-management";
import { ColumnDef } from "@tanstack/react-table";
import { SubAdminActionsCell } from "../components/actions-cell";

function StatusBadge({ status }: { status: SubAdminData["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${"bg-red-100 text-red-600"}`}
    >
      <span className={`inline-block size-1.5 rounded-full ${"bg-red-500"}`} />
      {status}
    </span>
  );
}

export const subAdminColumns: ColumnDef<SubAdminData>[] = [
  {
    accessorKey: "userId",
    header: "User ID",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="pl-3 font-mono text-xs font-medium text-slate-500">
        #{row.original.userId}
      </span>
    ),
  },
  {
    accessorKey: "userName",
    header: "User Name",
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
      <span className="pl-3 text-sm text-blue-600 hover:underline">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
    cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.contactNumber}</span>,
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => (
      <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
        {row.original.permissions.length} modules
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <SubAdminActionsCell admin={row.original} />,
  },
];
