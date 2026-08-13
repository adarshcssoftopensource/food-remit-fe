"use client";

import { AlertTriangle } from "lucide-react";
import { type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  variant?: "destructive" | "default";
  icon?: ReactNode;
};

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "destructive",
  icon,
}: ConfirmationDialogProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-0 p-0 shadow-2xl sm:max-w-106.25">
        <div className="relative">
          {/* Subtle top background glow */}
          <div
            className={cn(
              "absolute inset-x-0 -top-10 h-40 w-full rounded-t-3xl blur-3xl",
              variant === "destructive"
                ? "bg-red-500/10 dark:bg-red-500/20"
                : "bg-primary/10 dark:bg-primary/20",
            )}
          />

          <DialogHeader className="relative flex flex-col items-center space-y-4 px-6 pt-10 pb-6 text-center">
            <div
              className={cn(
                "mb-2 flex h-20 w-20 shrink-0 items-center justify-center rounded-full ring-8",
                variant === "destructive"
                  ? "bg-red-100 text-red-600 ring-red-50 dark:bg-red-900/30 dark:text-red-500 dark:ring-red-900/20"
                  : "bg-primary/10 text-primary ring-primary/5 dark:bg-primary/20 dark:ring-primary/10",
              )}
            >
              <div
                className={cn(
                  "[&>svg]:h-10 [&>svg]:w-10",
                  variant === "destructive" ? "[&>svg]:text-red-600" : "[&>svg]:text-primary",
                )}
              >
                {icon ?? <AlertTriangle />}
              </div>
            </div>

            <DialogTitle className="text-2xl font-bold tracking-tight">{title}</DialogTitle>

            <DialogDescription className="text-muted-foreground max-w-75 text-[15px] leading-relaxed">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="bg-muted/40 flex w-full flex-col gap-2 border-t p-4 sm:flex-row sm:gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="hover:bg-accent h-11 flex-1 rounded-xl text-base font-medium shadow-sm transition-all"
            >
              {cancelLabel}
            </Button>

            <Button
              variant={variant}
              onClick={onConfirm}
              isLoading={isLoading}
              className="h-11 flex-1 rounded-xl text-base font-medium shadow-md transition-all hover:brightness-110"
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
