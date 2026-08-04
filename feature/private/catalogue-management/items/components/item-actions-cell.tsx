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
