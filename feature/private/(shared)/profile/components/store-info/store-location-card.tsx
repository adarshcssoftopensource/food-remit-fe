"use client";

import { Control, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Lock, MapPin } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StoreInfoValues } from "../../schema/store-info.schema";
import { StoreLocationFields } from "./store-location-fields";

interface StoreLocationCardProps {
  control: Control<StoreInfoValues>;
  errors: FieldErrors<StoreInfoValues>;
  setValue: UseFormSetValue<StoreInfoValues>;
  onPhoneIsoChange: (iso: string) => void;
}

export function StoreLocationCard({
  control,
  errors,
  setValue,
  onPhoneIsoChange,
}: StoreLocationCardProps) {
  return (
    <Card className="brand-glass-card rounded-3xl border border-white/60 shadow-[0_8px_30px_rgba(14,42,75,0.04)] backdrop-blur-xl dark:border-slate-800/60">
      <CardHeader className="border-b border-slate-200/60 bg-slate-50/50 px-4 py-4 sm:px-8 sm:py-6 dark:border-slate-800/60 dark:bg-slate-900/40">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <MapPin className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl dark:text-slate-100">
                Store Location & Address
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
                Physical address and regional location details of the store.
              </CardDescription>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Lock className="size-3 text-slate-400" />
            <span>Permanent Store Location</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-8">
        <StoreLocationFields
          control={control}
          errors={errors}
          setValue={setValue}
          onPhoneIsoChange={onPhoneIsoChange}
        />
      </CardContent>
    </Card>
  );
}
