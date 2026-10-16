"use client";

import { Check, Mail, User } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldErrors, UseFormSetValue } from "react-hook-form";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { CountrySelect } from "@/components/common/country-select";
import { WorldCitySelect } from "@/components/common/world-city-select";

import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { findPhoneCountry } from "@/components/ui/phone-input-utils";
import { cn } from "@/lib/utils";
import { ManagerLocationFields } from "@/feature/private/(super-admin)/store-management/components/manager-location-fields";
import { LocationSectionHeader } from "../../components/location-section-header";
import type { ProfileDetailsValues } from "../schema/profile.schema";

interface ProfileFieldsProps {
  control: Control<ProfileDetailsValues>;
  errors: FieldErrors<ProfileDetailsValues>;
}

interface ProfileNameFieldProps extends ProfileFieldsProps {
  name: "firstName" | "lastName";
  label: string;
  placeholder: string;
}

export function ProfileNameField({
  control,
  errors,
  name,
  label,
  placeholder,
}: ProfileNameFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor={name} className="text-sm font-semibold">
            {label}
          </FieldLabel>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              {...field}
              id={name}
              placeholder={placeholder}
              aria-invalid={!!errors[name]}
              className={cn(
                "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 pl-10 text-sm transition-colors duration-300 placeholder:text-gray-400/80",
                "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                errors[name] &&
                  "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:shadow-[0_0_0_4px_rgba(248,113,113,0.1)] focus-visible:ring-red-400/15",
              )}
            />
          </div>
          {errors[name] && (
            <p className="text-xs font-medium text-red-500">{errors[name].message}</p>
          )}
        </div>
      )}
    />
  );
}

function VerifiedBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 shadow-2xs dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
      <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
        <Check className="size-2.5 stroke-3" />
      </span>
      <span className="underline decoration-emerald-600/70 underline-offset-2">Verified</span>
    </div>
  );
}

export interface ProfileEmailFieldProps extends Pick<ProfileFieldsProps, "control"> {
  onRequestChange?: () => void;
  isVerified?: boolean;
}

export function ProfileEmailField({ control, isVerified = true }: ProfileEmailFieldProps) {
  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <FieldLabel
              htmlFor="email"
              className="text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              Email Address <span className="text-red-500">*</span>
            </FieldLabel>
            {isVerified && <VerifiedBadge />}
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 items-center px-3.5">
              <Mail className="pointer-events-none size-4 shrink-0 text-slate-400" />
              <input
                id="email"
                type="email"
                value={field.value || ""}
                readOnly
                disabled
                aria-readonly="true"
                aria-label="Email Address"
                className="h-full min-w-0 flex-1 bg-transparent pl-3 text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-200"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>
      )}
    />
  );
}

export interface ProfileContactFieldProps extends ProfileFieldsProps {
  phoneIso: string | undefined;
  onPhoneIsoChange: (iso: string) => void;
  fallbackCountry: string;
  isVerified?: boolean;
}

export function ProfileContactField({
  control,
  errors,
  phoneIso,
  onPhoneIsoChange,
  fallbackCountry,
  isVerified = true,
}: ProfileContactFieldProps) {
  return (
    <Controller
      name="contactNumber"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <FieldLabel
              htmlFor="contactNumber"
              className="text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              Contact Number <span className="text-red-500">*</span>
            </FieldLabel>
            {isVerified && <VerifiedBadge />}
          </div>

          <div
            className={cn(
              "overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs transition-colors dark:border-slate-800 dark:bg-slate-900",
              errors.contactNumber && "border-red-400 dark:border-red-500",
            )}
          >
            <PhoneInputComponent
              value={field.value || ""}
              disabled
              onChange={(value, data) => {
                if (data?.countryCode) onPhoneIsoChange(data.countryCode);
                field.onChange(value);
              }}
              onBlur={field.onBlur}
              error={!!errors.contactNumber}
              defaultCountry={phoneIso || fallbackCountry}
              className="h-12 rounded-none border-0 bg-white shadow-none focus-within:shadow-none hover:border-transparent dark:bg-slate-900"
            />
          </div>

          {errors.contactNumber && (
            <p className="text-xs font-medium text-red-500">{errors.contactNumber.message}</p>
          )}
        </div>
      )}
    />
  );
}

interface EmployeeLocationSectionProps extends ProfileFieldsProps {
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

interface ProfileAddressFieldProps extends ProfileFieldsProps {
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
