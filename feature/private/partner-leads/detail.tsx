"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Activity } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { usePartnerLead } from "./hooks/use-get-partner-lead";
import { useUpdateLeadStatus } from "./hooks/use-update-lead-status";
import { UpdateStatusDialog } from "./components/update-status-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PARTNER_LEAD_STATUSES, getStatusColor } from "@/constants/partner.leads";
import { BusinessOverviewCard } from "./components/cards/business-overview-card";
import { ContactInformationCard } from "./components/cards/contact-information-card";
import { LocationDetailsCard } from "./components/cards/location-details-card";
import { OperationalPreferencesCard } from "./components/cards/operational-preferences-card";
import { AdditionalInfoCard } from "./components/cards/additional-info-card";

interface PartnerLeadDetailProps {
  id: string;
}

export function PartnerLeadDetail({ id }: PartnerLeadDetailProps) {
  const router = useRouter();
  const { lead, isLoading } = usePartnerLead(id);
  const { isUpdatingStatus } = useUpdateLeadStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  if (!isLoading) {
    return (
      <div className="space-y-6">
        <div className="mt-6 flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-slate-700">Lead not found</h2>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-6 pb-10">
      {dialogOpen && (
        <UpdateStatusDialog
          leadId={lead.id}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultStatus={selectedStatus}
        />
      )}

      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-8 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-12 w-12 rounded-2xl border-slate-200 bg-white p-0 text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
            title="Go Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-900">
              {lead.businessName}
            </h1>
            <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-slate-500">
              <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-slate-600">
                Ref: {lead.referenceNumber}
              </span>
              <span className="text-slate-300">•</span>
              Applied on {format(new Date(lead.createdAt), "MMMM do, yyyy")}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center self-start rounded-[1.25rem] border border-slate-200 bg-white p-1.5 shadow-sm md:self-auto">
          <Select
            value={lead.status}
            disabled={isUpdatingStatus}
            onValueChange={(value) => {
              if (value && value !== lead.status) {
                setSelectedStatus(value);
                setDialogOpen(true);
              }
            }}
          >
            <SelectTrigger
              className={`h-11 w-65 rounded-[1rem] border-0 px-4 font-extrabold transition-all hover:bg-slate-50 focus:ring-4 focus:ring-blue-500/20 ${getStatusColor(lead.status)}`}
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
              {PARTNER_LEAD_STATUSES.map((s) => (
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
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <BusinessOverviewCard lead={lead} />
        <ContactInformationCard lead={lead} />
        <LocationDetailsCard lead={lead} />
        <OperationalPreferencesCard lead={lead} />
        <AdditionalInfoCard lead={lead} />
      </div>
    </div>
  );
}
