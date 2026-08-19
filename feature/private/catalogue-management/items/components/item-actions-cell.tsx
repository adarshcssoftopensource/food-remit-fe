"use client";

import { errorToast, successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil } from "lucide-react";
import { useUpdateItemStatus } from "../hooks/use-update-item-status";
import { ItemData } from "../types/item.types";

interface ItemActionsCellProps {
  item: ItemData;
  onEdit: (item: ItemData) => void;
  onView: (item: ItemData) => void;
}

export function ItemActionsCell({ item, onEdit, onView }: ItemActionsCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-colors"
        onClick={() => onView(item)}
        title="View item"
      >
        <Eye size={20} />
      </Button>

      <Button variant="outline" size="icon" onClick={() => onEdit(item)} title="Edit item">
        <Pencil size={20} />
      </Button>
    </div>
  );
}

export function ItemAvailabilityCell({ item }: { item: ItemData }) {
  const { mutate: updateStatus } = useUpdateItemStatus(item.id);
  const isActive = item.status === "ACTIVE";

  return (
    <Switch
      checked={isActive}
      onCheckedChange={(checked) =>
        updateStatus(
          {
            status: checked ? "ACTIVE" : "INACTIVE",
            type: "STATUS",
          },
          {
            onSuccess: () => successToast({ description: "Item status updated successfully" }),
            onError: () => errorToast({ description: "Failed to update item status" }),
          },
        )
      }
      className="data-[state=checked]:bg-green-500"
    />
  );
}

export function ItemAdminShareCell({ item }: { item: ItemData }) {
  const { mutate: updateStatus } = useUpdateItemStatus(item.id);
  const isActive = item.adminShare;

  return (
    <Switch
      checked={isActive}
      onCheckedChange={(checked) =>
        updateStatus(
          { type: "ADMIN_SHARE", adminShare: checked },
          {
            onSuccess: () => successToast({ description: "Admin share updated successfully" }),
            onError: () => errorToast({ description: "Failed to update admin share" }),
          },
        )
      }
      className="data-[state=checked]:bg-green-500"
    />
  );
}

export function ItemDiscountAvailabilityCell({ item }: { item: ItemData }) {
  const { mutate: updateStatus } = useUpdateItemStatus(item.id);
  const isActive = item.discountAvailability;

  return (
    <Switch
      checked={isActive}
      onCheckedChange={(checked) =>
        updateStatus(
          { type: "DISCOUNT_AVAILABILITY", discountAvailability: checked },
          {
            onSuccess: () =>
              successToast({ description: "Discount availability updated successfully" }),
            onError: () => errorToast({ description: "Failed to update discount availability" }),
          },
        )
      }
      className="data-[state=checked]:bg-green-500"
    />
  );
}
