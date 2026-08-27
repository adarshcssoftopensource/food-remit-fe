"use client";

import { CitySelect } from "@/components/common/city-select";
import { CountrySelect } from "@/components/common/country-select";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Filter, RotateCcw } from "lucide-react";
import React, { useState } from "react";

export interface ModuleFiltersProps {
  title?: string;
  description?: string;
  countryId?: string;
  onCountryChange?: (countryId: string) => void;
  cityId?: string;
  onCityChange?: (cityId: string) => void;
  hideCountryFilter?: boolean;
  hideCityFilter?: boolean;
  countryPlaceholder?: string;
  cityPlaceholder?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onApplyFilters?: () => void;
  onCancelFilters?: () => void;
  children?: React.ReactNode;
  activeFilterCount?: number;
  className?: string;
}

export function ModuleFilters({
  title = "Filter Records",
  description,
  countryId,
  onCountryChange,
  cityId,
  onCityChange,
  hideCountryFilter = false,
  hideCityFilter = false,
  countryPlaceholder = "All Countries",
  cityPlaceholder = "All Cities",
  hasFilters = false,
  onClearFilters,
  onApplyFilters,
  onCancelFilters,
  children,
  activeFilterCount,
  className,
}: ModuleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const showCountry = !hideCountryFilter && onCountryChange;
  const showCity = !hideCityFilter && onCityChange;

  return (
    <div className={cn("flex justify-end", className)}>
      <Drawer
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open && !isApplying && onCancelFilters) {
            onCancelFilters();
          }
          if (open) {
            setIsApplying(false);
          }
        }}
        swipeDirection="right"
      >
        <DrawerTrigger
          render={
            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200/80 bg-white/85 px-4 font-semibold shadow-xs backdrop-blur-xl transition-all hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/85 dark:hover:bg-slate-800"
            >
              <Filter className="mr-2 h-4 w-4" />
              {title}
              {activeFilterCount !== undefined && activeFilterCount > 0 && (
                <span className="bg-primary/10 text-primary ring-primary/20 ml-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ring-1">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          }
        />

        <DrawerContent className="h-full rounded-l-2xl rounded-r-none">
          <div className="flex h-full w-full flex-col">
            <DrawerHeader className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <DrawerTitle className="text-xl font-bold tracking-tight">{title}</DrawerTitle>
              {description && (
                <DrawerDescription className="mt-1 text-sm">{description}</DrawerDescription>
              )}
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-col gap-5">
                {/* Country selector */}
                {showCountry && (
                  <div className="min-w-36 flex-1 space-y-1.5 sm:min-w-44">
                    <Label className="block truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Country
                    </Label>
                    <CountrySelect
                      value={countryId === "all" ? "" : countryId}
                      onValueChange={(val) => {
                        onCountryChange(val || "all");
                        if (onCityChange) onCityChange("all");
                      }}
                      valueKey="id"
                      includeAll
                      allLabel={countryPlaceholder}
                      placeholder={countryPlaceholder}
                      className="h-10 rounded-xl"
                    />
                  </div>
                )}

                {/* City selector */}
                {showCity && (
                  <div className="min-w-36 flex-1 space-y-1.5 sm:min-w-44">
                    <Label className="block truncate text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      City
                    </Label>
                    <CitySelect
                      countryId={countryId !== "all" && countryId ? countryId : undefined}
                      value={cityId === "all" ? "" : cityId}
                      onValueChange={(val) => onCityChange(val || "all")}
                      includeAll
                      allLabel={cityPlaceholder}
                      placeholder={
                        countryId && countryId !== "all" ? cityPlaceholder : "Select country first"
                      }
                      disabled={!countryId || countryId === "all" || countryId === "All"}
                      className="h-10 rounded-xl"
                    />
                  </div>
                )}

                {/* Custom module specific filters passed as children */}
                {children}
              </div>
            </div>

            {(onClearFilters || onApplyFilters) && (
              <DrawerFooter className="flex-row justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
                {onClearFilters && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onClearFilters();
                      setIsOpen(false);
                    }}
                    disabled={!hasFilters}
                    className="h-10 rounded-xl px-4"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                )}
                {onApplyFilters && (
                  <Button
                    className="h-10 rounded-xl px-8"
                    onClick={() => {
                      setIsApplying(true);
                      onApplyFilters();
                      setIsOpen(false);
                    }}
                  >
                    Apply Filters
                  </Button>
                )}
              </DrawerFooter>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
