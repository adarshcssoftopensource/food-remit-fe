"use client";

import { AddressAutocompleteInput } from "@/components/common/address-autocomplete-input";
import { ImageUpload } from "@/components/common/image-upload";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PhoneInputComponent from "@/components/ui/phone-input";
import { EmployeeFormValues } from "@/feature/private/(store-admin)/employee-management/schema/employee.schema";
import { toPhoneDigits } from "@/lib/phone";
import { Contact, Globe2, MapPin, Save, UserCircle, UserPen, UserPlus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

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
    <DialogHeader className="shrink-0 border-b bg-linear-to-r from-slate-50 via-slate-100 to-slate-50 px-6 py-6">
      <div className="flex flex-col items-center text-center">
        <DialogTitle className="flex gap-6 text-2xl font-bold tracking-tight text-slate-800">
          {isEdit ? (
            <UserPen className="h-7 w-7" strokeWidth={2.2} />
          ) : (
            <UserPlus className="h-7 w-7" strokeWidth={2.2} />
          )}

          {isEdit ? "Edit Employee" : "Add New Employee"}
        </DialogTitle>

        <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
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
                onChange={(files) => field.onChange(files[0] || undefined)}
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
        <div className="w-full">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-slate-700">Address</FormLabel>
                <FormControl className="w-full">
                  <AddressAutocompleteInput
                    countryCode={targetCountryIso}
                    value={field.value || ""}
                    onChange={field.onChange}
                    onPlaceSelect={onPlaceSelect}
                    placeholder={`Search for an address in ${targetCountryName}`}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-slate-700">City</FormLabel>
                <FormControl>
                  <Input placeholder="City" className="h-11 rounded-xl bg-slate-50" {...field} />
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
    <div className="sticky bottom-0 z-10 flex justify-center border-t bg-white px-6 py-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <div className="flex gap-4">
        <Button
          variant="destructive"
          className="h-12 rounded-xl px-8 text-base font-medium transition-transform hover:scale-[1.02]"
          onClick={onCancel}
        >
          <X size={16} /> Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-xl px-12 text-base font-semibold shadow-md transition hover:scale-[1.02]"
        >
          <Save size={16} />
          {getSubmitLabel(isPending, isEdit)}
        </Button>
      </div>
    </div>
  );
}
