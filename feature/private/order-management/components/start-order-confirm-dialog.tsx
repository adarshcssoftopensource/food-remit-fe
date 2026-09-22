"use client";

import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { Play } from "lucide-react";

interface StartOrderConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderRef: string;
  customerName: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function StartOrderConfirmDialog({
  open,
  onOpenChange,
  orderRef,
  customerName,
  isLoading,
  onConfirm,
}: StartOrderConfirmDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Are you sure you want to start processing Order #${orderRef} for ${customerName}?`}
      description="Once you start this order, its status will change to Processing, and your name will be recorded as the employee who started it. Other employees will no longer be able to start this order."
      confirmLabel="Yes, Start Order"
      cancelLabel="Cancel"
      variant="default"
      isLoading={isLoading}
      icon={<Play className="size-10" />}
      onConfirm={onConfirm}
    />
  );
}
