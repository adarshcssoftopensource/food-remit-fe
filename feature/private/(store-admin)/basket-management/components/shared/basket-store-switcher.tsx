"use client";

import { Store } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { BasketStore } from "../../types/basket.types";

interface BasketStoreSwitcherProps {
  stores: BasketStore[];
  activeStore: BasketStore | null;
  onChange: (id: string) => void;
  isLoading?: boolean;
  /** Lock the store (e.g. while editing an existing basket) */
  disabled?: boolean;
  className?: string;
}

/** Active store indicator; becomes a picker when the vendor manages more than one store */
export function BasketStoreSwitcher({
  stores,
  activeStore,
  onChange,
  isLoading,
  disabled,
  className,
}: BasketStoreSwitcherProps) {
  if (isLoading) return <Skeleton className={cn("h-10 w-52 rounded-xl", className)} />;
  if (!activeStore) return null;

  const label = (
    <span className="flex min-w-0 items-center gap-2">
      <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-md">
        <Store className="size-3.5" />
      </span>
      <span className="truncate">{activeStore.storeName}</span>
    </span>
  );

  if (stores.length <= 1 || disabled) {
    return (
      <div
        className={cn(
          "inline-flex h-10 max-w-full items-center rounded-xl border border-slate-200/80 bg-white/90 px-3 text-sm font-semibold shadow-xs dark:border-slate-800 dark:bg-slate-900",
          className,
        )}
        title="Baskets are created for this store"
      >
        {label}
      </div>
    );
  }

  return (
    <Select value={activeStore.id} onValueChange={(value) => value && onChange(value)}>
      <SelectTrigger
        aria-label="Active store"
        className={cn(
          "h-10 w-full min-w-52 rounded-xl border-slate-200/80 bg-white/90 px-3 text-sm font-semibold shadow-xs sm:w-auto dark:border-slate-800 dark:bg-slate-900",
          className,
        )}
      >
        <SelectValue>{label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.storeName}
            {store.city ? (
              <span className="text-muted-foreground ml-1 text-xs">· {store.city}</span>
            ) : null}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
