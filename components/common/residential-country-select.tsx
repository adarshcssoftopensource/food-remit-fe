"use client";

import { Country } from "country-state-city";
import { Check, ChevronDown, Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUserCountry } from "@/hooks/use-user-country";
import { cn } from "@/lib/utils";

function countryFlag(isoCode?: string | null): string | null {
  if (!isoCode || isoCode.length !== 2) return null;
  try {
    return String.fromCodePoint(...[...isoCode.toUpperCase()].map((l) => 127397 + l.charCodeAt(0)));
  } catch {
    return null;
  }
}

const ALL_WORLD_COUNTRIES = Country.getAllCountries().map((c) => ({
  name: c.name,
  isoCode: c.isoCode,
  flag: countryFlag(c.isoCode),
}));

export type ResidentialCountrySelectProps = {
  value?: string;
  onValueChange: (name: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  id?: string;
};

export function ResidentialCountrySelect({
  value = "",
  onValueChange,
  disabled,
  invalid,
  className,
  id,
}: ResidentialCountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const autoDetectApplied = useRef(false);

  const { countryName: detectedName, isLoading: isDetecting } = useUserCountry();

  useEffect(() => {
    if (autoDetectApplied.current) return;
    if (isDetecting) return;
    if (!detectedName) return;
    if (value) return;

    const match = ALL_WORLD_COUNTRIES.find(
      (c) => c.name.toLowerCase() === detectedName.toLowerCase(),
    );
    if (match) {
      onValueChange(match.name);
    }
    autoDetectApplied.current = true;
  }, [detectedName, isDetecting, value, onValueChange]);

  const selectedCountry = useMemo(
    () => ALL_WORLD_COUNTRIES.find((c) => c.name === value) ?? null,
    [value],
  );

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_WORLD_COUNTRIES;
    return ALL_WORLD_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.isoCode.toLowerCase().includes(q),
    );
  }, [query]);

  const triggerLabel = selectedCountry?.name ?? "Select country";
  const isPlaceholder = !selectedCountry;

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
              "h-11! w-full justify-between rounded-xl border-slate-200 bg-slate-50/80 px-3 text-sm font-normal text-slate-900 transition hover:bg-white",
              isPlaceholder && "text-slate-500",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              {isDetecting && !selectedCountry ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-slate-400" />
              ) : selectedCountry?.flag ? (
                <span aria-hidden="true" className="text-base leading-none">
                  {selectedCountry.flag}
                </span>
              ) : (
                <MapPin className="size-4 shrink-0 text-slate-400" />
              )}
              <span className="truncate">{triggerLabel}</span>
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
        className="w-[min(28rem,calc(100vw-2rem))] gap-2 p-2"
        side="bottom"
      >
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country or code…"
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>

        <div
          className="max-h-60 scrollbar-thin overflow-y-auto overscroll-contain rounded-md pt-1"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: "contain" }}
        >
          {filteredCountries.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-slate-500">No countries found.</p>
          ) : (
            filteredCountries.map((country) => {
              const isSelected = value === country.name;
              return (
                <Button
                  key={country.isoCode}
                  variant="ghost"
                  onClick={() => {
                    onValueChange(country.name);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 capitalize transition-colors hover:bg-slate-100",
                    isSelected && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  {country.flag ? (
                    <span aria-hidden="true" className="text-base leading-none">
                      {country.flag}
                    </span>
                  ) : (
                    <MapPin className="size-4 shrink-0 text-slate-400" />
                  )}
                  <span className="flex-1 truncate">{country.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">{country.isoCode}</span>
                  {isSelected && <Check className="size-4 shrink-0" />}
                </Button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
