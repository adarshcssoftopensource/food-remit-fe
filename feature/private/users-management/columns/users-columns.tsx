import { StatusBadge } from "@/components/common/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/date";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ActionsCell } from "../components/actions-cell";
import { UserData } from "../types/user.types";

export const usersColumns = (onImageClick?: (image: string) => void): ColumnDef<UserData>[] => [
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
          <div className="group relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image
              src={row.original.profileImage}
              alt={`${row.original.firstName} ${row.original.lastName}`}
              className="h-full w-full object-cover"
              width={40}
              height={40}
            />
            {onImageClick && (
              <button
                onClick={() => row.original.profileImage && onImageClick(row.original.profileImage)}
                className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100"
                title="View full screen"
              >
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </button>
            )}
          </div>
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
    cell: ({ row }) => (
      <span className="text-sm text-slate-700">
        {row.original.countryCode} {row.original.phoneNumber}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Registered On",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="pl-3 text-xs text-slate-500">{formatDate(row.original.createdAt)}</span>
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
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
];
