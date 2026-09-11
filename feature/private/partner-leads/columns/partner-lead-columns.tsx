"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { AlertCircle, Clock, Eye, Landmark, ShieldAlert, ShieldCheck } from "lucide-react";

import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { getStatusColor } from "@/constants/partner.leads";
import { ColumnDef } from "@tanstack/react-table";
import { PartnerLeadData } from "../types/partner-lead.types";

export const getPartnerLeadColumns = (
  onView: (id: string) => void,
): ColumnDef<PartnerLeadData>[] => [
  {
    accessorKey: "referenceNumber",
    header: "Ref No.",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
        {row.getValue("referenceNumber")}
      </span>
    ),
  },
  {
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }) => (
      <TruncatedTextCell
        text={row.getValue("businessName")}
        maxWords={8}
        className="cursor-default font-semibold text-slate-800 dark:text-slate-200"
      />
    ),
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
    accessorKey: "kycStatus",
    header: "KYC Status",
    cell: ({ row }) => {
      const kycStatus = (row.original.kycStatus || "NOT_STARTED").toUpperCase();
      if (kycStatus === "APPROVED") {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <ShieldCheck className="size-3 text-emerald-600" />
            Verified
          </span>
        );
      }
      if (kycStatus === "SUBMITTED" || kycStatus === "IN_PROGRESS" || kycStatus === "STARTED") {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
            <Clock className="size-3 text-amber-600" />
            In Review
          </span>
        );
      }
      if (kycStatus === "DECLINED") {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
            <AlertCircle className="size-3 text-rose-600" />
            Declined
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <ShieldAlert className="size-3 text-slate-400" />
          Not Started
        </span>
      );
    },
  },
  {
    accessorKey: "bankStatus",
    header: "Bank Status",
    cell: ({ row }) => {
      const bankStatus = (row.original.bankStatus || "NOT_STARTED").toUpperCase();
      if (bankStatus === "VERIFIED") {
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
            <Landmark className="size-3 text-emerald-600" />
            Connected
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <Landmark className="size-3 text-slate-400" />
          Not Linked
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Applied",
    cell: ({ row }) => (
      <div className="text-xs text-slate-600 dark:text-slate-400">
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
