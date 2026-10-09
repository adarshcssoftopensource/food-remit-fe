"use client";

import { Building2 } from "lucide-react";
import { Controller, type Control, type FieldErrors, type UseFormSetValue } from "react-hook-form";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { ImageUpload } from "@/components/common/image-upload";
import { Input } from "@/components/ui/input";
import { getCountryPhoneInfo } from "@/lib/phone";
import { type StoreFormValues } from "../schema/store.schema";
import { CountryCityFields } from "./country-city-fields";
import { PhoneField } from "./phone-field";
import { FormField } from "./store-form-field";
import { StoreFormCard } from "./store-form-card";
import { StoreSameDayDeliveryFields } from "./store-same-day-delivery-fields";
import { StoreProductScreeningFields } from "@/feature/private/(shared)/profile/components/store-information-fields";

interface StoreDetailsCardProps {
  control: Control<StoreFormValues>;
  errors: FieldErrors<StoreFormValues>;
  setValue: UseFormSetValue<StoreFormValues>;
  initialValues?: Partial<StoreFormValues>;
  isNonCommissionDisabled: boolean;
  canViewPlatformFees: boolean;
  storePhoneInfo: ReturnType<typeof getCountryPhoneInfo>;
  apiCountries: Parameters<typeof getCountryPhoneInfo>[1];
}

export function StoreDetailsCard({
  control,
  errors,
  setValue,
  initialValues,
  isNonCommissionDisabled,
  canViewPlatformFees,
  storePhoneInfo,
  apiCountries,
}: StoreDetailsCardProps) {
  return (
    <StoreFormCard
      icon={Building2}
      iconWrapperClassName="bg-primary/10 flex size-9 items-center justify-center rounded-xl"
      iconClassName="text-primary size-4"
      title="Store Details"
      subtitle="Basic information about the store"
    >
      <Controller
        name="storeImage"
        control={control}
        render={({ field }) => (
          <FormField label="Store Image" error={errors.storeImage?.message as string}>
            <ImageUpload
              label="Upload store image"
              hint="PNG, JPG or WEBP"
              maxFiles={1}
              multiple={false}
              onChange={(files) => field.onChange(files[0] || null)}
              onAllImagesChange={(all) => {
                if (all.length === 0) {
                  field.onChange(null);
                }
              }}
              value={field.value && typeof field.value !== "string" ? [field.value as File] : []}
              initialImages={initialValues?.storeImage ? [initialValues.storeImage] : []}
              disabled={isNonCommissionDisabled}
              defaultImage="/default-store.svg"
            />
          </FormField>
        )}
      />

      {initialValues?.storeId && (
        <FormField label="Store ID">
          <Input
            value={initialValues.storeId}
            disabled
            readOnly
            className="h-11 rounded-xl border-slate-200 bg-slate-100 font-mono text-slate-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-600 disabled:opacity-100"
          />
        </FormField>
      )}

      <Controller
        name="storeName"
        control={control}
        render={({ field }) => (
          <FormField label="Store Name" error={errors.storeName?.message} required>
            <Input
              {...field}
              id="storeName"
              placeholder="Enter Store Name"
              disabled={isNonCommissionDisabled}
              className="h-11 rounded-xl border-slate-200 bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-600 disabled:opacity-100"
            />
          </FormField>
        )}
      />

      <Controller
        name="storePhoneCode"
        control={control}
        render={({ field: codeField }) => (
          <Controller
            name="storePhoneNumber"
            control={control}
            render={({ field: numField }) => (
              <PhoneField
                label="Store Phone Number"
                required
                codeValue={codeField.value}
                onCodeChange={codeField.onChange}
                numberValue={numField.value}
                onNumberChange={numField.onChange}
                codeError={errors.storePhoneCode?.message}
                numberError={errors.storePhoneNumber?.message}
                defaultCountry={storePhoneInfo?.isoCode || "IN"}
                disabled={isNonCommissionDisabled}
              />
            )}
          />
        )}
      />

      <Controller
        name="storeAddress"
        control={control}
        render={({ field }) => (
          <FormField label="Address" error={errors.storeAddress?.message} required>
            <AddressAutocompleteInput
              id="storeAddress"
              value={field.value}
              onChange={field.onChange}
              addressFormat="full"
              placeholder="Enter Address"
              invalid={!!errors.storeAddress}
              disabled={isNonCommissionDisabled}
            />
          </FormField>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="storeCountry"
          control={control}
          render={({ field: cField }) => (
            <Controller
              name="storeCity"
              control={control}
              render={({ field: cityField }) => (
                <CountryCityFields
                  prefix="store"
                  countryValue={cField.value}
                  onCountryChange={(v, countryItem) => {
                    cField.onChange(v);
                    const info = getCountryPhoneInfo(countryItem?.name || v, apiCountries);
                    if (info?.dialCode) {
                      setValue("storePhoneCode", info.dialCode, { shouldValidate: true });
                    }
                  }}
                  stateValue=""
                  onStateChange={() => {}}
                  cityValue={cityField.value}
                  onCityChange={cityField.onChange}
                  countryError={errors.storeCountry?.message}
                  cityError={errors.storeCity?.message}
                  disabled={isNonCommissionDisabled}
                />
              )}
            />
          )}
        />
      </div>

      <Controller
        name="address2"
        control={control}
        render={({ field }) => (
          <FormField label="Address 2">
            <Input
              {...field}
              id="storeAddress2"
              placeholder="Enter Address 2 (optional)"
              disabled={isNonCommissionDisabled}
              className="h-11 rounded-xl border-slate-200 bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-600 disabled:opacity-100"
            />
          </FormField>
        )}
      />

      <StoreSameDayDeliveryFields
        control={control}
        setValue={setValue}
        isNonCommissionDisabled={isNonCommissionDisabled}
      />

      <StoreProductScreeningFields
        control={control}
        setValue={setValue}
        disabled={isNonCommissionDisabled}
      />

      <Controller
        name="storeTax"
        control={control}
        render={({ field }) => (
          <FormField label="Government Store Tax" error={errors.storeTax?.message}>
            <Input
              {...field}
              id="storeTax"
              type="number"
              min={0}
              max={100}
              step={0.01}
              placeholder="Government Store Tax"
              className="h-11 rounded-xl border-slate-200 bg-white disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-600 disabled:opacity-100"
              value={field.value ?? ""}
              disabled={isNonCommissionDisabled}
              onFocus={(e) => {
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  field.onChange("");
                  return;
                }
                const num = Number(val);
                if (!isNaN(num) && num > 100) {
                  field.onChange(100);
                  return;
                }
                field.onChange(val);
              }}
            />
          </FormField>
        )}
      />

      {canViewPlatformFees && (
        <Controller
          name="foodRemitCommission"
          control={control}
          render={({ field }) => (
            <FormField
              label="Food Remit Store Commission %"
              error={errors.foodRemitCommission?.message}
            >
              <Input
                {...field}
                id="foodRemitCommission"
                type="number"
                min={0}
                max={100}
                step={0.01}
                placeholder="Enter Commission %"
                className="h-11 rounded-xl border-slate-200"
                value={field.value ?? ""}
                onFocus={(e) => {
                  e.target.select();
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    field.onChange("");
                    return;
                  }
                  const num = Number(val);
                  if (!isNaN(num) && num > 100) {
                    field.onChange(100);
                    return;
                  }
                  field.onChange(val);
                }}
              />
            </FormField>
          )}
        />
      )}
    </StoreFormCard>
  );
}
