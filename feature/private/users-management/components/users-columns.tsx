"use client";

import { ColumnDef } from "@tanstack/react-table";
import { UserData } from "@/constants/users-management";
import { Switch } from "@/components/ui/switch";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export const usersColumns: ColumnDef<UserData>[] = [
  {
    accessorKey: "id",
    header: "User ID",
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "userType",
    header: "User Type",
  },
  {
    accessorKey: "email",
    header: "Email Address",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "registeredOn",
    header: "Registered On",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-orange-500 hover:bg-orange-50 hover:text-orange-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Switch checked={status === "Active"} className="data-[state=checked]:bg-green-500" />
        </div>
      );
    },
  },
];
