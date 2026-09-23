"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { AlertCircle, Clock, Eye, Landmark, ShieldAlert, ShieldCheck } from "lucide-react";

import { TruncatedTextCell } from "@/components/common/data-table/truncated-text-cell";
import { getStatusColor } from "@/constants/partner.leads";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { PartnerLeadData } from "../types/partner-lead.types";
import { PartnerLeadActionsCell } from "../components/partner-lead-actions-cell";

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
      <div className="flex items-center gap-2.5">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <Image
            src={row.original.storeLogo || "/default-store.svg"}
            alt={row.original.businessName}
            fill
            unoptimized
            className="object-contain p-0.5"
          />
        </div>
        <TruncatedTextCell
          text={row.getValue("businessName")}
          maxWords={8}
          className="cursor-default font-semibold text-slate-800 dark:text-slate-200"
        />
      </div>
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
      if (bankStatus === "SKIPPED" || bankStatus === "PENDING") {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                  <Clock className="size-3 text-amber-600" />
                  Pending Verification
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Bank account verification skipped — pending completion after approval
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {format(date, "MMM dd, yyyy")}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {format(date, "hh:mm a")}
          </span>
        </div>
      );
    },
    enableSorting: true,
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
    id: "approvedBy",
    header: "Approved By",
    cell: ({ row }) => {
      const admin = row.original.approvedByAdmin;
      if (!admin) return <span className="text-xs text-slate-400">—</span>;
      const name = admin.firstName
        ? `${admin.firstName} ${admin.lastName || ""}`.trim()
        : admin.name;
      const roleMap: Record<string, string> = {
        SUPER_ADMIN: "Super Admin",
        SUB_ADMIN: "Sub Admin",
        CO_ADMIN: "Co Admin",
      };
      const roleText = roleMap[admin.userType] || admin.userType;
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{name}</span>
          <span className="inline-flex w-fit items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-700/10 ring-inset dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-400/20">
            {roleText}
          </span>
        </div>
      );
    },
  },
  {
    id: "statusChangedBy",
    header: "Status Changed By",
    cell: ({ row }) => {
      const admin = row.original.statusUpdatedByAdmin;
      if (!admin) return <span className="text-xs text-slate-400">—</span>;
      const name = admin.firstName
        ? `${admin.firstName} ${admin.lastName || ""}`.trim()
        : admin.name;
      const roleMap: Record<string, string> = {
        SUPER_ADMIN: "Super Admin",
        SUB_ADMIN: "Sub Admin",
        CO_ADMIN: "Co Admin",
      };
      const roleText = roleMap[admin.userType] || admin.userType;
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{name}</span>
          <span className="inline-flex w-fit items-center rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-700 ring-1 ring-violet-700/10 ring-inset dark:bg-violet-900/30 dark:text-violet-400 dark:ring-violet-400/20">
            {roleText}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <PartnerLeadActionsCell lead={row.original} onView={onView} />,
  },
];
