"use client";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { CountrySelect } from "@/components/common/country-select";
import { WorldCitySelect } from "@/components/common/world-city-select";
import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PhoneInputComponent from "@/components/ui/phone-input";
import { EmployeeFormValues } from "@/feature/private/(store-admin)/employee-management/schema/employee.schema";
import { toPhoneDigits } from "@/lib/phone";
import { Contact, Globe2, MapPin, Save, UserCircle, UserPen, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { findPhoneCountry } from "@/components/ui/phone-input-utils";

type EmployeeForm = UseFormReturn<EmployeeFormValues>;

function getSubmitLabel(isPending: boolean, isEdit: boolean) {
  if (isPending) return isEdit ? "Updating..." : "Adding...";
  return isEdit ? "Update Employee" : "Add Employee";
}

function getInitialImages(value: EmployeeFormValues["image"]) {
  if (!value) return [];
  return value instanceof File ? [URL.createObjectURL(value)] : [value as string];
}

export function EmployeeDialogHeader({ isEdit }: { isEdit: boolean }) {
  return (
    <DialogHeader className="shrink-0 border-b bg-linear-to-r from-slate-50 via-slate-100 to-slate-50 px-4 py-3.5 sm:px-6 sm:py-5">
      <div className="flex flex-col items-center text-center">
        <DialogTitle className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-800 sm:gap-3 sm:text-2xl">
          {isEdit ? (
            <UserPen className="h-5 w-5 text-emerald-600 sm:h-7 sm:w-7" strokeWidth={2.2} />
          ) : (
            <UserPlus className="h-5 w-5 text-emerald-600 sm:h-7 sm:w-7" strokeWidth={2.2} />
          )}

          <span>{isEdit ? "Edit Employee" : "Add New Employee"}</span>
        </DialogTitle>

        <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
          {isEdit
            ? "Update the employee's profile, contact details, and permissions."
            : "Create a new employee profile and provide them access to your organization."}
        </p>
      </div>
    </DialogHeader>
  );
}

export function EmployeeImageField({ form }: { form: EmployeeForm }) {
  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="w-full">
              <ImageUpload
                maxFiles={1}
                onChange={(files) => {
                  if (files && files.length > 0) {
                    field.onChange(files[0]);
                  }
                }}
                onAllImagesChange={(allImages) => {
                  if (!allImages || allImages.length === 0) {
                    field.onChange("");
                  }
                }}
                initialImages={getInitialImages(field.value)}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function EmployeePersonalDetailsSection({ form }: { form: EmployeeForm }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50">
          <UserCircle className="size-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Personal Details</h3>
          <p className="text-xs text-slate-500">Employee&apos;s core identity</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-slate-700">
                First Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="John" className="h-11 rounded-xl bg-slate-50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-slate-700">
                Last Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Doe" className="h-11 rounded-xl bg-slate-50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

interface EmployeeContactSectionProps {
  form: EmployeeForm;
  isEdit: boolean;
  phoneIso: string | undefined;
  targetCountryIso: string;
  setPhoneIso: (iso: string | undefined) => void;
}

export function EmployeeContactSection({
  form,
  isEdit,
  phoneIso,
  targetCountryIso,
  setPhoneIso,
}: EmployeeContactSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50">
          <Contact className="size-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Contact Information</h3>
          <p className="text-xs text-slate-500">How to reach this employee</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-slate-700">
                Email <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="h-11 rounded-xl bg-slate-50"
                  disabled={isEdit}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold text-slate-700">
                Phone Number <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PhoneInputComponent
                  valueMode="national"
                  defaultCountry={phoneIso || targetCountryIso}
                  value={field.value || ""}
                  onChange={(val, data) => {
                    if (data && data.dialCode) {
                      const dialCode = data.dialCode;
                      let nationalNumber = val;
                      if (val.startsWith(dialCode)) {
                        nationalNumber = val.slice(dialCode.length);
                      }
                      setPhoneIso(data.countryCode);
                      form.setValue("countryCode", "+" + dialCode, {
                        shouldValidate: true,
                      });
                      field.onChange(nationalNumber);
                    } else {
                      field.onChange(toPhoneDigits(val));
                    }
                  }}
                  error={!!form.formState.errors.phoneNumber || !!form.formState.errors.countryCode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

interface EmployeeLocationSectionProps {
  form: EmployeeForm;
  targetCountryIso: string;
  targetCountryName: string;
  onPlaceSelect: (place: any) => void;
}

export function EmployeeLocationSection({
  form,
  targetCountryIso,
  targetCountryName,
  onPlaceSelect,
}: EmployeeLocationSectionProps) {
  const [countryIso, setCountryIso] = useState<string>(targetCountryIso || "");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-violet-50">
            <MapPin className="size-5 text-violet-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Location</h3>
            <p className="text-xs text-slate-500">Employee residential address</p>
          </div>
        </div>
        {targetCountryName && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-2xs">
            <Globe2 className="size-3.5 text-slate-400" />
            {targetCountryName}
          </span>
        )}
      </div>
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-slate-700">
                  Country <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <CountrySelect
                    value={field.value}
                    valueKey="name"
                    disabled={true}
                    onValueChange={(val, country) => {
                      field.onChange(val);
                      const newIso = country?.countryCode || findPhoneCountry(val)?.isoCode || "";
                      setCountryIso(newIso);
                      form.setValue("address", "");
                      form.setValue("city", "");
                      form.setValue("state", "");
                      form.setValue("zipCode", "");
                    }}
                    placeholder="Select Country"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                  />
                </FormControl>
                <p className="text-[11px] text-slate-400">Country cannot be changed</p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-slate-700">Address</FormLabel>
                <FormControl className="w-full">
                  <AddressAutocompleteInput
                    countryCode={countryIso}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onPlaceSelect={(place) => {
                      onPlaceSelect(place);
                      if (place.country) {
                        form.setValue("country", place.country, { shouldDirty: true });
                      }
                    }}
                    placeholder={`Search for an address`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-slate-700">
                  City <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <WorldCitySelect
                    value={field.value}
                    countryIsoCode={countryIso}
                    onValueChange={(val) => field.onChange(val)}
                    placeholder="Select City"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-slate-700">State</FormLabel>
                <FormControl>
                  <Input placeholder="State" className="h-11 rounded-xl bg-slate-50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-slate-700">Zip Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Zip Code"
                    className="h-11 rounded-xl bg-slate-50"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

interface EmployeeDialogFooterProps {
  isPending: boolean;
  isEdit: boolean;
  onCancel: () => void;
}

export function EmployeeDialogFooter({ isPending, isEdit, onCancel }: EmployeeDialogFooterProps) {
  return (
    <div className="shrink-0 border-t border-slate-100 bg-white px-4 py-3 shadow-xs sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-3xl items-center gap-2.5 sm:justify-end sm:gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-11 flex-1 rounded-xl border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:min-w-28 sm:flex-initial sm:px-5"
          onClick={onCancel}
        >
          <X size={16} /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          className="shadow-primary/20 h-11 flex-1 rounded-xl px-3 text-sm font-semibold shadow-md sm:min-w-36 sm:flex-initial sm:px-6"
        >
          <Save size={16} />
          {getSubmitLabel(isPending, isEdit)}
        </Button>
      </div>
    </div>
  );
}
