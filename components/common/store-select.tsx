"use client";

import { Check, ChevronDown, Loader2, Search, Store, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetStoresDropdown } from "@/feature/private/store-management/hooks/use-get-stores-dropdown";
import type { StoreData } from "@/feature/private/store-management/types/store-management";
import { useDebounce } from "@/lib/debounce";
import { cn } from "@/lib/utils";

export type StoreSelectProps = {
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
  initialStoreName?: string;
};

export function StoreSelect({
  className,
  countryId,
  cityId,
  disabled = false,
  id,
  invalid,
  onValueChange,
  placeholder = "Select store...",
  value = "",
  includeAll = false,
  allLabel = "All Stores",
  initialStoreName,
}: StoreSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Cached store item when selected (preserves display label if not in current 50 results)
  const [cachedSelectedStore, setCachedSelectedStore] = useState<StoreData | null>(null);

  // Query stores with server-side limit 50 and full database search
  const {
    data: storesList = [],
    isLoading,
    isFetching,
  } = useGetStoresDropdown({
    search: debouncedSearch.trim() || undefined,
    limit: 50,
    countryId,
    cityId,
    enabled: isOpen || Boolean(value),
  });

  const currentStore = useMemo(() => {
    if (!value || value === "All" || value === "all") {
      return null;
    }
    const found = storesList.find(
      (s) => s.id === value || s.storeName.toLowerCase() === value.toLowerCase(),
    );
    if (found) return found;
    if (
      cachedSelectedStore &&
      (cachedSelectedStore.id === value ||
        cachedSelectedStore.storeName.toLowerCase() === value.toLowerCase())
    ) {
      return cachedSelectedStore;
    }
    return null;
  }, [value, storesList, cachedSelectedStore]);

  const displayLabel = useMemo(() => {
    if (includeAll && (value === "All" || value === "all" || !value)) {
      return allLabel;
    }
    if (currentStore) {
      return currentStore.storeName;
    }
    if (initialStoreName && value) {
      return initialStoreName;
    }
    if (value && value !== "All" && value !== "all") {
      return value;
    }
    return placeholder;
  }, [includeAll, value, allLabel, currentStore, placeholder, initialStoreName]);

  const displayLocation = useMemo(() => {
    if (currentStore) {
      return currentStore.storeCityName || currentStore.storeCountryName || null;
    }
    return null;
  }, [currentStore]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={invalid}
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white/70 px-3 text-xs font-normal text-slate-900 shadow-xs backdrop-blur-md transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100",
              (!value || (includeAll && (value === "All" || value === "all"))) &&
                "text-slate-500 dark:text-slate-400",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <Store className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate font-medium">{displayLabel}</span>
              {displayLocation && (
                <span className="hidden max-w-32 truncate rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 sm:inline-block dark:bg-slate-800 dark:text-slate-400">
                  {displayLocation}
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              {isFetching ? (
                <Loader2 className="size-3.5 shrink-0 animate-spin text-emerald-600" />
              ) : (
                <ChevronDown className="size-3.5 shrink-0 text-slate-400 transition-transform duration-200" />
              )}
            </div>
          </Button>
        }
      />
      <PopoverContent
        align="start"
        side="bottom"
        className="z-200 flex w-(--anchor-width) max-w-[var(--anchor-width)] min-w-(--anchor-width) flex-col gap-2 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        style={{ width: "var(--anchor-width)", minWidth: "var(--anchor-width)" }}
      >
        {/* Search Header */}
        <div className="relative shrink-0">
          <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stores by name, city, or phone..."
            className="h-10 w-full rounded-xl border-slate-200/90 pr-8 pl-9 text-xs dark:border-slate-800"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-full p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Status indicator bar */}
        <div className="flex shrink-0 items-center justify-between px-2 text-[10px] font-medium text-slate-400">
          <span>
            {debouncedSearch
              ? `Found ${storesList.length} matching stores in database`
              : `Showing top ${storesList.length} stores (search 100K+ stores)`}
          </span>
          {isFetching && (
            <span className="flex items-center gap-1 text-emerald-600">
              <Loader2 className="size-2.5 animate-spin" />
              Searching...
            </span>
          )}
        </div>

        {/* Scrollable stores list (scrolls after ~8-10 stores) */}
        <div
          className="scrollbar-thin space-y-1 overflow-y-auto overscroll-contain p-0.5"
          style={{ maxHeight: "360px", overflowY: "auto" }}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {includeAll && (
            <button
              type="button"
              onClick={() => {
                onValueChange("", undefined);
                setCachedSelectedStore(null);
                setIsOpen(false);
                setSearchQuery("");
              }}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors",
                !value || value === "All" || value === "all"
                  ? "bg-emerald-50 font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80",
              )}
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                <Store className="size-3.5" />
              </div>
              <span className="flex-1 truncate">{allLabel}</span>
              {(!value || value === "All" || value === "all") && (
                <Check className="size-3.5 shrink-0 text-emerald-600" />
              )}
            </button>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-xs text-slate-400">
              <Loader2 className="size-5 animate-spin text-emerald-600" />
              <span>Searching database across all stores...</span>
            </div>
          ) : storesList.length > 0 ? (
            storesList.map((store) => {
              const isSelected = value === store.id;

              return (
                <button
                  key={store.id}
                  type="button"
                  onClick={() => {
                    onValueChange(store.id, store);
                    setCachedSelectedStore(store);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                      isSelected
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
                    )}
                  >
                    <Store className="size-4" />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold text-slate-900 dark:text-white">
                      {store.storeName}
                    </span>
                    <span className="truncate text-[10px] text-slate-400">
                      {[store.storeCityName, store.storeCountryName, store.storeAddress]
                        .filter(Boolean)
                        .join(" • ") || "Active Store"}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              <p className="font-semibold text-slate-600 dark:text-slate-300">No stores found</p>
              <p className="mt-0.5 text-[11px]">
                Try adjusting your search query for &quot;{debouncedSearch}&quot;
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
