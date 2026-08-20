"use client";

import { Check, ChevronDown, Flag, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetCountriesDropdown } from "@/feature/private/settings/hooks/use-get-countries-dropdown";
import type { CountryDropdownItem } from "@/feature/private/settings/types/settings.types";
import { cn } from "@/lib/utils";

function countryFlag(code?: string | null) {
  if (!code || code.length !== 2) return null;
  try {
    return String.fromCodePoint(
      ...[...code.toUpperCase()].map((letter) => 127397 + letter.charCodeAt(0)),
    );
  } catch {
    return null;
  }
}

export type CountryOption = {
  id: string;
  name: string;
  code?: string | null;
  countryCode?: string | null;
};

type CountrySelectProps = {
  className?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  onValueChange: (value: string, country?: CountryDropdownItem) => void;
  placeholder?: string;
  value?: string;
  valueKey?: "id" | "name";
  includeAll?: boolean;
  allLabel?: string;
  countries?: CountryOption[];
};

export function CountrySelect({
  className,
  disabled,
  id,
  invalid,
  onValueChange,
  placeholder = "Select country",
  value = "",
  valueKey = "id",
  includeAll = false,
  allLabel = "All Countries",
  countries: customCountries,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { countries: apiCountries, isLoading } = useGetCountriesDropdown();

  const countriesList = useMemo<CountryOption[]>(() => {
    if (customCountries && customCountries.length > 0) {
      return customCountries;
    }
    return apiCountries.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.countryCode,
      countryCode: c.countryCode,
    }));
  }, [customCountries, apiCountries]);

  const selectedCountry = useMemo(() => {
    if (!value || (includeAll && (value === "All" || value === "all" || value === ""))) {
      return null;
    }
    return (
      countriesList.find((c) => c.id === value) ||
      countriesList.find((c) => c.name.toLowerCase() === value.toLowerCase())
    );
  }, [countriesList, value, includeAll]);

  const filteredCountries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return countriesList;

    return countriesList.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        (country.code && country.code.toLowerCase().includes(query)) ||
        (country.countryCode && country.countryCode.toLowerCase().includes(query)),
    );
  }, [searchQuery, countriesList]);

  const displayLabel = useMemo(() => {
    if (includeAll && (value === "All" || value === "all" || !value)) {
      return allLabel;
    }
    if (selectedCountry) {
      return selectedCountry.name;
    }
    if (value && value !== "All" && value !== "all") {
      return value;
    }
    return placeholder;
  }, [includeAll, value, allLabel, selectedCountry, placeholder]);

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
              "h-11! w-full justify-between rounded-xl border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 hover:bg-slate-50",
              !selectedCountry && (!includeAll || value !== "All") && "text-slate-500",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2 capitalize">
              {selectedCountry ? (
                countryFlag(selectedCountry.code || selectedCountry.countryCode) ? (
                  <span aria-hidden="true" className="text-base leading-none">
                    {countryFlag(selectedCountry.code || selectedCountry.countryCode)}
                  </span>
                ) : (
                  <Flag className="size-4 shrink-0 text-slate-400" />
                )
              ) : includeAll ? (
                <Flag className="size-4 shrink-0 text-slate-400" />
              ) : null}
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
        className="z-[200] w-[min(28rem,calc(100vw-2rem))] gap-2 p-2"
        side="bottom"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search country or code..."
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>

        <div
          className="max-h-60 scrollbar-thin overflow-y-auto overscroll-contain rounded-md pt-1"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          style={{ overscrollBehavior: "contain" }}
        >
          {includeAll && !searchQuery && (
            <Button
              variant="ghost"
              onClick={() => {
                onValueChange(valueKey === "id" ? "All" : "All");
                setIsOpen(false);
                setSearchQuery("");
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100",
                (value === "All" || value === "all" || !value) &&
                  "bg-primary/10 text-primary font-medium",
              )}
            >
              <Flag className="size-4 shrink-0 text-slate-400" />
              <span className="flex-1">{allLabel}</span>
              {(value === "All" || value === "all" || !value) && <Check className="size-4" />}
            </Button>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Loading countries...
            </div>
          ) : filteredCountries.length ? (
            filteredCountries.map((country) => {
              const itemValue = valueKey === "name" ? country.name : country.id;
              const isSelected =
                value === itemValue ||
                (valueKey === "id" && value === country.id) ||
                (valueKey === "name" && value === country.name);

              const flag = countryFlag(country.code || country.countryCode);

              return (
                <Button
                  key={country.id || country.name}
                  variant="ghost"
                  onClick={() => {
                    onValueChange(itemValue, {
                      id: country.id,
                      name: country.name,
                      countryName: country.name,
                      countryCode: country.code || country.countryCode,
                    });
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 capitalize transition-colors hover:bg-slate-100",
                    isSelected && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  {flag ? (
                    <span aria-hidden="true" className="text-base leading-none">
                      {flag}
                    </span>
                  ) : (
                    <Flag className="size-4 shrink-0 text-slate-400" />
                  )}
                  <span className="flex-1 truncate capitalize">{country.name}</span>
                  {isSelected && <Check className="size-4" />}
                </Button>
              );
            })
          ) : (
            <p className="px-2 py-6 text-center text-sm text-slate-500">No countries found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
