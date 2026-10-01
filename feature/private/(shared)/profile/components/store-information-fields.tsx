"use client";

import { Control, Controller, FieldErrors, UseFormSetValue } from "react-hook-form";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

import { FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/common/image-upload";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { findPhoneCountry } from "@/components/ui/phone-input-utils";
import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { CountryCityFields } from "@/feature/private/(super-admin)/store-management/components/country-city-fields";
import { cn } from "@/lib/utils";
import { ORDER_PROCESSING_TIME_OPTIONS } from "@/constants/become-a-partner";
import type { StoreInfoValues } from "../schema/store-info.schema";

interface StoreFieldsProps {
  control: Control<StoreInfoValues>;
  errors: FieldErrors<StoreInfoValues>;
}

interface StoreImageFieldProps extends StoreFieldsProps {
  needsBankVerification: boolean;
  isEmployee: boolean;
}

export function StoreImageField({
  control,
  errors,
  needsBankVerification,
  isEmployee,
}: StoreImageFieldProps) {
  return (
    <Controller
      name="storeImage"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          <FieldLabel className="text-sm font-semibold">
            Store Image <span className="text-red-500">*</span>
          </FieldLabel>
          <ImageUpload
            value={field.value && typeof field.value !== "string" ? [field.value as File] : []}
            onChange={(files) => field.onChange(files[0] || null)}
            onAllImagesChange={(all) => {
              if (all.length === 0) field.onChange(null);
            }}
            initialImages={typeof field.value === "string" ? [field.value] : []}
            maxFiles={1}
            multiple={false}
            label="Upload store image"
            hint="PNG, JPG or WEBP"
            accept="image/jpeg,image/png,image/webp"
            disabled={needsBankVerification || isEmployee}
          />
          {errors.storeImage && (
            <p className="text-xs font-medium text-red-500">
              {errors.storeImage.message as string}
            </p>
          )}
          {isEmployee && (
            <p className="text-[11px] text-slate-400">
              Only store managers can update the store image.
            </p>
          )}
        </div>
      )}
    />
  );
}

interface StorePhoneFieldProps extends StoreFieldsProps {
  activePhoneIso: string;
  needsBankVerification: boolean;
  onPhoneIsoChange: (iso: string) => void;
}

export function StorePhoneField({
  control,
  errors,
  activePhoneIso,
  needsBankVerification,
  onPhoneIsoChange,
}: StorePhoneFieldProps) {
  return (
    <Controller
      name="storePhoneNumber"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <FieldLabel className="text-sm font-semibold">
            Store Phone Number <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            name="storePhoneCode"
            control={control}
            render={({ field: codeField }) => (
              <PhoneInputComponent
                valueMode="national"
                defaultCountry={activePhoneIso}
                value={field.value || ""}
                disabled={needsBankVerification}
                onChange={(val, data) => {
                  if (data) {
                    onPhoneIsoChange(data.countryCode);
                    codeField.onChange(`+${data.dialCode}`);
                    const national = val.startsWith(data.dialCode)
                      ? val.slice(data.dialCode.length)
                      : val;
                    field.onChange(national);
                  } else {
                    field.onChange(val);
                  }
                }}
                error={!!errors.storePhoneNumber}
              />
            )}
          />
          {errors.storePhoneNumber && (
            <p className="text-xs font-medium text-red-500">{errors.storePhoneNumber.message}</p>
          )}
        </div>
      )}
    />
  );
}

interface StoreLocationFieldsProps extends StoreFieldsProps {
  setValue: UseFormSetValue<StoreInfoValues>;
  onPhoneIsoChange: (iso: string) => void;
}

export function StoreLocationFields({
  control,
  errors,
  setValue,
  onPhoneIsoChange,
}: StoreLocationFieldsProps) {
  return (
    <>
      <Controller
        name="storeCountry"
        control={control}
        render={({ field: countryField }) => (
          <Controller
            name="storeCity"
            control={control}
            render={({ field: cityField }) => (
              <CountryCityFields
                prefix="store"
                countryValue={countryField.value || ""}
                cityValue={cityField.value || ""}
                onCountryChange={(val, countryObj) => {
                  countryField.onChange(val);
                  cityField.onChange("");
                  const cName = countryObj?.name || countryObj?.countryName;
                  if (cName) {
                    const matched = findPhoneCountry(cName);
                    if (matched) {
                      onPhoneIsoChange(matched.isoCode);
                      setValue("storePhoneCode", `+${matched.dialCode}`);
                    }
                  }
                }}
                onCityChange={cityField.onChange}
                countryError={errors.storeCountry?.message}
                cityError={errors.storeCity?.message}
                disabled={true}
                countryDisabled={true}
              />
            )}
          />
        )}
      />

      <Controller
        name="storeAddress"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1.5">
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
    </>
  );
}

interface StoreSameDayDeliveryFieldsProps extends StoreFieldsProps {
  setValue: UseFormSetValue<StoreInfoValues>;
}

export function StoreSameDayDeliveryFields({
  control,
  errors,
  setValue,
}: StoreSameDayDeliveryFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-6 dark:border-slate-800/60">
        <FieldLabel className="text-sm font-semibold">
          Does your Store offer same-day delivery? <span className="text-red-500">*</span>
        </FieldLabel>
        <p className="text-xs text-slate-500">
          Let customers know if their orders can be prepared and delivered or picked up on the same
          day.
        </p>

        <Controller
          name="sameDayDelivery"
          control={control}
          render={({ field }) => (
            <div className="grid max-w-sm grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  field.onChange(true);
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                  field.value === true
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm ring-2 ring-emerald-600/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <CheckCircle2
                  className={cn(
                    "size-4",
                    field.value === true ? "text-emerald-600" : "text-slate-400",
                  )}
                />
                Yes
              </button>

              <button
                type="button"
                onClick={() => {
                  field.onChange(false);
                  setValue("orderProcessingTime", "", {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                  field.value === false
                    ? "border-slate-800 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                <XCircle
                  className={cn("size-4", field.value === false ? "text-white" : "text-slate-400")}
                />
                No
              </button>
            </div>
          )}
        />
      </div>

      <Controller
        name="sameDayDelivery"
        control={control}
        render={({ field: sameDayField }) => (
          <>
            {sameDayField.value && (
              <div className="mt-1 flex flex-col gap-1.5 border-t border-slate-100 pt-4 dark:border-slate-800/60">
                <FieldLabel
                  htmlFor="orderProcessingTime"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Estimated Order Processing Time <span className="text-red-500">*</span>
                </FieldLabel>
                <p className="text-xs text-slate-500">
                  Required preparation time before an order is ready for fulfillment.
                </p>
                <Controller
                  name="orderProcessingTime"
                  control={control}
                  render={({ field }) => (
                    <div className="max-w-md pt-1">
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val ?? "");
                        }}
                      >
                        <SelectTrigger
                          id="orderProcessingTime"
                          aria-invalid={!!errors.orderProcessingTime}
                          className={cn(
                            "h-11! w-full rounded-xl border-slate-200 bg-white text-sm",
                            errors.orderProcessingTime && "border-red-400 bg-red-50/30",
                          )}
                        >
                          <SelectValue placeholder="Select processing time" />
                        </SelectTrigger>
                        <SelectContent>
                          {ORDER_PROCESSING_TIME_OPTIONS.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              <div className="flex items-center gap-2">
                                <Clock className="size-3.5 text-emerald-600" />
                                <span>{opt}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.orderProcessingTime && (
                  <p className="text-xs font-medium text-red-500">
                    {errors.orderProcessingTime.message as string}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      />
    </>
  );
}
