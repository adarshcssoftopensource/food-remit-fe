"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { Badge } from "@/components/ui/badge";

interface CompleteOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompleteOrderDialog({ orderId, open, onOpenChange }: CompleteOrderDialogProps) {
  const { data: orderData, isLoading } = useGetOrder(orderId);
  const { mutate: completeOrder, isPending } = useCompleteOrder();
  const [unselectedItems, setUnselectedItems] = useState<string[]>([]);

  const items = orderData?.items || [];

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setUnselectedItems([]);
    }
    onOpenChange(newOpen);
  };

  const toggleItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setUnselectedItems((prev) => prev.filter((id) => id !== itemId));
    } else {
      setUnselectedItems((prev) => [...prev, itemId]);
    }
  };

  const handleComplete = () => {
    const availableItemIds = items
      .map((i: OrderDataItem) => i.id)
      .filter((id: string) => !unselectedItems.includes(id));

    completeOrder(
      { orderId, availableItemIds },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const allSelected = items.length > 0 && unselectedItems.length === 0;

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
                const isSelected = !unselectedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 rounded-xl border p-3 shadow-sm transition-all duration-200 ${
                      isSelected
                        ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-900/10"
                        : "border-rose-200 bg-rose-50/30 opacity-75 dark:border-rose-900/30 dark:bg-rose-900/10"
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                      {item.productPicture ? (
                        <Image
                          src={item.productPicture}
                          alt={item.itemName || "Item"}
                          width={48}
                          height={48}
                          className={`h-full w-full object-cover transition-all ${!isSelected ? "grayscale" : ""}`}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-400">
                          No Img
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-center">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={`item-${item.id}`}
                          className={`cursor-pointer text-sm font-semibold transition-colors ${isSelected ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}`}
                        >
                          {item.itemName}
                        </label>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>
                          {item.price} {item.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5 pl-2">
                      <Switch
                        id={`item-${item.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                        className={isSelected ? "!bg-emerald-500" : "!bg-rose-400"}
                      />
                      <Badge
                        variant={isSelected ? "default" : "destructive"}
                        className={`h-4 px-1.5 text-[10px] shadow-none ${
                          isSelected
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-400"
                        }`}
                      >
                        {isSelected ? "In Stock" : "Out of Stock"}
                      </Badge>
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
