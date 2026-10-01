"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { format } from "date-fns";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/page-header";
import { isTerminalLeadStatus } from "@/constants/partner.leads";
import { AdditionalInfoCard } from "./components/cards/additional-info-card";
import { BusinessOverviewCard } from "./components/cards/business-overview-card";
import { ContactInformationCard } from "./components/cards/contact-information-card";
import { LocationDetailsCard } from "./components/cards/location-details-card";
import { OperationalPreferencesCard } from "./components/cards/operational-preferences-card";
import { KycVerificationCard } from "./components/cards/kyc-verification-card";
import { BankVerificationCard } from "./components/cards/bank-verification-card";
import { AdditionalDocumentsCard } from "./components/cards/additional-documents-card";
import { PartnerLeadDetailSkeleton } from "./components/partner-lead-detail-skeleton";
import { CityWarningBanner, LeadStatusControl } from "./components/partner-lead-detail-sections";
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

            <LeadStatusControl
              lead={lead}
              statusLocked={statusLocked}
              isUpdatingStatus={isUpdatingStatus}
              canUpdateStatus={canUpdateStatus}
              cityWarning={cityWarning}
              onStatusSelect={(value) => {
                setSelectedStatus(value);
                setDialogOpen(true);
              }}
            />
          </div>
        }
      />

      {cityWarning && !statusLocked && (
        <CityWarningBanner
          lead={lead}
          cityWarning={cityWarning}
          cityCreationUrl={cityCreationUrl}
        />
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
