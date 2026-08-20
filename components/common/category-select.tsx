"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useGetCategoriesDropdown } from "@/feature/private/catalogue-management/categories/hooks/use-get-categories-dropdown";
import { CategoryDropdownItem } from "@/feature/private/catalogue-management/categories/types/category.types";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  departmentId?: string;
}

export function CategorySelect({
  value,
  onValueChange,
  placeholder = "Select category...",
  className,
  disabled,
  departmentId,
}: CategorySelectProps) {
  const { data, isLoading } = useGetCategoriesDropdown(departmentId);
  const categories: CategoryDropdownItem[] = Array.isArray(data?.data) ? data.data : [];

  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as string)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger
        className={cn(
          "h-11 w-full rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-950",
          className,
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            <span className="text-slate-400">Loading categories...</span>
          </div>
        ) : value ? (
          <span className="truncate">
            {categories.find((c) => c.id === value)?.name ||
              categories.find((c) => c.id === value)?.categoryName ||
              placeholder}
          </span>
        ) : (
          <span className="text-muted-foreground truncate">{placeholder}</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {categories.length === 0 && !isLoading ? (
          <div className="p-2 text-center text-sm text-slate-500">No categories found</div>
        ) : (
          categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name || cat.categoryName}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
