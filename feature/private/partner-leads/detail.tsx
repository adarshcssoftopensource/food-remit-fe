"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Activity, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PARTNER_LEAD_STATUSES, getStatusColor } from "@/constants/partner.leads";
import { AdditionalInfoCard } from "./components/cards/additional-info-card";
import { BusinessOverviewCard } from "./components/cards/business-overview-card";
import { ContactInformationCard } from "./components/cards/contact-information-card";
import { LocationDetailsCard } from "./components/cards/location-details-card";
import { OperationalPreferencesCard } from "./components/cards/operational-preferences-card";
import { PartnerLeadDetailSkeleton } from "./components/partner-lead-detail-skeleton";
import { PageHeader } from "@/components/common/page-header";
import { UpdateStatusDialog } from "./components/update-status-dialog";
import { usePartnerLead } from "./hooks/use-get-partner-lead";
import { useUpdateLeadStatus } from "./hooks/use-update-lead-status";

interface PartnerLeadDetailProps {
  id: string;
}

export function PartnerLeadDetail({ id }: PartnerLeadDetailProps) {
  const router = useRouter();
  const { lead, isLoading } = usePartnerLead(id);
  const { isUpdatingStatus } = useUpdateLeadStatus();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  if (isLoading) {
    return <PartnerLeadDetailSkeleton />;
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
    <div>
      {dialogOpen && (
        <UpdateStatusDialog
          leadId={lead.id}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultStatus={selectedStatus}
        />
      )}

      <PageHeader
        title={lead.businessName}
        description={`Ref: ${lead.referenceNumber} • Applied on ${format(new Date(lead.createdAt), "MMMM do, yyyy")}`}
        breadcrumbs={[
          { label: "Partner Leads", href: ROUTES.ADMIN.PARTNER_LEADS },
          { label: "Lead Details" },
        ]}
        className="mb-6 border-b border-slate-100 pb-8"
        action={
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
        }
      />

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
