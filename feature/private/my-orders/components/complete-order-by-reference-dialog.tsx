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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getCompleteByReferenceErrorMessage,
  useCompleteOrderByReference,
} from "@/feature/private/order-management/hooks/use-complete-order-by-reference";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CompleteOrderByReferenceDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maskedHint?: string;
}

export function CompleteOrderByReferenceDialog({
  orderId,
  open,
  onOpenChange,
  maskedHint,
}: CompleteOrderByReferenceDialogProps) {
  const { mutateAsync: completeByReference, isPending } = useCompleteOrderByReference();
  const [referenceNumber, setReferenceNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const resetForm = () => {
    setReferenceNumber("");
    setError(null);
    setVerified(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (isPending) return;
    if (!next) resetForm();
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = referenceNumber.trim();
    if (!value) {
      setError("Reference number is required.");
      return;
    }

    setError(null);
    try {
      await completeByReference({ orderId, referenceNumber: value });
      setVerified(true);
      toast.success("Order completed successfully.");
      window.setTimeout(() => {
        resetForm();
        onOpenChange(false);
      }, 650);
    } catch (err) {
      setError(getCompleteByReferenceErrorMessage(err));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden rounded-2xl p-0 sm:max-w-md">
        <div className="bg-linear-to-br from-emerald-500/12 via-teal-500/8 to-transparent px-6 pt-6 pb-4">
          <DialogHeader className="gap-3 text-left">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20">
                <ShieldCheck className="size-5" />
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-lg font-bold tracking-tight">
                  Complete Order
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Enter the full reference number to verify and complete this order.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {verified ? (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle2 className="size-4 shrink-0" />
              Reference number verified successfully.
            </div>
          ) : (
            <div className="space-y-2">
              <Label
                htmlFor="referenceNumber"
                className="text-xs font-bold tracking-wide uppercase"
              >
                Enter Reference Number
              </Label>
              <Input
                id="referenceNumber"
                value={referenceNumber}
                onChange={(e) => {
                  setReferenceNumber(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. SE2289380372"
                autoComplete="off"
                disabled={isPending}
                aria-invalid={Boolean(error)}
                className="h-11 rounded-xl font-mono tracking-wide"
              />
              {error ? (
                <p className="text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                  {error}
                </p>
              ) : (
                <p className="text-xs text-slate-500"></p>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 border-t border-slate-100 pt-4 sm:gap-2 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={isPending || verified}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || verified || !referenceNumber.trim()}
              className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <ShieldCheck className="mr-2 size-4" />
              )}
              Verify & Complete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
