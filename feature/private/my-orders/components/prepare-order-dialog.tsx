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
import { useUpdateOrderStatus } from "@/feature/private/order-management/hooks/use-update-order-status";
import { Loader2 } from "lucide-react";

interface PrepareOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PrepareOrderDialog({ orderId, open, onOpenChange }: PrepareOrderDialogProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handlePrepare = () => {
    updateStatus(
      { orderId, orderStatus: 2 }, // 2 = Preparing
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Prepare Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to mark this order as preparing? This will update the order status
            for the customer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handlePrepare}
            variant={"secondary"}
            disabled={isPending}
            className="bg-amber-600 text-white hover:bg-amber-700"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Preparing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
