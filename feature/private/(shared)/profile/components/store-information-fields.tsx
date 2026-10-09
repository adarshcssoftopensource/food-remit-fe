"use client";

import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { CheckCircle2, XCircle, Clock, Leaf, Snowflake, Package } from "lucide-react";

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
import { CountrySelect } from "@/components/common/country-select";
import { CitySelect } from "@/components/common/city-select";
import { cn } from "@/lib/utils";
import { ORDER_PROCESSING_TIME_OPTIONS } from "@/constants/become-a-partner";
import type { StoreInfoValues } from "../schema/store-info.schema";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { getDefaultStoreImageForBusinessType } from "@/constants/default-store-images";
import Image from "next/image";

interface StoreFieldsProps {
  control: Control<StoreInfoValues>;
  errors: FieldErrors<StoreInfoValues>;
}

interface StoreImageFieldProps extends StoreFieldsProps {
  needsBankVerification: boolean;
  isEmployee: boolean;
  businessType?: string | null;
}

export function StoreImageField({
  control,
  errors,
  needsBankVerification,
  isEmployee,
  businessType,
}: StoreImageFieldProps) {
  const defaultImageInfo =
    businessType && businessType !== "Other"
      ? getDefaultStoreImageForBusinessType(businessType)
      : undefined;

  const defaultImageUrl = defaultImageInfo?.imageUrl || "/default-store.svg";
  const defaultLabel = defaultImageInfo?.label || "Default Store";

  return (
    <Controller
      name="storeImage"
      control={control}
      render={({ field }) => {
        const hasNoImage = !field.value || (Array.isArray(field.value) && field.value.length === 0);

        return (
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
              initialImages={typeof field.value === "string" && field.value ? [field.value] : []}
              maxFiles={1}
              multiple={false}
              label="Upload store image"
              hint="PNG, JPG or WEBP"
              accept="image/jpeg,image/png,image/webp"
              disabled={needsBankVerification || isEmployee}
            />

            {hasNoImage && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={defaultImageUrl}
                    alt={defaultLabel}
                    height={20}
                    width={20}
                    className="size-9 shrink-0 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      Default {defaultLabel} Image
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Will be saved automatically if no custom image is uploaded.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.onChange(defaultImageUrl)}
                  disabled={needsBankVerification || isEmployee}
                  className="h-8 shrink-0 rounded-lg text-xs font-semibold"
                >
                  Use Default
                </Button>
              </div>
            )}

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
        );
      }}
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
  const countryValue = useWatch({ control, name: "storeCountry" });

  return (
    <>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                    ? "border-rose-400 bg-rose-50 text-rose-950 shadow-sm ring-2 ring-rose-500/20 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
                )}
              >
                <XCircle
                  className={cn(
                    "size-4",
                    field.value === false ? "text-rose-600 dark:text-rose-400" : "text-slate-400",
                  )}
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

export const PRODUCT_SCREENING_ITEMS = [
  {
    name: "perishableProducts" as const,
    label: "Perishable Products",
    description: "Items subject to decay or spoilage, requiring prompt delivery or pickup.",
    icon: Leaf,
    badgeText: "Fresh Produce & Bakery",
    iconBg: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  },
  {
    name: "refrigeratedProducts" as const,
    label: "Refrigerated Products",
    description: "Items requiring cold storage conditions (2°C – 8°C) to maintain freshness.",
    icon: Snowflake,
    badgeText: "Cold Chain Dairy & Chilled",
    iconBg: "bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400",
  },
  {
    name: "frozenProducts" as const,
    label: "Frozen Products",
    description: "Items requiring sub-zero freezing and frozen preservation.",
    icon: Package,
    badgeText: "Deep Freeze & Frozen Goods",
    iconBg: "bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400",
  },
];

export interface StoreProductScreeningFieldsProps<TFieldValues extends FieldValues = any> {
  control: Control<TFieldValues>;
  setValue?: UseFormSetValue<TFieldValues>;
  disabled?: boolean;
}

export function StoreProductScreeningFields<TFieldValues extends FieldValues = any>({
  control,
  setValue,
  disabled = false,
}: StoreProductScreeningFieldsProps<TFieldValues>) {
  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <FieldLabel className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Product Screening Requirements
        </FieldLabel>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Indicate which fresh or temperature-controlled product types your store carries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 pt-1 sm:grid-cols-3">
        {PRODUCT_SCREENING_ITEMS.map((item) => {
          const IconComponent = item.icon;
          return (
            <Controller
              key={item.name}
              name={item.name as any}
              control={control}
              render={({ field }) => {
                const isSelected = field.value === true;
                return (
                  <div
                    className={cn(
                      "flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 sm:p-4.5",
                      isSelected
                        ? "border-emerald-400/90 bg-linear-to-b from-emerald-50/50 via-white to-white shadow-xs ring-2 ring-emerald-600/15 dark:border-emerald-700 dark:bg-slate-900/60"
                        : "border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/30",
                    )}
                  >
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <div
                          className={cn(
                            "flex size-8.5 items-center justify-center rounded-xl ring-2 ring-black/5 dark:ring-white/5",
                            item.iconBg,
                          )}
                        >
                          <IconComponent className="size-4" />
                        </div>
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            <CheckCircle2 className="size-3" /> Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-rose-500/20 dark:bg-rose-950/40 dark:text-rose-300">
                            <XCircle className="size-3 text-rose-500 dark:text-rose-400" /> Not
                            Offered
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold tracking-wide text-slate-800 uppercase dark:text-slate-200">
                        {item.label}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
                      <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                        Handling
                      </span>
                      <div className="inline-flex rounded-lg border border-slate-200/70 bg-slate-100/90 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            if (setValue) {
                              setValue(item.name as any, true as any, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            } else {
                              field.onChange(true);
                            }
                          }}
                          className={cn(
                            "flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60",
                            isSelected
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "text-slate-600 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-300",
                          )}
                        >
                          <CheckCircle2 className="size-3" /> Yes
                        </button>
                        <button
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            if (setValue) {
                              setValue(item.name as any, false as any, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            } else {
                              field.onChange(false);
                            }
                          }}
                          className={cn(
                            "flex cursor-pointer items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60",
                            field.value === false
                              ? "bg-rose-600 text-white shadow-xs dark:bg-rose-600"
                              : "text-slate-600 hover:text-rose-700 dark:text-slate-400 dark:hover:text-rose-300",
                          )}
                        >
                          <XCircle className="size-3" /> No
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
