"use client";

import { Controller } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";

import { FieldLabel } from "@/components/ui/field";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import type { StoreFieldsProps } from "./store-image-field";

export interface StorePhoneFieldProps extends StoreFieldsProps {
  activePhoneIso: string;
  needsBankVerification: boolean;
  onPhoneIsoChange: (iso: string) => void;
  showVerifiedBadge?: boolean;
  disabled?: boolean;
}

export function StorePhoneField({
  control,
  errors,
  activePhoneIso,
  needsBankVerification,
  onPhoneIsoChange,
  showVerifiedBadge = false,
  disabled = false,
}: StorePhoneFieldProps) {
  const isFieldDisabled = disabled || needsBankVerification;

  return (
    <Controller
      name="storePhoneNumber"
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <FieldLabel className="text-sm font-semibold">
              Store Phone Number <span className="text-red-500">*</span>
            </FieldLabel>
            {showVerifiedBadge && (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                Verified
              </span>
            )}
          </div>
          <Controller
            name="storePhoneCode"
            control={control}
            render={({ field: codeField }) => (
              <PhoneInputComponent
                valueMode="national"
                defaultCountry={activePhoneIso}
                value={field.value || ""}
                disabled={isFieldDisabled}
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
          {errors.storePhoneNumber ? (
            <p className="text-xs font-medium text-red-500">{errors.storePhoneNumber.message}</p>
          ) : isFieldDisabled ? (
            <p className="text-[11px] text-slate-400">
              Verified phone number registered with this store (cannot be edited here).
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">Primary phone number for store operations.</p>
          )}
        </div>
      )}
    />
  );
}
