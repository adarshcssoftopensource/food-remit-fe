"use client";

import { Check, ChevronDown, MapPin, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  findWorldState,
  getWorldStatesByCountryIso,
  type WorldStateOption,
} from "@/lib/world-locations";

const LARGE_STATE_LIST_THRESHOLD = 80;
const SEARCH_RESULT_LIMIT = 100;

export type WorldStateSelectProps = {
  countryIsoCode?: string;
  value?: string;
  onValueChange: (stateName: string, stateOption?: WorldStateOption) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
  allowCustom?: boolean;
};

export function WorldStateSelect({
  countryIsoCode = "",
  value = "",
  onValueChange,
  disabled,
  invalid,
  className,
  id,
  placeholder = "Select state or region",
  allowCustom = true,
}: WorldStateSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const allStates = useMemo(() => {
    return getWorldStatesByCountryIso(countryIsoCode);
  }, [countryIsoCode]);

  const isLargeList = allStates.length > LARGE_STATE_LIST_THRESHOLD;

  const selectedState = useMemo(() => {
    if (!value) return null;
    return (
      findWorldState(countryIsoCode, value) ?? {
        name: value,
        isoCode: "",
        countryCode: countryIsoCode,
      }
    );
  }, [countryIsoCode, value]);

  const filteredStates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      if (isLargeList) return [];
      return allStates.slice(0, SEARCH_RESULT_LIMIT);
    }
    return allStates
      .filter(
        (state) => state.name.toLowerCase().includes(q) || state.isoCode.toLowerCase().includes(q),
      )
      .slice(0, SEARCH_RESULT_LIMIT);
  }, [allStates, query, isLargeList]);

  const isDisabled = disabled || !countryIsoCode;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={isDisabled}
            aria-invalid={invalid}
            className={cn(
              "h-11! w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 hover:bg-slate-50",
              !selectedState && "text-slate-500",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <MapPin className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">
                {!countryIsoCode ? "Select country first" : (selectedState?.name ?? placeholder)}
              </span>
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

      <PopoverContent
        align="start"
        className="z-300 w-[min(28rem,calc(100vw-2rem))] gap-2 p-2"
        side="bottom"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search state..."
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>

        {isLargeList && !query.trim() && (
          <p className="px-1 text-xs text-slate-500">
            Type to search from {allStates.length} states
          </p>
        )}

        <div
          className="max-h-60 scrollbar-thin overflow-y-auto overscroll-contain rounded-md pt-1"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          {filteredStates.length === 0 ? (
            <div className="py-2 text-center text-sm text-slate-500">
              <p className="px-2 py-3 text-sm text-slate-500">
                {!countryIsoCode
                  ? "Select a country first"
                  : allStates.length === 0
                    ? "No states found for this country"
                    : "No matching states found"}
              </p>
              {allowCustom && query.trim() && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onValueChange(query.trim());
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-left text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  <Plus className="size-4 shrink-0" />
                  <span className="truncate">Use &quot;{query.trim()}&quot;</span>
                </Button>
              )}
            </div>
          ) : (
            filteredStates.map((state) => {
              const isSelected = value.toLowerCase() === state.name.toLowerCase();

              return (
                <Button
                  key={`${state.name}-${state.isoCode}`}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onValueChange(state.name, state);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-100",
                    isSelected && "bg-emerald-50 text-emerald-900 hover:bg-emerald-50",
                  )}
                >
                  <MapPin className="size-4 shrink-0 text-slate-400" />
                  <span className="min-w-0 flex-1 truncate">{state.name}</span>
                  {state.isoCode ? (
                    <span className="shrink-0 text-xs text-slate-400">{state.isoCode}</span>
                  ) : null}
                  {isSelected && <Check className="size-4 shrink-0 text-emerald-600" />}
                </Button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
