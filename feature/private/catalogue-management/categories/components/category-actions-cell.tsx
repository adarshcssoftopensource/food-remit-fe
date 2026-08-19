"use client";

import { successToast } from "@/components/toaster";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { useUpdateCategoryStatus } from "../hooks/use-update-category-status";
import { CategoryData } from "../types/category.types";

interface CategoryActionsCellProps {
  category: CategoryData;
  onEdit: (category: CategoryData) => void;
  onView: (category: CategoryData) => void;
}

export function CategoryActionsCell({ category, onEdit, onView }: CategoryActionsCellProps) {
  const [isActive, setIsActive] = useState(category.status === "ACTIVE");
  const { mutateAsync: updateStatus, isPending } = useUpdateCategoryStatus(category.id);

  const handleStatusChange = async (checked: boolean) => {
    setIsActive(checked);
    try {
      await updateStatus({ status: checked ? "ACTIVE" : "INACTIVE" });
      successToast({ description: "Category status updated successfully" });
    } catch {
      setIsActive(!checked);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-colors"
        onClick={() => onView(category)}
        title="View category"
      >
        <Eye size={20} />
      </Button>

      <Button variant="outline" size="icon" onClick={() => onEdit(category)} title="Edit category">
        <Pencil size={20} />
      </Button>

      <Switch
        checked={isActive}
        onCheckedChange={handleStatusChange}
        disabled={isPending}
        className="data-[state=checked]:bg-green-500"
      />
    </div>
  );
}
