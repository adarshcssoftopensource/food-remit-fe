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
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-0 p-0 shadow-2xl">
        <div>
          <DialogHeader className="p-6 pb-5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1",
                  variant === "destructive"
                    ? "bg-red-100 text-red-600 ring-red-200"
                    : "bg-primary/10 text-primary ring-primary/20",
                )}
              >
                {icon ?? <AlertTriangle className="h-6 w-6" />}
              </div>

              <DialogTitle className="text-xl leading-none font-semibold">{title}</DialogTitle>
            </div>

            <DialogDescription className="text-muted-foreground pl-15 text-sm leading-6">
              {description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="bg-background/70 border-t px-6 py-4 backdrop-blur sm:justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="rounded-xl"
            >
              {cancelLabel}
            </Button>

            <Button
              variant={variant}
              onClick={onConfirm}
              isLoading={isLoading}
              className="rounded-xl"
            >
              {confirmLabel}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
