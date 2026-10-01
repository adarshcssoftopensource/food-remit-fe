"use client";

import { Globe2, MapPin } from "lucide-react";
import { Controller, useFormContext, useWatch, type FieldErrors } from "react-hook-form";

import { CountrySelect } from "@/components/common/country-select";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLabel } from "@/components/ui/field";
import { useGetCities } from "@/feature/private/(shared)/settings/hooks/use-get-cities";
import { cn } from "@/lib/utils";
import { type CityManagerFormValues } from "../schema/city-manager.schema";
import { FormFieldError } from "./shared/form-field-error";
import { SectionShell } from "./shared/section-shell";

type CityAssignmentSectionProps = {
  mode: "add" | "edit";
  managerId?: string;
  errors: FieldErrors<CityManagerFormValues>;
};

export function CityAssignmentSection({ mode, managerId, errors }: CityAssignmentSectionProps) {
  const { control, setValue } = useFormContext<CityManagerFormValues>();

  const country = useWatch({ control, name: "country" });
  const assignedCities = useWatch({ control, name: "assignedCities" }) ?? [];

  const { data: citiesDataResponse } = useGetCities({
    countryId: country,
    limit: 1000,
    unassignedOnly: true,
    excludeManagerId: managerId,
  });
  const assignableCities = citiesDataResponse?.data || [];

  return (
    <SectionShell
      icon={Globe2}
      title="Assignment"
      subtitle="Country coverage and cities this manager will handle"
      accent="bg-amber-100 text-amber-700"
    >
      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <div className="max-w-md">
            <FieldLabel className="mb-1.5 text-sm font-semibold">
              Country <span className="text-red-500">*</span>
            </FieldLabel>
            <CountrySelect
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v ?? "");
                setValue("assignedCities", []);
              }}
              disabled={mode === "edit"}
              invalid={!!errors.country}
              placeholder="Select country to assign"
            />
            <FormFieldError message={errors.country?.message} />
          </div>
        )}
      />

      <Controller
        name="assignedCities"
        control={control}
        render={({ field }) => (
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <FieldLabel className="text-sm font-semibold">
                Assign Cities <span className="text-red-500">*</span>
              </FieldLabel>
              {assignedCities.length > 0 ? (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {assignedCities.length} selected
                </span>
              ) : null}
            </div>
            {!country ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center">
                <MapPin className="mb-2 size-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Select a country first</p>
                <p className="mt-1 text-xs text-slate-400">
                  City options will appear for that country
                </p>
              </div>
            ) : assignableCities.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center">
                <MapPin className="mb-2 size-8 text-slate-300" />
                <p className="text-sm font-medium text-slate-600">
                  No city available for this country for assign
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  All cities might already be assigned or none exist for the selected country.
                </p>
              </div>
            ) : (
              <div className="grid max-h-52 gap-2 overflow-y-auto rounded-2xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-3 sm:grid-cols-2 lg:grid-cols-3">
                {assignableCities.map((city) => {
                  const active = field.value.includes(city.id);
                  return (
                    <label
                      key={city.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition",
                        active
                          ? "border-amber-300 bg-amber-50 font-semibold text-amber-900 shadow-sm"
                          : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:shadow-sm",
                      )}
                    >
                      <Checkbox
                        checked={active}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, city.id]);
                          } else {
                            field.onChange(field.value.filter((c) => c !== city.id));
                          }
                        }}
                        className="size-4 rounded-lg data-[state=checked]:border-amber-600 data-[state=checked]:bg-amber-600"
                      />
                      <span className="flex-1 truncate">{city.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
            <FormFieldError message={errors.assignedCities?.message} />
          </div>
        )}
      />
    </SectionShell>
  );
}
