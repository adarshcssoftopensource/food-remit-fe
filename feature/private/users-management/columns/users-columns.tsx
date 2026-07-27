import { Column, ColumnDef } from "@tanstack/react-table";
import { UserData } from "@/constants/users-management";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionsCell } from "../components/actions-cell";

function UserStatusBadge({ status }: { status: UserData["status"] }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`inline-block size-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`}
      />
      {status}
    </span>
  );
}

function SortHeader({ column, label }: { column: Column<UserData, unknown>; label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1 font-semibold hover:bg-transparent"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="size-3.5 text-slate-400" />
    </Button>
  );
}

export const usersColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <SortHeader column={column} label="User ID" />,
    cell: ({ row }) => <span className="font-mono text-xs text-slate-500">{row.original.id}</span>,
  },
  {
    accessorKey: "userName",
    id: "fullName",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
          {row.original.firstName?.[0]}
          {row.original.lastName?.[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-800">
            {row.original.firstName} {row.original.lastName}
          </p>
          <p className="text-xs text-slate-400">@{row.original.userName}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "userType",
    header: "User Type",
    cell: ({ row }) => (
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {row.original.userType}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortHeader column={column} label="Email Address" />,
    cell: ({ row }) => <span className="text-sm text-blue-600">{row.original.email}</span>,
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.contactNumber}</span>,
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.country}</span>,
  },
  {
    accessorKey: "registeredOn",
    header: ({ column }) => <SortHeader column={column} label="Registered On" />,
    cell: ({ row }) => <span className="text-xs text-slate-500">{row.original.registeredOn}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <UserStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];
