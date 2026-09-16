"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleCheck, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeletePartnerLead } from "../hooks/use-delete-partner-lead";
import { useApprovePartnerLead } from "../hooks/use-approve-partner-lead";
import { PartnerLeadData } from "../types/partner-lead.types";

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

  return (
    <div className="flex items-center gap-1.5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={() => onView(lead.id)}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-xs transition-colors hover:bg-emerald-100 hover:text-emerald-700"
            title="View Details"
          >
            <Eye className="size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>View Details</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            onClick={() => setApproveOpen(true)}
            disabled={isApproving || lead.status === "APPROVED"}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-blue-200 text-blue-500 shadow-xs transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-blue-950/30"
            title="Approve Lead"
          >
            <CircleCheck size={20} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Approve Lead</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            onClick={() => setDeleteOpen(true)}
            disabled={isDeleting}
            className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-slate-200 text-slate-500 shadow-xs transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-red-950/30"
            title="Delete Lead"
          >
            <Trash2 className="size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Lead</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <ConfirmationDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        title="Approve Partner Lead"
        description={`Are you sure you want to approve "${lead.businessName}"? This will create a Store and a Store Admin account, and email the login credentials to the user.`}
        confirmLabel="Approve Lead"
        onConfirm={handleApprove}
        isLoading={isApproving}
      />

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
    </div>
  );
}
