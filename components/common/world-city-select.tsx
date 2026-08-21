"use client";

import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { findWorldCity, getWorldCitiesByCountryIso } from "@/lib/world-locations";

const LARGE_CITY_LIST_THRESHOLD = 150;
const SEARCH_RESULT_LIMIT = 100;

export type WorldCitySelectProps = {
  countryIsoCode?: string;
  value?: string;
  onValueChange: (cityName: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  id?: string;
  placeholder?: string;
};

export function WorldCitySelect({
  countryIsoCode = "",
  value = "",
  onValueChange,
  disabled,
  invalid,
  className,
  id,
  placeholder = "Select a city",
}: WorldCitySelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const allCities = useMemo(() => getWorldCitiesByCountryIso(countryIsoCode), [countryIsoCode]);

  const isLargeList = allCities.length > LARGE_CITY_LIST_THRESHOLD;

  const selectedCity = useMemo(() => {
    if (!value) return null;
    return (
      findWorldCity(countryIsoCode, value) ?? {
        name: value,
        stateCode: "",
        countryCode: countryIsoCode,
      }
    );
  }, [countryIsoCode, value]);

  const filteredCities = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      if (isLargeList) return [];
      return allCities.slice(0, SEARCH_RESULT_LIMIT);
    }
    return allCities
      .filter((city) => city.name.toLowerCase().includes(q))
      .slice(0, SEARCH_RESULT_LIMIT);
  }, [allCities, query, isLargeList]);

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
              !selectedCity && "text-slate-500",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <MapPin className="size-4 shrink-0 text-slate-400" />
              <span className="truncate">
                {!countryIsoCode ? "Select country first" : (selectedCity?.name ?? placeholder)}
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
            placeholder="Search city..."
            className="h-9 border-slate-200 pl-9 text-sm"
          />
        </div>

        {isLargeList && !query.trim() && (
          <p className="px-1 text-xs text-slate-500">
            Type to search from {allCities.length} cities
          </p>
        )}

        <div
          className="max-h-60 scrollbar-thin overflow-y-auto overscroll-contain rounded-md pt-1"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          {filteredCities.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-slate-500">
              {!countryIsoCode
                ? "Select a country first"
                : isLargeList && !query.trim()
                  ? "Start typing to search cities"
                  : "No cities found"}
            </p>
          ) : (
            filteredCities.map((city) => {
              const isSelected = value.toLowerCase() === city.name.toLowerCase();

              return (
                <Button
                  key={`${city.name}-${city.stateCode}`}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onValueChange(city.name);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex h-10 w-full items-center gap-2 rounded-xl px-2.5 text-left text-sm font-normal text-slate-700 hover:bg-slate-100",
                    isSelected && "bg-emerald-50 text-emerald-900 hover:bg-emerald-50",
                  )}
                >
                  <MapPin className="size-4 shrink-0 text-slate-400" />
                  <span className="min-w-0 flex-1 truncate">{city.name}</span>
                  {city.stateCode ? (
                    <span className="shrink-0 text-xs text-slate-400">{city.stateCode}</span>
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
