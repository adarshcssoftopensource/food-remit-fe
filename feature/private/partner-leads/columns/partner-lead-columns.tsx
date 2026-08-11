"use client";

// Select component removed
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const PARTNER_LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "REGISTRATION_INVITED",
  "REGISTRATION_STARTED",
  "APPROVED",
  "NOT_QUALIFIED",
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
    case "CONTACTED":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
    case "QUALIFIED":
      return "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100";
    case "REGISTRATION_INVITED":
      return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
    case "REGISTRATION_STARTED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100";
    case "APPROVED":
      return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
    case "NOT_QUALIFIED":
      return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
  }
};

export const getPartnerLeadColumns = (onView: (id: string) => void): any[] => [
  {
    accessorKey: "referenceNumber",
    header: "Ref No.",
    cell: ({ row }: any) => (
      <div className="text-xs font-medium">{row.getValue("referenceNumber")}</div>
    ),
  },
  {
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }: any) => <div className="font-semibold">{row.getValue("businessName")}</div>,
  },
  {
    accessorKey: "firstName",
    header: "Contact",
    cell: ({ row }: any) => {
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
    cell: ({ row }: any) => (
      <div className="text-sm">{format(new Date(row.getValue("createdAt")), "MMM dd, yyyy")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: any) => {
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
    cell: ({ row }: any) => {
      const lead = row.original;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={() => onView(lead.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm transition-colors hover:bg-emerald-100 hover:text-emerald-700"
              >
                <Eye className="h-4 w-4" />
              </button>
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
