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
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquarePlus } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useUpdateLeadStatus } from "../hooks/use-update-lead-status";
import { updateLeadStatusSchema, UpdateLeadStatusValues } from "../schema/update-status.schema";
import { getStatusColor } from "@/constants/partner.leads";

interface UpdateStatusDialogProps {
  leadId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatus: string;
}

export function UpdateStatusDialog({
  leadId,
  open,
  onOpenChange,
  defaultStatus,
}: UpdateStatusDialogProps) {
  const { updateLeadStatus, isUpdatingStatus } = useUpdateLeadStatus();

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

  const onSubmit = async (data: UpdateLeadStatusValues) => {
    await updateLeadStatus(leadId, data.status, data.remark);
    onOpenChange(false);
    reset();
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden rounded-[2rem] border-slate-200 p-0 shadow-2xl sm:max-w-[480px]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate suppressHydrationWarning>
          <DialogHeader className="border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-8 py-6">
            <DialogTitle className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-100/50 shadow-inner">
                <MessageSquarePlus className="h-5 w-5 text-blue-700" />
              </div>
              Update Lead Status
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm leading-relaxed font-medium text-slate-500">
              You are updating this lead&apos;s status to{" "}
              <Badge
                variant="outline"
                className={`mx-1 font-bold ${watchStatus ? getStatusColor(watchStatus) : ""}`}
              >
                {watchStatus ? watchStatus.replace(/_/g, " ") : ""}
              </Badge>
              . Please provide a mandatory remark explaining this change to your team.
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
                        Status Remark <span className="text-red-500">*</span>
                      </span>
                    </Label>
                    <Textarea
                      {...field}
                      id="remark"
                      placeholder="E.g. Spoke with the owner, they are ready for registration..."
                      aria-invalid={!!errors.remark}
                      className={`min-h-[120px] resize-none rounded-xl border-slate-200 bg-slate-50/50 text-sm font-medium transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 hover:bg-slate-50 focus-visible:border-blue-600 focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] focus-visible:ring-blue-600/20 ${
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
              onClick={() => handleOpenChange(false)}
              className="h-12 rounded-xl bg-white px-6 font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdatingStatus || !isValid}
              className="h-12 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isUpdatingStatus ? "Saving..." : "Save Status"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
