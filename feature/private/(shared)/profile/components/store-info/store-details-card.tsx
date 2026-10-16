"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { Building2, CheckCircle2, Mail, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BUSINESS_TYPES } from "@/constants/become-a-partner";
import type { StoreInfoValues } from "../../schema/store-info.schema";
import { StoreImageField } from "./store-image-field";
import { StorePhoneField } from "./store-phone-field";

interface StoreDetailsCardProps {
  control: Control<StoreInfoValues>;
  errors: FieldErrors<StoreInfoValues>;
  needsBankVerification: boolean;
  isEmployee: boolean;
  storeIdDisplay?: string | null;
  effectiveBusinessType: string;
  onBusinessTypeSelect: (newType: string) => void;
  storeEmail: string;
  activePhoneIso: string;
  onPhoneIsoChange: (iso: string) => void;
}

export function StoreDetailsCard({
  control,
  errors,
  needsBankVerification,
  isEmployee,
  storeIdDisplay,
  effectiveBusinessType,
  onBusinessTypeSelect,
  storeEmail,
  activePhoneIso,
  onPhoneIsoChange,
}: StoreDetailsCardProps) {
  return (
    <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
      <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Building2 className="size-5" />
          </div>
          <div className="flex flex-1 flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                Store Details
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                Basic information and contact details of the store
              </CardDescription>
            </div>
            {storeIdDisplay && (
              <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <span className="text-slate-400">Store ID:</span>
                <span className="text-primary font-bold">{storeIdDisplay}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4 sm:p-8">
        <StoreImageField
          control={control}
          errors={errors}
          needsBankVerification={needsBankVerification}
          isEmployee={isEmployee}
          businessType={effectiveBusinessType}
        />

        <div className="grid grid-cols-1 gap-4 pt-2 sm:gap-6 md:grid-cols-2">
          <Controller
            name="storeName"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel className="text-sm font-semibold">
                  Store Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Enter Store Name"
                  disabled={needsBankVerification}
                  className={cn(
                    "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm",
                    "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    errors.storeName &&
                      "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:ring-red-400/15",
                  )}
                />
                {errors.storeName ? (
                  <p className="text-xs font-medium text-red-500">{errors.storeName.message}</p>
                ) : (
                  <p className="text-[11px] text-slate-400">
                    Commercial public name of your store.
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="businessType"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="businessType" className="text-sm font-semibold">
                  Business Type <span className="text-red-500">*</span>
                </FieldLabel>
                <Select
                  value={field.value || effectiveBusinessType}
                  onValueChange={(val) => {
                    if (!val) return;
                    onBusinessTypeSelect(val);
                  }}
                  disabled={needsBankVerification}
                >
                  <SelectTrigger
                    id="businessType"
                    className="h-12 w-full rounded-xl border border-gray-200/80 bg-white text-sm font-medium shadow-xs hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {BUSINESS_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          <span>{type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-slate-400">
                  Operating business category. Changing category recommends a matching storefront
                  image.
                </p>
              </div>
            )}
          />

          {effectiveBusinessType === "Other" && (
            <Controller
              name="otherBusinessType"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <FieldLabel htmlFor="otherBusinessType" className="text-sm font-semibold">
                    Please Specify Business Type <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="otherBusinessType"
                    placeholder="e.g. Food Truck, Specialty Bakery, Cloud Kitchen"
                    disabled={needsBankVerification}
                    aria-invalid={!!errors.otherBusinessType}
                    className={cn(
                      "h-12 rounded-xl border-gray-200/80 bg-gray-50/50 text-sm",
                      "focus-visible:border-[#1B3A8C] focus-visible:bg-white focus-visible:shadow-[0_0_0_4px_rgba(27,58,140,0.1)] focus-visible:ring-[#1B3A8C]/20",
                      "disabled:cursor-not-allowed disabled:opacity-60",
                      errors.otherBusinessType &&
                        "border-red-400 bg-red-50 focus-visible:border-red-400 focus-visible:ring-red-400/15",
                    )}
                  />
                  {errors.otherBusinessType ? (
                    <p className="text-xs font-medium text-red-500">
                      {errors.otherBusinessType.message}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">
                      Specify your custom business classification.
                    </p>
                  )}
                </div>
              )}
            />
          )}

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <FieldLabel className="text-sm font-semibold">Store Email</FieldLabel>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                Verified
              </span>
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={storeEmail}
                readOnly
                disabled
                placeholder="No email registered"
                className="h-12 rounded-xl border-gray-200/80 bg-gray-100/70 pl-10 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-85 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <p className="flex items-start gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>
                <strong>Profile Account Email:</strong> Synced from your profile email (cannot be
                edited here).
              </span>
            </p>
          </div>

          <StorePhoneField
            control={control}
            errors={errors}
            activePhoneIso={activePhoneIso}
            needsBankVerification={needsBankVerification}
            onPhoneIsoChange={onPhoneIsoChange}
            showVerifiedBadge={true}
            disabled={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}
