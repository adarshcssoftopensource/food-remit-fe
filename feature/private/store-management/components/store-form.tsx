"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, UserCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applyPlaceToLocationFields } from "@/lib/places/apply-place-to-location-fields";
import React, { useMemo } from "react";
import { useProfile } from "@/components/providers/profile-provider";
import { useGetCountriesDropdown } from "@/feature/private/settings/hooks/use-get-countries-dropdown";
import { getCountryPhoneInfo } from "@/lib/phone";
import { storeSchema, type StoreFormValues } from "../schema/store.schema";
import { CountryCityFields } from "./country-city-fields";
import { ManagerLocationFields } from "./manager-location-fields";
import { PhoneField } from "./phone-field";

interface StoreFormProps {
  initialValues?: Partial<StoreFormValues>;
  onSubmit: (values: StoreFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  mode?: "add" | "edit";
}

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

export function StoreForm({
  initialValues,
  onSubmit,
  submitLabel = "Submit",
  isSubmitting = false,
  mode = "add",
}: StoreFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      storeImage: initialValues?.storeImage ?? undefined,
      storeName: initialValues?.storeName ?? "",
      storePhoneCode: initialValues?.storePhoneCode || "+91",
      storePhoneNumber: initialValues?.storePhoneNumber ?? "",
      storeAddress: initialValues?.storeAddress ?? "",
      address2: initialValues?.address2 ?? "",
      storeCountry: initialValues?.storeCountry ?? "",
      storeCity: initialValues?.storeCity ?? "",
      storeTax: initialValues?.storeTax !== null ? initialValues?.storeTax : undefined,
      foodRemitCommission:
        initialValues?.foodRemitCommission !== null
          ? initialValues?.foodRemitCommission
          : undefined,
      managerImage: initialValues?.managerImage ?? undefined,
      managerFirstName: initialValues?.managerFirstName ?? "",
      managerLastName: initialValues?.managerLastName ?? "",
      managerEmail: initialValues?.managerEmail ?? "",
      managerPhoneCode: initialValues?.managerPhoneCode || "+91",
      managerPhoneNumber: initialValues?.managerPhoneNumber ?? "",
      managerAddress: initialValues?.managerAddress ?? "",
      managerCountry: initialValues?.managerCountry ?? "",
      managerState: initialValues?.managerState ?? "",
      managerCity: initialValues?.managerCity ?? "",
      managerZipCode: initialValues?.managerZipCode ?? "",
    },
    mode: "onBlur",
  });

  const { isSuperAdmin } = useProfile();
  const isNonCommissionDisabled = isSuperAdmin && mode === "edit";

  const { countries: apiCountries } = useGetCountriesDropdown();
  const currentStoreCountry = watch("storeCountry");
  const storePhoneInfo = useMemo(
    () => getCountryPhoneInfo(currentStoreCountry, apiCountries),
    [currentStoreCountry, apiCountries],
  );

  const currentManagerCountry = watch("managerCountry");
  const managerPhoneInfo = useMemo(
    () => getCountryPhoneInfo(currentManagerCountry, apiCountries),
    [currentManagerCountry, apiCountries],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="grid gap-6 p-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className="bg-primary/10 flex size-9 items-center justify-center rounded-xl">
                <Building2 className="text-primary size-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Store Details</h3>
                <p className="text-xs text-slate-500">Basic information about the store</p>
              </div>
            </div>

            <div className="space-y-4 p-6">
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
                      value={
                        field.value && typeof field.value !== "string" ? [field.value as File] : []
                      }
                      initialImages={initialValues?.storeImage ? [initialValues.storeImage] : []}
                      disabled={isNonCommissionDisabled}
                      defaultImage="/default-store.svg"
                    />
                  </FormField>
                )}
              />

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
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50">
                <UserCircle className="size-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Manager Details</h3>
                <p className="text-xs text-slate-500">Information about the store manager</p>
              </div>
            </div>

            <div className="space-y-4 p-6">
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
                    value={
                      field.value && typeof field.value !== "string" ? [field.value as File] : []
                    }
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
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 flex justify-center border-t bg-white px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="h-12 rounded-xl px-12 text-base font-semibold shadow-md transition-transform hover:scale-[1.02]"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
