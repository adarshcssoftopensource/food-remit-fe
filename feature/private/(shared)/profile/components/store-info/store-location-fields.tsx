"use client";

import { Controller, UseFormSetValue, useWatch } from "react-hook-form";

import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { CountrySelect } from "@/components/common/country-select";
import { CitySelect } from "@/components/common/city-select";
import { findPhoneCountry } from "@/components/ui/phone-input-utils";
import type { StoreInfoValues } from "../../schema/store-info.schema";
import type { StoreFieldsProps } from "./store-image-field";

export interface StoreLocationFieldsProps extends StoreFieldsProps {
  setValue: UseFormSetValue<StoreInfoValues>;
  onPhoneIsoChange: (iso: string) => void;
}

export function StoreLocationFields({
  control,
  errors,
  setValue,
  onPhoneIsoChange,
}: StoreLocationFieldsProps) {
  const countryValue = useWatch({ control, name: "storeCountry" });

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
      <Controller
        name="storeAddress"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <FieldLabel className="text-sm font-semibold">
              Address <span className="text-red-500">*</span>
            </FieldLabel>
            <AddressAutocompleteInput
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="Enter Address"
              invalid={!!errors.storeAddress}
              disabled={true}
            />
            <p className="text-[11px] text-slate-400">Address cannot be changed</p>
            {errors.storeAddress && (
              <p className="text-xs font-medium text-red-500">{errors.storeAddress.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="storeCountry"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel className="text-sm font-semibold">
              Country <span className="text-red-500">*</span>
            </FieldLabel>
            <CountrySelect
              value={field.value || ""}
              onValueChange={(val, countryObj) => {
                field.onChange(val);
                setValue("storeCity", "");
                const cName = countryObj?.name || countryObj?.countryName;
                if (cName) {
                  const matched = findPhoneCountry(cName);
                  if (matched) {
                    onPhoneIsoChange(matched.isoCode);
                    setValue("storePhoneCode", `+${matched.dialCode}`);
                  }
                }
              }}
              placeholder="Select Country"
              includeAll={false}
              disabled={true}
              invalid={!!errors.storeCountry}
              className={errors.storeCountry ? "border-red-500 bg-red-50" : ""}
            />
            <p className="text-[11px] text-slate-400">Country cannot be changed</p>
            {errors.storeCountry && (
              <p className="text-xs font-medium text-red-500">{errors.storeCountry.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="storeState"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel className="text-sm font-semibold">State</FieldLabel>
            <Input
              {...field}
              value={field.value || ""}
              placeholder="Enter State"
              disabled={true}
              className="h-11 cursor-not-allowed rounded-xl border-slate-200 bg-slate-100 text-slate-600 disabled:cursor-not-allowed disabled:opacity-75"
            />
            <p className="text-[11px] text-slate-400">State cannot be changed</p>
            {errors.storeState && (
              <p className="text-xs font-medium text-red-500">{errors.storeState.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="storeCity"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel className="text-sm font-semibold">
              City <span className="text-red-500">*</span>
            </FieldLabel>
            <CitySelect
              countryId={countryValue || ""}
              value={field.value || ""}
              onValueChange={(v) => field.onChange(v)}
              disabled={true}
              placeholder="Select City"
              includeAll={false}
              invalid={!!errors.storeCity}
              className={errors.storeCity ? "border-red-500 bg-red-50" : ""}
            />
            <p className="text-[11px] text-slate-400">City cannot be changed</p>
            {errors.storeCity && (
              <p className="text-xs font-medium text-red-500">{errors.storeCity.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="storeZipCode"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel className="text-sm font-semibold">Zipcode</FieldLabel>
            <Input
              {...field}
              value={field.value || ""}
              placeholder="Enter Zipcode"
              disabled={true}
              className="h-11 cursor-not-allowed rounded-xl border-slate-200 bg-slate-100 text-slate-600 disabled:cursor-not-allowed disabled:opacity-75"
            />
            <p className="text-[11px] text-slate-400">Zipcode cannot be changed</p>
            {errors.storeZipCode && (
              <p className="text-xs font-medium text-red-500">{errors.storeZipCode.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}
