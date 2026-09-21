"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeletePartnerLead } from "../hooks/use-delete-partner-lead";
import { useApprovePartnerLead } from "../hooks/use-approve-partner-lead";
import { PartnerLeadData } from "../types/partner-lead.types";

import {
  DataTableRowActions,
  type DataTableRowActionItem,
} from "@/components/common/data-table/data-table-row-actions";

interface PartnerLeadActionsCellProps {
  lead: PartnerLeadData;
  onView: (id: string) => void;
}

export function PartnerLeadActionsCell({ lead, onView }: PartnerLeadActionsCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const { mutateAsync: deleteLead, isPending: isDeleting } = useDeletePartnerLead(lead.id);
  const { mutateAsync: approveLead, isPending: isApproving } = useApprovePartnerLead(lead.id);

  const handleDelete = async () => {
    try {
      await deleteLead();
      setDeleteOpen(false);
      toast.success(`"${lead.businessName}" has been moved to the Recycle Bin.`);
    } catch {
      toast.error(`Failed to delete "${lead.businessName}".`);
    }
  };

  const handleApprove = async () => {
    try {
      await approveLead();
      setApproveOpen(false);
      toast.success(`"${lead.businessName}" has been approved. Store and Admin created.`);
    } catch {
      toast.error(`Failed to approve "${lead.businessName}".`);
    }
  };

  const isApproved = lead.status === "APPROVED";

  const actionItems: DataTableRowActionItem[] = [
    {
      label: "View Details",
      icon: <Eye className="size-4" />,
      onClick: () => onView(lead.id),
    },
    {
      label: "Delete Lead",
      icon: <Trash2 className="size-4" />,
      onClick: () => setDeleteOpen(true),
      variant: "destructive",
      disabled: isDeleting,
      hidden: isApproved,
    },
  ];

  return (
    <>
      <DataTableRowActions items={actionItems} />

      <ConfirmationDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve Partner Lead"
        description={`Are you sure you want to approve "${lead.businessName}"? This will create a Store and a Store Admin account, and email the login credentials to the user.`}
        confirmLabel="Approve Lead"
        onConfirm={handleApprove}
        isLoading={isApproving}
      />

      {!isApproved && (
        <ConfirmationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete Partner Lead"
          description={`Are you sure you want to delete "${lead.businessName}"? It will be moved to the Recycle Bin and can be restored or permanently deleted from there.`}
          confirmLabel="Delete Lead"
          onConfirm={handleDelete}
          isLoading={isDeleting}
          variant="destructive"
        />
      )}
    </>
  );
}
