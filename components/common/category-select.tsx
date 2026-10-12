"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useGetCategoriesDropdown } from "@/feature/private/(super-admin)/catalogue-management/categories/hooks/use-get-categories-dropdown";
import { CategoryDropdownItem } from "@/feature/private/(super-admin)/catalogue-management/categories/types/category.types";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, Store } from "lucide-react";

interface CategorySelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  countryId?: string;
  cityId?: string;
}

export function CategorySelect({
  value,
  onValueChange,
  placeholder = "Select category...",
  className,
  disabled,
  countryId,
  cityId,
}: CategorySelectProps) {
  const { data, isLoading } = useGetCategoriesDropdown(countryId, cityId);
  const categories: CategoryDropdownItem[] = Array.isArray(data?.data) ? data.data : [];

  const selectedCat = categories.find((c) => c.id === value);

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
        ) : selectedCat ? (
          <span className="flex items-center gap-1.5 truncate">
            <span className="truncate">{selectedCat.name || selectedCat.categoryName}</span>
            {(selectedCat.storeName || selectedCat.store?.storeName) && (
              <span className="text-muted-foreground truncate text-xs font-normal">
                ({selectedCat.storeName || selectedCat.store?.storeName})
              </span>
            )}
          </span>
        ) : value ? (
          <span className="truncate">{placeholder}</span>
        ) : (
          <span className="text-muted-foreground truncate">{placeholder}</span>
        )}
      </SelectTrigger>
      <SelectContent className="max-w-[420px] min-w-[280px]">
        {categories.length === 0 && !isLoading ? (
          <div className="p-2 text-center text-sm text-slate-500">No categories found</div>
        ) : (
          categories.map((cat) => {
            const catName = cat.name || cat.categoryName || "Unnamed Category";
            const storeName = cat.storeName || cat.store?.storeName;
            return (
              <SelectItem key={cat.id} value={cat.id} className="py-2">
                <div className="flex w-full items-center justify-between gap-3 text-left">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium text-slate-900 dark:text-slate-100">
                      {catName}
                    </span>
                    {storeName ? (
                      <span className="text-muted-foreground flex items-center gap-1 truncate text-[11px] font-normal">
                        <Store className="size-3 shrink-0 text-slate-400" />
                        <span className="truncate">Store: {storeName}</span>
                        {cat.cityName && (
                          <span className="text-slate-400 dark:text-slate-500">
                            · {cat.cityName}
                          </span>
                        )}
                      </span>
                    ) : cat.cityName ? (
                      <span className="text-muted-foreground flex items-center gap-1 truncate text-[11px] font-normal">
                        <MapPin className="size-3 shrink-0 text-slate-400" />
                        <span className="truncate">City: {cat.cityName}</span>
                      </span>
                    ) : cat.isGlobal ? (
                      <span className="text-muted-foreground truncate text-[11px] font-normal">
                        Global category
                      </span>
                    ) : null}
                  </div>
                  {storeName ? (
                    <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      Store
                    </span>
                  ) : cat.isGlobal ? (
                    <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      Global
                    </span>
                  ) : null}
                </div>
              </SelectItem>
            );
          })
        )}
      </SelectContent>
    </Select>
  );
}
