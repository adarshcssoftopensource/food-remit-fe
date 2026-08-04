"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ItemData } from "@/constants/catalogue-management";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";

interface ItemActionsCellProps {
  item: ItemData;
  onEdit: (item: ItemData) => void;
  onView: (item: ItemData) => void;
}

export function ItemActionsCell({ item, onEdit, onView }: ItemActionsCellProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-colors"
        onClick={() => onView(item)}
        title="View item"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg text-amber-500 transition-colors hover:bg-amber-50"
        onClick={() => onEdit(item)}
        title="Edit item"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function ItemAvailabilityCell({ item }: { item: ItemData }) {
  const [isActive, setIsActive] = useState(item.availability);
  return (
    <Switch
      checked={isActive}
      onCheckedChange={setIsActive}
      className="data-[state=checked]:bg-green-500"
    />
  );
}

export function ItemAdminShareCell({ item }: { item: ItemData }) {
  const [isActive, setIsActive] = useState(item.adminShare);
  return (
    <Switch
      checked={isActive}
      onCheckedChange={setIsActive}
      className="data-[state=checked]:bg-green-500"
    />
  );
}

export function ItemDiscountAvailabilityCell({ item }: { item: ItemData }) {
  const [isActive, setIsActive] = useState(item.discountAvailability);
  return (
    <Switch
      checked={isActive}
      onCheckedChange={setIsActive}
      className="data-[state=checked]:bg-green-500"
    />
  );
}
