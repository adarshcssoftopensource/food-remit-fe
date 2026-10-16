"use client";

import { useState } from "react";
import { Controller, UseFormSetValue } from "react-hook-form";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { CountrySelect } from "@/components/common/country-select";
import { WorldCitySelect } from "@/components/common/world-city-select";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { findPhoneCountry } from "@/components/ui/phone-input-utils";
import { ManagerLocationFields } from "@/feature/private/(super-admin)/store-management/components/manager-location-fields";
import { LocationSectionHeader } from "../../../components/location-section-header";
import type { ProfileDetailsValues } from "../../schema/profile.schema";
import type { ProfileFieldsProps } from "./profile-identity-fields";

export interface EmployeeLocationSectionProps extends ProfileFieldsProps {
  setValue: UseFormSetValue<ProfileDetailsValues>;
  fallbackCountry?: string;
}

export function EmployeeLocationSection({
  control,
  errors,
  setValue,
  fallbackCountry,
}: EmployeeLocationSectionProps) {
  const [countryIso, setCountryIso] = useState<string>(() => {
    return findPhoneCountry(fallbackCountry || "")?.isoCode || fallbackCountry || "";
  });

  return (
    <div className="md:col-span-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800">
        <LocationSectionHeader description="Your residential address details" />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel className="text-sm font-semibold">
                  Country <span className="text-red-500">*</span>
                </FieldLabel>
                <CountrySelect
                  value={field.value}
                  valueKey="name"
                  disabled={true}
                  onValueChange={(val, country) => {
                    field.onChange(val);
                    const newIso = country?.countryCode || findPhoneCountry(val)?.isoCode || "";
                    setCountryIso(newIso);
                    setValue("address", "");
                    setValue("city", "");
                    setValue("state", "");
                    setValue("zipCode", "");
                  }}
                  placeholder="Select Country"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50"
                />
                <p className="text-[11px] text-slate-400">Country cannot be changed</p>
              </div>
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="address" className="text-sm font-semibold">
                  Address
                </FieldLabel>
                <AddressAutocompleteInput
                  id="address"
                  countryCode={countryIso}
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val)}
                  onPlaceSelect={(place) => {
                    setValue("address", place.streetAddress || place.name || "", {
                      shouldDirty: true,
                    });
                    setValue("city", place.city || "", { shouldDirty: true });
                    setValue("state", place.state || "", { shouldDirty: true });
                    setValue("zipCode", place.postalCode || "", { shouldDirty: true });
                    if (place.country) {
                      setValue("country", place.country, { shouldDirty: true });
                    }
                  }}
                  addressFormat="full"
                  placeholder="Search address..."
                  invalid={!!errors.address}
                />
                {errors.address && (
                  <p className="text-xs font-medium text-red-500">{errors.address.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel className="text-sm font-semibold">
                  City <span className="text-red-500">*</span>
                </FieldLabel>
                <WorldCitySelect
                  value={field.value}
                  countryIsoCode={countryIso}
                  onValueChange={(val) => field.onChange(val)}
                  placeholder="Select City"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50"
                />
              </div>
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel className="text-sm font-semibold">State</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="State"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50"
                />
              </div>
            )}
          />
          <Controller
            name="zipCode"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel className="text-sm font-semibold">Zip Code</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Zip Code"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50"
                />
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export interface ProfileAddressFieldProps extends ProfileFieldsProps {
  isStoreManager: boolean;
}

export function ProfileAddressField({ control, errors, isStoreManager }: ProfileAddressFieldProps) {
  return (
    <Controller
      name="address"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <FieldLabel htmlFor="address" className="text-sm font-semibold">
            Address
          </FieldLabel>
          <AddressAutocompleteInput
            id="address"
            value={field.value || ""}
            onChange={(val) => field.onChange(val)}
            addressFormat="full"
            placeholder="Search address..."
            invalid={!!errors.address}
            disabled={isStoreManager}
          />
          {isStoreManager && (
            <p className="text-[11px] text-slate-400">Address cannot be changed</p>
          )}
          {errors.address && (
            <p className="text-xs font-medium text-red-500">{errors.address.message}</p>
          )}
        </div>
      )}
    />
  );
}

export function StoreManagerLocationFields({ control, errors }: ProfileFieldsProps) {
  return (
    <>
      <Controller
        name="country"
        control={control}
        render={({ field: cField }) => (
          <Controller
            name="state"
            control={control}
            render={({ field: sField }) => (
              <Controller
                name="city"
                control={control}
                render={({ field: cityField }) => (
                  <ManagerLocationFields
                    countryValue={cField.value || ""}
                    onCountryChange={cField.onChange}
                    stateValue={sField.value || ""}
                    onStateChange={sField.onChange}
                    cityValue={cityField.value || ""}
                    onCityChange={cityField.onChange}
                    countryError={errors.country?.message}
                    stateError={errors.state?.message}
                    cityError={errors.city?.message}
                    disabled
                  />
                )}
              />
            )}
          />
        )}
      />

      <Controller
        name="zipCode"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
            <FieldLabel htmlFor="zipCode" className="text-sm font-semibold">
              Zipcode
            </FieldLabel>
            <Input
              {...field}
              value={field.value || ""}
              id="zipCode"
              placeholder="Enter Zipcode"
              disabled
              readOnly
              className="h-11 cursor-not-allowed rounded-xl border-slate-200 bg-slate-100 text-slate-600 disabled:cursor-not-allowed disabled:opacity-75"
            />
            <p className="text-[11px] text-slate-400">Zipcode cannot be changed</p>
            {errors.zipCode && (
              <p className="text-xs font-medium text-red-500">{errors.zipCode.message}</p>
            )}
          </div>
        )}
      />
    </>
  );
}
