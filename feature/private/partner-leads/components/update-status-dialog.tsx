import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getStatusColor } from "@/constants/partner.leads";
import { ROUTES } from "@/config/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MessageSquarePlus, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useApprovePartnerLead } from "../hooks/use-approve-partner-lead";
import { useUpdateLeadStatus } from "../hooks/use-update-lead-status";
import { updateLeadStatusSchema, UpdateLeadStatusValues } from "../schema/update-status.schema";

interface UpdateStatusDialogProps {
  leadId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus: string;
  leadName?: string;
}

export function UpdateStatusDialog({
  leadId,
  open,
  onOpenChange,
  defaultStatus,
  leadName,
}: UpdateStatusDialogProps) {
  const router = useRouter();
  const { updateLeadStatus, isUpdatingStatus } = useUpdateLeadStatus();
  const { mutateAsync: approveLead, isPending: isApproving } = useApprovePartnerLead(leadId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<UpdateLeadStatusValues>({
    resolver: zodResolver(updateLeadStatusSchema),
    defaultValues: { status: defaultStatus, remark: "" },
    mode: "onChange",
  });

  const watchStatus = useWatch({
    control,
    name: "status",
  });

  const isApprovedStatus = watchStatus === "APPROVED";
  const isRejectedStatus = watchStatus === "REJECTED" || watchStatus === "NOT_QUALIFIED";
  const isSubmitting = isUpdatingStatus || isApproving;

  const onSubmit = async (data: UpdateLeadStatusValues) => {
    if (data.status === "APPROVED") {
      try {
        await approveLead({ remark: data.remark });
        toast.success(
          `"${leadName || "Partner lead"}" has been approved. Store and Admin created.`,
        );
        onOpenChange(false);
        reset();
        router.push(ROUTES.ADMIN.PARTNER_LEADS);
      } catch {
        toast.error(`Failed to approve "${leadName || "lead"}".`);
      }
    } else {
      await updateLeadStatus(leadId, data.status, data.remark);
      onOpenChange(false);
      reset();
      if (data.status === "REJECTED" || data.status === "NOT_QUALIFIED") {
        router.push(ROUTES.ADMIN.PARTNER_LEADS);
      }
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden rounded-[2rem] border-slate-200 p-0 shadow-2xl sm:max-w-120">
        <form onSubmit={handleSubmit(onSubmit)} noValidate suppressHydrationWarning>
          <DialogHeader className="border-b border-slate-100 bg-linear-to-br from-slate-50 to-white px-8 py-6">
            <DialogTitle className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-inner ${
                  isApprovedStatus
                    ? "border-emerald-200 bg-emerald-100/60"
                    : isRejectedStatus
                      ? "border-rose-200 bg-rose-100/60"
                      : "border-blue-200 bg-blue-100/50"
                }`}
              >
                {isApprovedStatus ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                ) : (
                  <MessageSquarePlus
                    className={`h-5 w-5 ${isRejectedStatus ? "text-rose-700" : "text-blue-700"}`}
                  />
                )}
              </div>
              {isApprovedStatus
                ? "Approve Partner Lead"
                : isRejectedStatus
                  ? "Reject Partner Lead"
                  : "Update Lead Status"}
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm leading-relaxed font-medium text-slate-500">
              {isApprovedStatus ? (
                <>
                  You are approving this partner lead. This will create their Store and Admin
                  account. Please provide an approval description/remark, which will also be{" "}
                  <strong className="text-emerald-700 dark:text-emerald-400">
                    included in the welcome email
                  </strong>{" "}
                  sent to the partner.
                </>
              ) : isRejectedStatus ? (
                <>
                  You are rejecting this partner lead. It will move to the{" "}
                  <strong className="text-rose-700">Rejected</strong> tab and the status will be{" "}
                  <strong>locked</strong> — no further status changes will be allowed.
                </>
              ) : (
                <>
                  You are updating this lead&apos;s status to{" "}
                  <Badge
                    variant="outline"
                    className={`mx-1 font-bold ${watchStatus ? getStatusColor(watchStatus) : ""}`}
                  >
                    {watchStatus ? watchStatus.replace(/_/g, " ") : ""}
                  </Badge>
                  . Please provide a mandatory remark explaining this change to your team.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-white px-8 py-6">
            <div className="flex flex-col gap-2">
              <Controller
                name="remark"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="remark"
                      className="flex justify-between text-sm font-bold text-slate-700"
                    >
                      <span>
                        {isApprovedStatus
                          ? "Approval Description / Remark"
                          : isRejectedStatus
                            ? "Rejection Remark"
                            : "Status Remark"}{" "}
                        <span className="text-red-500">*</span>
                      </span>
                      {isApprovedStatus && (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          Included in Partner Email
                        </span>
                      )}
                    </Label>
                    <Textarea
                      {...field}
                      id="remark"
                      placeholder={
                        isApprovedStatus
                          ? "E.g. Congratulations! Your partnership application has been approved. Welcome to Food Remit..."
                          : isRejectedStatus
                            ? "E.g. Application does not meet current partnership requirements..."
                            : "E.g. Spoke with the owner, they are ready for registration..."
                      }
                      aria-invalid={!!errors.remark}
                      className={`min-h-30 resize-none rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium transition-colors duration-300 placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 ${
                        isApprovedStatus
                          ? "focus-visible:border-emerald-600 focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(16,185,129,0.1)] focus-visible:ring-emerald-600/20"
                          : isRejectedStatus
                            ? "focus-visible:border-rose-600 focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(225,29,72,0.1)] focus-visible:ring-rose-600/20"
                            : "focus-visible:border-blue-600 focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] focus-visible:ring-blue-600/20"
                      } ${
                        errors.remark
                          ? "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:shadow-[0_0_0_4px_rgba(248,113,113,0.1)] focus-visible:ring-red-400/15"
                          : ""
                      }`}
                    />
                    {errors.remark && (
                      <p className="mt-1 text-xs font-semibold text-red-500">
                        {errors.remark.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-8 py-5 backdrop-blur-sm">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => handleOpenChange(false)}
              className="h-12 rounded-xl bg-white px-6 font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={`h-12 rounded-xl px-6 font-bold text-white shadow-md transition-colors transition-shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0 ${
                isApprovedStatus
                  ? "bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-700"
                  : isRejectedStatus
                    ? "bg-rose-600 shadow-rose-600/20 hover:bg-rose-700"
                    : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? (
                "Processing..."
              ) : isApprovedStatus ? (
                <span className="flex items-center gap-2">
                  <Send className="size-4" />
                  Approve & Send Email
                </span>
              ) : isRejectedStatus ? (
                "Reject Lead"
              ) : (
                "Save Status"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
