"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusColor, PARTNER_LEAD_MUTABLE_STATUSES } from "@/constants/partner.leads";
import { Activity, AlertTriangle, ArrowRight, Lock, PlusCircle } from "lucide-react";
import Link from "next/link";
import { PartnerLeadData } from "../types/partner-lead.types";

interface LeadStatusControlProps {
  lead: PartnerLeadData;
  statusLocked: boolean;
  isUpdatingStatus: boolean;
  canUpdateStatus: boolean;
  cityWarning: string | null | undefined;
  onStatusSelect: (value: string) => void;
}

export function LeadStatusControl({
  lead,
  statusLocked,
  isUpdatingStatus,
  canUpdateStatus,
  cityWarning,
  onStatusSelect,
}: LeadStatusControlProps) {
  if (statusLocked) {
    return (
      <div
        className={`inline-flex h-11 items-center gap-2.5 rounded-[1.25rem] border px-4 font-extrabold shadow-sm ${getStatusColor(lead.status)}`}
        title="Status is locked after approve/reject"
      >
        <Lock className="h-4 w-4 opacity-75" />
        <span>{lead.status.replace(/_/g, " ")}</span>
      </div>
    );
  }
  return (
    <div className="flex shrink-0 items-center self-start rounded-[1.25rem] border border-slate-200 bg-white p-1.5 shadow-sm md:self-auto">
      <Select
        value={lead.status}
        disabled={isUpdatingStatus || !canUpdateStatus}
        onValueChange={(value) => {
          if (value && value !== lead.status && canUpdateStatus) {
            onStatusSelect(value);
          }
        }}
      >
        <SelectTrigger
          disabled={isUpdatingStatus || !canUpdateStatus}
          className={`h-11 w-65 rounded-[1rem] border-0 px-4 font-extrabold transition-all ${
            !canUpdateStatus
              ? "cursor-not-allowed border border-amber-300 bg-amber-50/70 text-amber-800 opacity-60 shadow-none hover:bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
              : `hover:bg-slate-50 focus:ring-4 focus:ring-blue-500/20 ${getStatusColor(lead.status)}`
          }`}
          title={!canUpdateStatus ? cityWarning || "City does not exist in the system" : undefined}
        >
          <div className="flex items-center gap-2.5">
            <Activity className="h-4.5 w-4.5 opacity-75" />
            <SelectValue placeholder="Status" />
          </div>
        </SelectTrigger>
        <SelectContent
          alignItemWithTrigger={false}
          sideOffset={8}
          className="min-w-65 rounded-2xl border-slate-200 p-1.5 shadow-2xl"
        >
          {PARTNER_LEAD_MUTABLE_STATUSES.map((s) => (
            <SelectItem
              key={s}
              value={s}
              className={`my-0.5 cursor-pointer rounded-xl px-4 py-3 text-sm font-bold transition-colors focus:bg-slate-100 ${s === lead.status ? "bg-blue-50/50 text-blue-900" : "text-slate-700"}`}
            >
              {s.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface CityWarningBannerProps {
  lead: PartnerLeadData;
  cityWarning: string;
  cityCreationUrl: string;
}

export function CityWarningBanner({ lead, cityWarning, cityCreationUrl }: CityWarningBannerProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-amber-300/90 bg-linear-to-r from-amber-50 via-amber-50/80 to-orange-50/60 p-4.5 text-amber-950 shadow-sm transition sm:flex sm:items-center sm:justify-between dark:border-amber-800/60 dark:from-amber-950/40 dark:via-amber-950/20 dark:to-orange-950/30 dark:text-amber-200">
      <div className="flex items-start gap-3.5 pr-4">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/90 text-amber-900 shadow-inner dark:bg-amber-900/70 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold tracking-tight text-amber-950 dark:text-amber-100">
            {cityWarning}
          </h4>
          <p className="mt-1 text-xs leading-relaxed font-medium text-amber-900/80 dark:text-amber-300/80">
            City:{" "}
            <strong className="font-bold text-amber-950 dark:text-white">
              &quot;{lead.businessCity || "Not provided"}&quot;
            </strong>
            {lead.country ? ` • Country: ${lead.country}` : ""}. The Status dropdown remains
            disabled until this city is added under the City Creation tab.
          </p>
        </div>
      </div>
      <div className="mt-3 flex shrink-0 items-center sm:mt-0">
        <Link
          href={cityCreationUrl}
          className="inline-flex h-10 shrink-0 flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4.5 text-xs font-bold whitespace-nowrap text-white shadow-md shadow-amber-600/25 transition duration-200 hover:-translate-y-0.5 hover:from-amber-700 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-600/35 active:translate-y-0"
        >
          <PlusCircle className="size-4 shrink-0 text-white" />
          <span className="font-bold whitespace-nowrap text-white">Create City</span>
          <ArrowRight className="size-3.5 shrink-0 text-white/90" />
        </Link>
      </div>
    </div>
  );
}
