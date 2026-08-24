"use client";

import { Check, ChevronDown, Flag, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  findWorldCountryByName,
  getAllWorldCountries,
  type WorldCountryOption,
} from "@/lib/world-locations";

export type WorldCountrySelectProps = {
  value?: string;
  onValueChange: (country: WorldCountryOption) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
  excludeNames?: string[];
};

export function WorldCountrySelect({
  value = "",
  onValueChange,
  disabled,
  invalid,
  className,
  id,
  placeholder = "Select a country",
  excludeNames = [],
}: WorldCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const excluded = useMemo(
    () => new Set(excludeNames.map((name) => name.trim().toLowerCase())),
    [excludeNames],
  );

  const selectedCountry = useMemo(() => findWorldCountryByName(value), [value]);

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getAllWorldCountries().filter((country) => {
      if (excluded.has(country.name.toLowerCase())) return false;
      if (!q) return true;
      return country.name.toLowerCase().includes(q) || country.isoCode.toLowerCase().includes(q);
    });
  }, [query, excluded]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
              !selectedCountry && "text-slate-500",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              {selectedCountry?.flag ? (
                <span aria-hidden className="text-base leading-none">
                  {selectedCountry.flag}
                </span>
              ) : (
                <Flag className="size-4 shrink-0 text-slate-400" />
              )}
              <span className="truncate">{selectedCountry?.name ?? placeholder}</span>
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
            placeholder="Search country or code..."
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>

        <div
          className="max-h-60 scrollbar-thin overflow-y-auto overscroll-contain rounded-md pt-1"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          {filteredCountries.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-slate-500">No countries found.</p>
          ) : (
            filteredCountries.map((country) => {
              const isSelected = selectedCountry?.isoCode === country.isoCode;

              return (
                <Button
                  key={country.isoCode}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onValueChange(country);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-100",
                    isSelected && "bg-emerald-50 text-emerald-900 hover:bg-emerald-50",
                  )}
                >
                  {country.flag ? (
                    <span aria-hidden className="text-base leading-none">
                      {country.flag}
                    </span>
                  ) : (
                    <Flag className="size-4 shrink-0 text-slate-400" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{country.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">{country.isoCode}</span>
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
