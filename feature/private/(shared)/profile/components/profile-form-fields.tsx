"use client";

import { Mail, User } from "lucide-react";
import { Control, Controller, FieldErrors, UseFormSetValue } from "react-hook-form";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInputComponent } from "@/components/ui/phone-input";
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

export function ProfileEmailField({ control }: Pick<ProfileFieldsProps, "control">) {
  return (
    <Controller
      name="email"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="email" className="text-sm font-semibold">
            Email Address
          </FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              {...field}
              id="email"
              type="email"
              placeholder="Enter your email"
              disabled
              readOnly
              className="h-12 cursor-not-allowed rounded-xl border-gray-200/80 bg-slate-100/80 pl-10 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-75 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400"
            />
          </div>
          <p className="text-[11px] text-slate-400">Email address cannot be changed</p>
        </div>
      )}
    />
  );
}

interface ProfileContactFieldProps extends ProfileFieldsProps {
  phoneIso: string | undefined;
  onPhoneIsoChange: (iso: string) => void;
  fallbackCountry: string;
}

export function ProfileContactField({
  control,
  errors,
  phoneIso,
  onPhoneIsoChange,
  fallbackCountry,
}: ProfileContactFieldProps) {
  return (
    <Controller
      name="contactNumber"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="contactNumber" className="text-sm font-semibold">
            Contact Number
          </FieldLabel>
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
          />
          <p className="text-[11px] text-slate-400">Contact number cannot be changed</p>
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
}

export function EmployeeLocationSection({
  control,
  errors,
  setValue,
}: EmployeeLocationSectionProps) {
  return (
    <div className="md:col-span-2">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800">
        <LocationSectionHeader description="Your residential address details" />
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
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
                  value={field.value || ""}
                  onChange={(val) => field.onChange(val)}
                  onPlaceSelect={(place) => {
                    setValue("address", place.streetAddress || place.name || "", {
                      shouldDirty: true,
                    });
                    setValue("city", place.city || "", { shouldDirty: true });
                    setValue("state", place.state || "", { shouldDirty: true });
                    setValue("zipCode", place.postalCode || "", { shouldDirty: true });
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
                <FieldLabel className="text-sm font-semibold">City</FieldLabel>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="City"
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
            {errors.zipCode && (
              <p className="text-xs font-medium text-red-500">{errors.zipCode.message}</p>
            )}
          </div>
        )}
      />
    </>
  );
}
