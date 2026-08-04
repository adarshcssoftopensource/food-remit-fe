"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CategoryData } from "@/constants/catalogue-management";
import { Eye, Pencil } from "lucide-react";
import { useState } from "react";

interface CategoryActionsCellProps {
  category: CategoryData;
  onEdit: (category: CategoryData) => void;
  onView: (category: CategoryData) => void;
}

export function CategoryActionsCell({ category, onEdit, onView }: CategoryActionsCellProps) {
  const [isActive, setIsActive] = useState(category.status === "Active");

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:bg-primary/10 h-8 w-8 rounded-lg transition-colors"
        onClick={() => onView(category)}
        title="View category"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg text-amber-500 transition-colors hover:bg-amber-50"
        onClick={() => onEdit(category)}
        title="Edit category"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Switch
        checked={isActive}
        onCheckedChange={setIsActive}
        className="data-[state=checked]:bg-green-500"
      />
    </div>
  );
}
