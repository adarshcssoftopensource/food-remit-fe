"use client";

import { Check, ChevronDown, Loader2, Search, Store } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetStoresDropdown } from "@/feature/private/store-management/hooks/use-get-stores-dropdown";
import type { StoreData } from "@/feature/private/store-management/types/store-management";
import { cn } from "@/lib/utils";

type StoreSelectProps = {
  className?: string;
  countryId?: string;
  cityId?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  onValueChange: (value: string, store?: StoreData) => void;
  placeholder?: string;
  value?: string;
  includeAll?: boolean;
  allLabel?: string;
};

export function StoreSelect({
  className,
  countryId,
  cityId,
  disabled = false,
  id,
  invalid,
  onValueChange,
  placeholder = "Select store",
  value = "",
  includeAll = false,
  allLabel = "All Stores",
}: StoreSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: storesList, isLoading } = useGetStoresDropdown({
    countryId,
    cityId,
  });

  const sortedStores = useMemo(() => {
    const list = [...storesList];
    return list.sort((a, b) => a.storeName.localeCompare(b.storeName));
  }, [storesList]);

  const selectedStore = useMemo(() => {
    if (!value || (includeAll && (value === "All" || value === "all" || value === ""))) {
      return null;
    }
    return sortedStores.find(
      (s) => s.id === value || s.storeName.toLowerCase() === value.toLowerCase(),
    );
  }, [sortedStores, value, includeAll]);

  const filteredStores = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return sortedStores;
    return sortedStores.filter(
      (s) =>
        s.storeName.toLowerCase().includes(query) ||
        (s.storeCityName && s.storeCityName.toLowerCase().includes(query)) ||
        (s.storeAddress && s.storeAddress.toLowerCase().includes(query)),
    );
  }, [searchQuery, sortedStores]);

  const isDisabled = disabled || (!countryId && countryId !== undefined) || !countryId;

  const displayLabel = useMemo(() => {
    if (!countryId) {
      return "Select country first...";
    }
    if (includeAll && (value === "All" || value === "all" || !value)) {
      return allLabel;
    }
    if (selectedStore) {
      return selectedStore.storeName;
    }
    if (value && value !== "All" && value !== "all") {
      return value;
    }
    return placeholder;
  }, [countryId, includeAll, value, allLabel, selectedStore, placeholder]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={isDisabled}
            aria-invalid={invalid}
            className={cn(
              "h-11! w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
              !selectedStore && (!includeAll || value !== "All") && "text-slate-500",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <Store className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">{displayLabel}</span>
            </span>
            {isLoading ? (
              <Loader2 className="size-4 shrink-0 animate-spin text-slate-400" />
            ) : (
              <ChevronDown className="size-4 shrink-0 text-slate-500" />
            )}
          </Button>
        }
      />
      <PopoverContent
        align="start"
        className="z-200 w-[min(28rem,calc(100vw-2rem))] gap-2 p-2"
        side="bottom"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search store name or city..."
            className="h-9 border-slate-200 pl-9 text-sm dark:border-slate-800"
          />
        </div>

        <div
          className="max-h-60 scrollbar-thin overflow-y-auto overscroll-contain rounded-md pt-1"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: "contain" }}
        >
          {includeAll && (
            <Button
              variant="ghost"
              onClick={() => {
                onValueChange("", undefined);
                setIsOpen(false);
                setSearchQuery("");
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                (!value || value === "All" || value === "all") &&
                  "bg-primary/10 text-primary font-medium",
              )}
            >
              <Store className="size-4 shrink-0 text-slate-400" />
              <span className="flex-1 truncate">{allLabel}</span>
              {(!value || value === "All" || value === "all") && <Check className="size-4" />}
            </Button>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Loading stores...
            </div>
          ) : filteredStores.length ? (
            filteredStores.map((store) => {
              const isSelected =
                value === store.id || (selectedStore && selectedStore.id === store.id);

              return (
                <Button
                  key={store.id}
                  variant="ghost"
                  onClick={() => {
                    onValueChange(store.id, store);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    isSelected && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  <Store className="size-4 shrink-0 text-slate-400" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{store.storeName}</span>
                    {store.storeCityName && (
                      <span className="truncate text-[11px] font-normal text-slate-400">
                        {store.storeCityName}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="size-4 shrink-0" />}
                </Button>
              );
            })
          ) : (
            <p className="px-2 py-6 text-center text-sm text-slate-500">No stores found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
