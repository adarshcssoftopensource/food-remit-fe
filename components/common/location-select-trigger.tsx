"use client";

import { ChevronDown, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type LocationSelectTriggerProps = {
  id?: string;
  disabled: boolean;
  invalid?: boolean;
  isPlaceholder: boolean;
  className?: string;
  label: string;
  open: boolean;
};

export function LocationSelectTrigger({
  id,
  disabled,
  invalid,
  isPlaceholder,
  className,
  label,
  open,
}: LocationSelectTriggerProps) {
  return (
    <PopoverTrigger
      render={
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          aria-invalid={invalid}
          className={cn(
            "h-11! w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 hover:bg-slate-50",
            isPlaceholder && "text-slate-500",
            invalid && "border-red-400 bg-red-50/30",
            className,
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            <MapPin className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">{label}</span>
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-slate-500 transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
      }
    />
  );
}
