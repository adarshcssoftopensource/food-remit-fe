"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCompleteOrder } from "@/feature/private/order-management/hooks/use-complete-order";
import { useGetOrder } from "@/feature/private/order-management/hooks/use-get-order";
import { OrderDataItem } from "@/feature/private/order-management/types/order.types";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CompleteOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompleteOrderDialog({ orderId, open, onOpenChange }: CompleteOrderDialogProps) {
  const { data: orderData, isLoading } = useGetOrder(orderId);
  const { mutate: completeOrder, isPending } = useCompleteOrder();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const items = orderData?.items || [];

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedItems([]);
    }
    onOpenChange(newOpen);
  };

  const toggleItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleComplete = () => {
    completeOrder(
      { orderId, availableItemIds: selectedItems },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const allSelected = items.length > 0 && selectedItems.length === items.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Complete Order</DialogTitle>
          <DialogDescription>
            Please check off the items that are available. Any unchecked items will be marked as out
            of stock, and the customer will be automatically partially refunded.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4 pr-2">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No items found for this order.
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item: OrderDataItem) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 rounded-xl border p-3 transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "border-slate-200 bg-white"
                    }`}
                  >
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                      className="h-5 w-5"
                    />

                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-slate-50">
                      {item.productPicture ? (
                        <Image
                          src={item.productPicture}
                          alt={item.itemName || "Item"}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-400">
                          No Img
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      <label
                        htmlFor={`item-${item.id}`}
                        className="cursor-pointer text-sm leading-none font-medium"
                      >
                        {item.itemName}
                      </label>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>
                          {item.price} {item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleComplete}
            disabled={isPending || isLoading}
            className={allSelected ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {allSelected ? "Complete Order" : "Mark as Partial Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
