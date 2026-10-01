"use client";

import { Globe, UserCheck } from "lucide-react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

import { CountrySelect } from "@/components/common/country-select";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AssignCityManagerFormValues } from "../schema/assign-city-manager.schema";
import { type AvailableCityManager } from "../types/assign-city-manager";

interface AssignCityManagerSelectorsProps {
  control: Control<AssignCityManagerFormValues>;
  errors: FieldErrors<AssignCityManagerFormValues>;
  selectedCountry: string;
  availableManagers: AvailableCityManager[];
}

export function AssignCityManagerSelectors({
  control,
  errors,
  selectedCountry,
  availableManagers,
}: AssignCityManagerSelectorsProps) {
  return (
    <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
      {/* Country Selection */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Globe className="size-3.5 text-slate-400" />
          Select Country
          <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CountrySelect
              value={field.value}
              onValueChange={(val) => field.onChange(val)}
              invalid={!!errors.country}
              placeholder="Select a country"
              className="h-12! bg-slate-50"
            />
          )}
        />
        {errors.country && (
          <p className="text-xs font-medium text-red-500">{errors.country.message}</p>
        )}
      </div>

      {/* City Manager Selection */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <UserCheck className="size-3.5 text-slate-400" />
          Select City Manager
          <span className="text-red-500">*</span>
        </Label>
        <Controller
          name="cityManagerId"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={!selectedCountry}>
              <SelectTrigger className="h-12! w-full rounded-xl border-slate-200 bg-slate-50">
                <SelectValue
                  placeholder={
                    !selectedCountry
                      ? "Select a country first"
                      : availableManagers.length === 0
                        ? "No City Manager in this country"
                        : "Select a city manager"
                  }
                >
                  {field.value
                    ? availableManagers.find((m) => m.id === field.value)?.name
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableManagers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No City Manager in this country
                    </SelectItem>
                  ) : (
                    availableManagers.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.cityManagerId && (
          <p className="text-xs font-medium text-red-500">{errors.cityManagerId.message}</p>
        )}
      </div>
    </div>
  );
}
