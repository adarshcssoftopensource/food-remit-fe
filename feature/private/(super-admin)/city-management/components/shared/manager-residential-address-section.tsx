"use client";

import { City, Country, State } from "country-state-city";
import { Home } from "lucide-react";
import { Controller, useFormContext, useWatch, type FieldErrors } from "react-hook-form";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { ResidentialCountrySelect } from "@/components/common/residential-country-select";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyPlaceToLocationFields } from "@/lib/places/apply-place-to-location-fields";
import { FormFieldError } from "./form-field-error";
import { MANAGER_INPUT_CLASS, type ManagerFormBaseValues } from "./manager-form.types";
import { SectionShell } from "./section-shell";

type ManagerResidentialAddressSectionProps = {
  idPrefix: string;
  selectTriggerClassName: string;
  errors: FieldErrors<ManagerFormBaseValues>;
};

export function ManagerResidentialAddressSection({
  idPrefix,
  selectTriggerClassName,
  errors,
}: ManagerResidentialAddressSectionProps) {
  const { control, setValue } = useFormContext<ManagerFormBaseValues>();
  const inputClass = MANAGER_INPUT_CLASS;

  const residentialCountry = useWatch({ control, name: "residentialCountry" });
  const state = useWatch({ control, name: "state" });

  const allWorldCountries = Country.getAllCountries();

  const selectedCountryObj = allWorldCountries.find((c) => c.name === residentialCountry);
  const stateOptions = selectedCountryObj
    ? State.getStatesOfCountry(selectedCountryObj.isoCode)
    : [];

  const selectedStateObj = stateOptions.find((s) => s.name === state);
  const cityOptions =
    selectedCountryObj && selectedStateObj
      ? City.getCitiesOfState(selectedCountryObj.isoCode, selectedStateObj.isoCode)
      : [];

  return (
    <SectionShell
      icon={Home}
      title="Residential Address"
      subtitle="Where this manager lives"
      accent="bg-emerald-100 text-emerald-700"
    >
      <div className="grid gap-4">
        <Controller
          name="address1"
          control={control}
          render={({ field }) => (
            <div>
              <FieldLabel className="mb-1.5 text-sm font-semibold">
                Address 1 <span className="text-red-500">*</span>
              </FieldLabel>
              <AddressAutocompleteInput
                id={`${idPrefix}Address1`}
                value={field.value}
                onChange={field.onChange}
                addressFormat="street"
                placeholder="Street address"
                invalid={!!errors.address1}
                onPlaceSelect={(place) => {
                  applyPlaceToLocationFields(place, setValue, {
                    country: "residentialCountry",
                    state: "state",
                    city: "city",
                    zipcode: "zipcode",
                  });
                }}
              />
              <FormFieldError message={errors.address1?.message} />
            </div>
          )}
        />
        <Controller
          name="address2"
          control={control}
          render={({ field }) => (
            <div>
              <FieldLabel className="mb-1.5 text-sm font-semibold">Address 2</FieldLabel>
              <AddressAutocompleteInput
                id={`${idPrefix}Address2`}
                value={field.value}
                onChange={field.onChange}
                placeholder="Street address 2 (optional)"
                invalid={!!errors.address2}
              />
              <FormFieldError message={errors.address2?.message} />
            </div>
          )}
        />
        <Controller
          name="residentialCountry"
          control={control}
          render={({ field }) => (
            <div>
              <FieldLabel className="mb-1.5 text-sm font-semibold">
                Residential Country <span className="text-red-500">*</span>
              </FieldLabel>
              <ResidentialCountrySelect
                value={field.value}
                onValueChange={(name) => {
                  field.onChange(name);
                  setValue("state", "");
                  setValue("city", "");
                }}
                invalid={!!errors.residentialCountry}
              />
              <FormFieldError message={errors.residentialCountry?.message} />
            </div>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <div>
                <FieldLabel className="mb-1.5 text-sm font-semibold">
                  State <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v ?? "");
                    setValue("city", "");
                  }}
                  disabled={!residentialCountry}
                >
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue
                      placeholder={residentialCountry ? "Select state" : "Select country first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map((opt) => (
                      <SelectItem key={opt.isoCode} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError message={errors.state?.message} />
              </div>
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <div>
                <FieldLabel className="mb-1.5 text-sm font-semibold">
                  City <span className="text-red-500">*</span>
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange} disabled={!state}>
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue placeholder={state ? "Select city" : "Select state first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cityOptions.map((opt) => (
                      <SelectItem key={opt.name} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError message={errors.city?.message} />
              </div>
            )}
          />
        </div>
        <Controller
          name="zipcode"
          control={control}
          render={({ field }) => (
            <div>
              <FieldLabel className="mb-1.5 text-sm font-semibold">Zipcode</FieldLabel>
              <Input {...field} placeholder="Enter zipcode" className={inputClass} />
              <FormFieldError message={errors.zipcode?.message} />
            </div>
          )}
        />
      </div>
    </SectionShell>
  );
}
