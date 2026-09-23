"use client";

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
import { useMarkOrderAbandoned } from "@/feature/private/order-management/hooks/use-order-lifecycle";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

interface AbandonOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderRef?: string;
}

export function AbandonOrderDialog({
  orderId,
  open,
  onOpenChange,
  orderRef,
}: AbandonOrderDialogProps) {
  const { mutateAsync: markAbandoned, isPending } = useMarkOrderAbandoned();
  const [remark, setRemark] = useState("");
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setRemark("");
    setError(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const handleConfirm = async () => {
    const value = remark.trim();
    if (!value) {
      setError("Remark is required to abandon this order.");
      return;
    }
    setError(null);
    try {
      await markAbandoned({ orderId, reason: value });
      reset();
      onOpenChange(false);
    } catch {
      // toast handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl p-0 sm:max-w-md">
        <div className="bg-linear-to-br from-red-500/12 via-orange-500/8 to-transparent px-6 pt-6 pb-4">
          <DialogHeader className="gap-3 text-left">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-600 ring-1 ring-red-500/20">
                <AlertTriangle className="size-5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-bold tracking-tight">
                  Abandon Order
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {orderRef
                    ? `Order #${orderRef} will be closed as Abandoned. Sender and receiver will be emailed with your remark.`
                    : "This order will be closed as Abandoned. Sender and receiver will be emailed with your remark."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="abandonRemark" className="text-xs font-bold tracking-wide uppercase">
              Remark <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="abandonRemark"
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Customer did not collect within 5 days"
              rows={4}
              disabled={isPending}
              className="resize-none rounded-xl"
            />
            {error ? (
              <p className="text-xs font-medium text-red-600" role="alert">
                {error}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500">
                This remark is required and will be included in the abandon emails.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 border-t border-slate-100 pt-4 sm:gap-2 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="rounded-xl"
              disabled={isPending || !remark.trim()}
              onClick={() => void handleConfirm()}
            >
              {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
              Abandon Order
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
