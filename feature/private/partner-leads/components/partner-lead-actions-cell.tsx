"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeletePartnerLead } from "../hooks/use-delete-partner-lead";
import { PartnerLeadData } from "../types/partner-lead.types";

interface PartnerLeadActionsCellProps {
  lead: PartnerLeadData;
  onView: (id: string) => void;
}

export function PartnerLeadActionsCell({ lead, onView }: PartnerLeadActionsCellProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutateAsync: deleteLead, isPending: isDeleting } = useDeletePartnerLead(lead.id);

  const handleDelete = async () => {
    try {
      await deleteLead();
      setDeleteOpen(false);
      toast.success(`"${lead.businessName}" has been moved to the Recycle Bin.`);
    } catch {
      toast.error(`Failed to delete "${lead.businessName}".`);
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
