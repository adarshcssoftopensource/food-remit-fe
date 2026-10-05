"use client";

import { UserCircle } from "lucide-react";
import { Controller, type Control, type FieldErrors, type UseFormSetValue } from "react-hook-form";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { ImageUpload } from "@/components/common/image-upload";
import { Input } from "@/components/ui/input";
import { applyPlaceToLocationFields } from "@/lib/places/apply-place-to-location-fields";
import { getCountryPhoneInfo } from "@/lib/phone";
import { type StoreFormValues } from "../schema/store.schema";
import { ManagerLocationFields } from "./manager-location-fields";
import { PhoneField } from "./phone-field";
import { FormField } from "./store-form-field";
import { StoreFormCard } from "./store-form-card";

interface StoreManagerDetailsCardProps {
  control: Control<StoreFormValues>;
  errors: FieldErrors<StoreFormValues>;
  setValue: UseFormSetValue<StoreFormValues>;
  initialValues?: Partial<StoreFormValues>;
  isNonCommissionDisabled: boolean;
  mode: "add" | "edit";
  managerPhoneInfo: ReturnType<typeof getCountryPhoneInfo>;
  apiCountries: Parameters<typeof getCountryPhoneInfo>[1];
}

export function StoreManagerDetailsCard({
  control,
  errors,
  setValue,
  initialValues,
  isNonCommissionDisabled,
  mode,
  managerPhoneInfo,
  apiCountries,
}: StoreManagerDetailsCardProps) {
  return (
    <StoreFormCard
      icon={UserCircle}
      iconWrapperClassName="flex size-9 items-center justify-center rounded-xl bg-blue-50"
      iconClassName="size-4 text-blue-600"
      title="Manager Details"
      subtitle="Information about the store manager"
    >
      <Controller
        name="managerImage"
        control={control}
        render={({ field }) => (
          <ImageUpload
            label="Upload manager image"
            hint="PNG, JPG or WEBP · max 1 image"
            maxFiles={1}
            multiple={false}
            onChange={(files) => field.onChange(files[0] || null)}
            value={field.value && typeof field.value !== "string" ? [field.value as File] : []}
            initialImages={initialValues?.managerImage ? [initialValues.managerImage] : []}
            disabled={isNonCommissionDisabled}
            defaultImage="/default-avatar.svg"
          />
        )}
      />

      <Controller
        name="managerFirstName"
        control={control}
        render={({ field }) => (
          <FormField label="First Name" error={errors.managerFirstName?.message} required>
            <Input
              {...field}
              id="managerFirstName"
              placeholder="Enter First Name"
              disabled={isNonCommissionDisabled}
              className="h-11 rounded-xl border-slate-200 bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-600 disabled:opacity-100"
            />
          </FormField>
        )}
      />

      <Controller
        name="managerLastName"
        control={control}
        render={({ field }) => (
          <FormField label="Last Name" error={errors.managerLastName?.message} required>
            <Input
              {...field}
              id="managerLastName"
              placeholder="Enter Last Name"
              disabled={isNonCommissionDisabled}
              className="h-11 rounded-xl border-slate-200 bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-600 disabled:opacity-100"
            />
          </FormField>
        )}
      />

      <Controller
        name="managerEmail"
        control={control}
        render={({ field }) => (
          <FormField label="Email Address" error={errors.managerEmail?.message} required>
            <Input
              {...field}
              id="managerEmail"
              type="email"
              placeholder="Enter Email"
              className="h-11 rounded-xl border-slate-200 bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-600 disabled:opacity-100"
              disabled={isNonCommissionDisabled || mode === "edit"}
            />
          </FormField>
        )}
      />

      <Controller
        name="managerPhoneCode"
        control={control}
        render={({ field: codeField }) => (
          <Controller
            name="managerPhoneNumber"
            control={control}
            render={({ field: numField }) => (
              <PhoneField
                codeValue={codeField.value}
                onCodeChange={codeField.onChange}
                numberValue={numField.value}
                onNumberChange={numField.onChange}
                codeError={errors.managerPhoneCode?.message}
                numberError={errors.managerPhoneNumber?.message}
                label="Phone Number"
                required
                disabled={isNonCommissionDisabled || mode === "edit"}
                defaultCountry={managerPhoneInfo?.isoCode || "IN"}
              />
            )}
          />
        )}
      />

      <Controller
        name="managerAddress"
        control={control}
        render={({ field }) => (
          <FormField label="Address" error={errors.managerAddress?.message} required>
            <AddressAutocompleteInput
              id="managerAddress"
              value={field.value}
              onChange={field.onChange}
              addressFormat="street"
              placeholder="Enter Address"
              invalid={!!errors.managerAddress}
              disabled={isNonCommissionDisabled}
              onPlaceSelect={(place) => {
                applyPlaceToLocationFields(place, setValue, {
                  country: "managerCountry",
                  state: "managerState",
                  city: "managerCity",
                  zipcode: "managerZipCode",
                });
                if (place.country) {
                  const info = getCountryPhoneInfo(place.country, apiCountries);
                  if (info?.dialCode) {
                    setValue("managerPhoneCode", info.dialCode, { shouldValidate: true });
                  }
                }
              }}
            />
          </FormField>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="managerCountry"
          control={control}
          render={({ field: cField }) => (
            <Controller
              name="managerState"
              control={control}
              render={({ field: sField }) => (
                <Controller
                  name="managerCity"
                  control={control}
                  render={({ field: cityField }) => (
                    <ManagerLocationFields
                      countryValue={cField.value}
                      onCountryChange={(v) => {
                        cField.onChange(v);
                        const info = getCountryPhoneInfo(v, apiCountries);
                        if (info?.dialCode) {
                          setValue("managerPhoneCode", info.dialCode, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      stateValue={sField.value}
                      onStateChange={sField.onChange}
                      cityValue={cityField.value}
                      onCityChange={cityField.onChange}
                      countryError={errors.managerCountry?.message}
                      stateError={errors.managerState?.message}
                      cityError={errors.managerCity?.message}
                      disabled={isNonCommissionDisabled}
                    />
                  )}
                />
              )}
            />
          )}
        />

        <Controller
          name="managerZipCode"
          control={control}
          render={({ field }) => (
            <FormField label="Zipcode" error={errors.managerZipCode?.message}>
              <Input
                {...field}
                id="managerZipCode"
                placeholder="Enter Zipcode"
                disabled={isNonCommissionDisabled}
                className="h-11 rounded-xl border-slate-200 bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-600 disabled:opacity-100"
              />
            </FormField>
          )}
        />
      </div>
    </StoreFormCard>
  );
}
