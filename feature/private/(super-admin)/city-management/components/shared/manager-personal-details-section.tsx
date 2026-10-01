"use client";

import { Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext, type FieldErrors } from "react-hook-form";

import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInputComponent } from "@/components/ui/phone-input";
import { cn } from "@/lib/utils";
import { FormFieldError } from "./form-field-error";
import { MANAGER_INPUT_CLASS, type ManagerFormBaseValues } from "./manager-form.types";
import { SectionShell } from "./section-shell";

type ManagerPersonalDetailsSectionProps = {
  mode: "add" | "edit";
  errors: FieldErrors<ManagerFormBaseValues>;
};

export function ManagerPersonalDetailsSection({
  mode,
  errors,
}: ManagerPersonalDetailsSectionProps) {
  const [phoneIso, setPhoneIso] = useState<string | undefined>(undefined);
  const { control, setValue } = useFormContext<ManagerFormBaseValues>();
  const inputClass = MANAGER_INPUT_CLASS;

  return (
    <SectionShell
      icon={UserRound}
      title="Personal Details"
      subtitle="Basic identity & contact"
      accent="bg-sky-100 text-sky-700"
    >
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <div>
                <FieldLabel className="mb-1.5 text-sm font-semibold">
                  First Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder="Enter first name" className={inputClass} />
                <FormFieldError message={errors.firstName?.message} />
              </div>
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <div>
                <FieldLabel className="mb-1.5 text-sm font-semibold">
                  Last Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input {...field} placeholder="Enter last name" className={inputClass} />
                <FormFieldError message={errors.lastName?.message} />
              </div>
            )}
          />
        </div>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <div>
              <FieldLabel className="mb-1.5 text-sm font-semibold">
                Email Address <span className="text-red-500">*</span>
              </FieldLabel>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  {...field}
                  type="email"
                  placeholder="name@example.com"
                  disabled={mode === "edit"}
                  className={cn(inputClass, "pl-10")}
                />
              </div>
              <FormFieldError message={errors.email?.message} />
            </div>
          )}
        />

        <div>
          <FieldLabel className="mb-1.5 text-sm font-semibold">
            Phone Number <span className="text-red-500">*</span>
          </FieldLabel>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: numberField }) => (
              <Controller
                name="phoneCode"
                control={control}
                render={() => (
                  <PhoneInputComponent
                    valueMode="national"
                    disabled={mode === "edit"}
                    defaultCountry={phoneIso || "US"}
                    value={numberField.value || ""}
                    onChange={(val, data) => {
                      if (data && data.dialCode) {
                        const dialCode = data.dialCode;
                        let nationalNumber = val;
                        if (val.startsWith(dialCode)) {
                          nationalNumber = val.slice(dialCode.length);
                        }
                        setPhoneIso(data.countryCode);
                        setValue("phoneCode", "+" + dialCode, { shouldValidate: true });
                        setValue("phoneNumber", nationalNumber, { shouldValidate: true });
                      } else {
                        setValue("phoneNumber", val, { shouldValidate: true });
                      }
                    }}
                    onBlur={numberField.onBlur}
                    error={!!(errors.phoneCode || errors.phoneNumber)}
                  />
                )}
              />
            )}
          />
          <FormFieldError message={errors.phoneCode?.message || errors.phoneNumber?.message} />
        </div>
      </div>
    </SectionShell>
  );
}
