"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { format } from "date-fns";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Lock,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getStatusColor,
  isTerminalLeadStatus,
  PARTNER_LEAD_MUTABLE_STATUSES,
} from "@/constants/partner.leads";
import { AdditionalInfoCard } from "./components/cards/additional-info-card";
import { BusinessOverviewCard } from "./components/cards/business-overview-card";
import { ContactInformationCard } from "./components/cards/contact-information-card";
import { LocationDetailsCard } from "./components/cards/location-details-card";
import { OperationalPreferencesCard } from "./components/cards/operational-preferences-card";
import { KycVerificationCard } from "./components/cards/kyc-verification-card";
import { BankVerificationCard } from "./components/cards/bank-verification-card";
import { AdditionalDocumentsCard } from "./components/cards/additional-documents-card";
import { PartnerLeadDetailSkeleton } from "./components/partner-lead-detail-skeleton";
import { UpdateStatusDialog } from "./components/update-status-dialog";
import { usePartnerLead } from "./hooks/use-get-partner-lead";
import { useUpdateLeadStatus } from "./hooks/use-update-lead-status";
import { useDeletePartnerLead } from "./hooks/use-delete-partner-lead";

interface PartnerLeadDetailProps {
  id: string;
}

export function PartnerLeadDetail({ id }: PartnerLeadDetailProps) {
  const router = useRouter();
  const { lead, isLoading } = usePartnerLead(id);
  const { isUpdatingStatus } = useUpdateLeadStatus();
  const { mutateAsync: deleteLead, isPending: isDeleting } = useDeletePartnerLead(id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const handleDelete = async () => {
    try {
      await deleteLead();
      setDeleteOpen(false);
      toast.success(`"${lead?.businessName || "Partner lead"}" has been moved to the Recycle Bin.`);
      router.push(ROUTES.ADMIN.PARTNER_LEADS);
    } catch {
      toast.error(`Failed to delete "${lead?.businessName || "lead"}".`);
    }
  };

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

  const statusLocked = isTerminalLeadStatus(lead.status);
  const isApproved = lead.status === "APPROVED";
  const canUpdateStatus = lead.cityCoverage ? lead.cityCoverage.canUpdateStatus : true;
  const cityWarning = lead.cityCoverage?.warningMessage;
  const cityCreationUrl = `${ROUTES.ADMIN.SETTINGS}?tab=cities`;

  return (
    <div>
      {dialogOpen && !statusLocked && (
        <UpdateStatusDialog
          leadId={lead.id}
          leadName={lead.businessName}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultStatus={selectedStatus}
        />
      )}

      {!isApproved && (
        <ConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Partner Lead"
          description={`Are you sure you want to delete "${lead.businessName}"? It will be moved to the Recycle Bin and can be restored back to the same ${lead.status.replace(/_/g, " ").toLowerCase()} bucket.`}
          confirmLabel="Delete Lead"
          onConfirm={handleDelete}
          isLoading={isDeleting}
          variant="destructive"
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
          <div className="flex flex-wrap items-center gap-3">
            {!isApproved && (
              <Button
                variant="outline"
                className="h-11 rounded-[1rem] border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/30"
                onClick={() => setDeleteOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Lead
              </Button>
            )}

            {statusLocked ? (
              <div
                className={`inline-flex h-11 items-center gap-2.5 rounded-[1.25rem] border px-4 font-extrabold shadow-sm ${getStatusColor(lead.status)}`}
                title="Status is locked after approve/reject"
              >
                <Lock className="h-4 w-4 opacity-75" />
                <span>{lead.status.replace(/_/g, " ")}</span>
              </div>
            ) : (
              <div className="flex shrink-0 items-center self-start rounded-[1.25rem] border border-slate-200 bg-white p-1.5 shadow-sm md:self-auto">
                <Select
                  value={lead.status}
                  disabled={isUpdatingStatus || !canUpdateStatus}
                  onValueChange={(value) => {
                    if (value && value !== lead.status && canUpdateStatus) {
                      setSelectedStatus(value);
                      setDialogOpen(true);
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
                    title={
                      !canUpdateStatus
                        ? cityWarning || "City does not exist in the system"
                        : undefined
                    }
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
            )}
          </div>
        }
      />

      {cityWarning && !statusLocked && (
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-amber-300/90 bg-linear-to-r from-amber-50 via-amber-50/80 to-orange-50/60 p-4.5 text-amber-950 shadow-sm transition-all sm:flex sm:items-center sm:justify-between dark:border-amber-800/60 dark:from-amber-950/40 dark:via-amber-950/20 dark:to-orange-950/30 dark:text-amber-200">
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
              className="inline-flex h-10 shrink-0 flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4.5 text-xs font-bold whitespace-nowrap text-white shadow-md shadow-amber-600/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-amber-700 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-600/35 active:translate-y-0"
            >
              <PlusCircle className="size-4 shrink-0 text-white" />
              <span className="font-bold whitespace-nowrap text-white">Create City</span>
              <ArrowRight className="size-3.5 shrink-0 text-white/90" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <KycVerificationCard lead={lead} />
        <BankVerificationCard lead={lead} />
        <AdditionalDocumentsCard lead={lead} />
        <BusinessOverviewCard lead={lead} />
        <ContactInformationCard lead={lead} />
        <LocationDetailsCard lead={lead} />
        <OperationalPreferencesCard lead={lead} />
        <AdditionalInfoCard lead={lead} />
      </div>
    </div>
  );
}
