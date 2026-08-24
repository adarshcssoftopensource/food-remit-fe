import { StatusBadge } from "@/components/common/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDateTime } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { UserData } from "../../users-management/types/user.types";
import { RecycledActionsCell } from "../components/recycled-actions-cell";

export const usersColumns: ColumnDef<UserData>[] = [
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
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "userName",
    id: "fullName",
    header: "Full Name",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        {row.original.profileImage ? (
          <Image
            src={row.original.profileImage}
            alt={`${row.original.firstName} ${row.original.lastName}`}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
            width={40}
            height={40}
          />
        ) : (
          <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
            {row.original.firstName?.[0]}
            {row.original.lastName?.[0]}
          </div>
        )}
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
    enableSorting: true,
    cell: ({ row }) => (
      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {row.original.userType}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email Address",
    enableSorting: true,
    cell: ({ row }) => <span className="pl-3 text-sm text-blue-600">{row.original.email}</span>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Contact",
    enableSorting: true,
    cell: ({ row }) => <span className="text-sm text-slate-700">{row.original.phoneNumber}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Registered On",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="pl-3 text-xs text-slate-500">{formatDateTime(row.original.createdAt)}</span>
    ),
  },
  {
    accessorKey: "userStatus",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.userStatus}
        activeLabel="ACTIVE"
        displayLabel={row.original.userStatus === "ACTIVE" ? "Active" : "Inactive"}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <RecycledActionsCell user={row.original} />,
  },
];
