"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGetCities } from "@/feature/private/settings/hooks/use-get-cities";
import type { CityData } from "@/feature/private/settings/types/settings.types";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

type CitySelectProps = {
  className?: string;
  countryId?: string;
  disabled?: boolean;
  id?: string;
  invalid?: boolean;
  onValueChange: (value: string, city?: CityData) => void;
  placeholder?: string;
  value?: string;
  includeAll?: boolean;
  allLabel?: string;
};

export function CitySelect({
  className,
  countryId,
  disabled = false,
  id,
  invalid,
  onValueChange,
  placeholder = "Select city",
  value = "",
  includeAll = true,
  allLabel = "All Cities",
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: citiesResponse, isLoading } = useGetCities({
    countryId: countryId && countryId !== "All" && countryId !== "all" ? countryId : undefined,
    limit: 1000,
  });

  const citiesList = useMemo(() => {
    const list = citiesResponse?.data ?? [];
    // Ensure uniqueness by ID
    const unique = Array.from(new Map(list.map((c) => [c.id, c])).values());
    return unique.sort((a, b) => a.name.localeCompare(b.name));
  }, [citiesResponse?.data]);

  const selectedCity = useMemo(() => {
    if (!value || value === "All" || value === "all") {
      return null;
    }
    return citiesList.find((c) => c.id === value || c.name.toLowerCase() === value.toLowerCase());
  }, [citiesList, value]);

  const filteredCities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return citiesList;
    return citiesList.filter((c) => c.name.toLowerCase().includes(query));
  }, [searchQuery, citiesList]);

  const displayLabel = useMemo(() => {
    if (includeAll && (value === "All" || value === "all" || !value)) {
      return allLabel;
    }
    if (selectedCity) {
      return selectedCity.name;
    }
    if (value && value !== "All" && value !== "all") {
      // If we have a value but it hasn't loaded in citiesList yet
      return value;
    }
    return placeholder;
  }, [includeAll, value, allLabel, selectedCity, placeholder]);

  const isDisabled = disabled || (!countryId && countryId !== undefined);

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
              !selectedCity && (!includeAll || value !== "All") && "text-slate-500",
              invalid && "border-red-400 bg-red-50/30",
              className,
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <MapPin className="size-4 shrink-0 text-slate-400" />
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
        className="w-[min(24rem,calc(100vw-2rem))] gap-2 p-2"
        side="bottom"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search city name..."
            className="h-9 border-slate-200 pl-9 text-sm dark:border-slate-800"
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
                onValueChange("All");
                setIsOpen(false);
                setSearchQuery("");
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                (value === "All" || value === "all" || !value) &&
                  "bg-primary/10 text-primary font-medium",
              )}
            >
              <MapPin className="size-4 shrink-0 text-slate-400" />
              <span className="flex-1">{allLabel}</span>
              {(value === "All" || value === "all" || !value) && <Check className="size-4" />}
            </Button>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
              <Loader2 className="size-4 animate-spin" />
              Loading cities...
            </div>
          ) : filteredCities.length ? (
            filteredCities.map((city) => {
              const isSelected = value === city.id || (selectedCity && selectedCity.id === city.id);

              return (
                <Button
                  key={city.id}
                  variant="ghost"
                  onClick={() => {
                    onValueChange(city.id, city);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-slate-700 capitalize transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                    isSelected && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  <MapPin className="size-4 shrink-0 text-slate-400" />
                  <span className="flex-1 truncate capitalize">{city.name}</span>
                  {isSelected && <Check className="size-4" />}
                </Button>
              );
            })
          ) : (
            <p className="px-2 py-6 text-center text-sm text-slate-500">No cities found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
