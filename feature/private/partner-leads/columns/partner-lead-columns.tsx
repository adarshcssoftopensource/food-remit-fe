"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Eye } from "lucide-react";

import { getStatusColor } from "@/constants/partner.leads";
import { ColumnDef } from "@tanstack/react-table";
import { PartnerLeadData } from "../types/partner-lead.types";

export const getPartnerLeadColumns = (
  onView: (id: string) => void,
): ColumnDef<PartnerLeadData>[] => [
  {
    accessorKey: "referenceNumber",
    header: "Ref No.",
    cell: ({ row }) => <div className="text-xs font-medium">{row.getValue("referenceNumber")}</div>,
  },
  {
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }) => <div className="font-semibold">{row.getValue("businessName")}</div>,
  },
  {
    accessorKey: "firstName",
    header: "Contact",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex flex-col text-sm">
          <span>
            {data.firstName} {data.lastName}
          </span>
          <span className="text-muted-foreground text-xs">{data.businessEmail}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Applied",
    cell: ({ row }) => (
      <div className="text-sm">
        {format(new Date(row.getValue("createdAt") as string), "MMM dd, yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none ${getStatusColor(status)}`}
        >
          {status.replace(/_/g, " ")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const lead = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              onClick={() => onView(lead.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm transition-colors hover:bg-emerald-100 hover:text-emerald-700"
            >
              <Eye className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
