"use client";

import { Check, Globe, Store as StoreIcon } from "lucide-react";
import type React from "react";
import { type Control, Controller, type FieldErrors, type UseFormSetValue } from "react-hook-form";

import { StoreSelect } from "@/components/common/store-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import type { CouponFormValues } from "../../schema/coupon.schema";

type ScopeCardProps = {
  control: Control<CouponFormValues>;
  errors: FieldErrors<CouponFormValues>;
  isStoreManager: boolean;
  assignedStoreName: string;
  watchedScope: CouponFormValues["scope"];
  setValue: UseFormSetValue<CouponFormValues>;
  initialStoreName?: string;
};

export function CouponPageScopeCard({
  isStoreManager,
  assignedStoreName,
  watchedScope,
  setValue,
  control,
  errors,
  initialStoreName,
}: ScopeCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <CardHeader className="border-b border-slate-100 px-6 py-4.5 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
            Target Scope & Applicability
          </CardTitle>
          <span className="text-[11px] font-medium text-slate-400">
            {isStoreManager ? "Store restricted" : "Global or store-specific"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        {isStoreManager ? (
          <AssignedStoreNotice storeName={assignedStoreName} />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {/* Global Radio Card */}
              <ScopeRadioCard
                selected={watchedScope === "global"}
                onSelect={() => {
                  setValue("scope", "global");
                  setValue("storeId", undefined);
                }}
                icon={<Globe className="size-5" />}
                title="All Stores (Global Promo)"
                description="Valid for all products ordered across every active store in FoodRemit."
              />

              {/* Specific Store Radio Card */}
              <ScopeRadioCard
                selected={watchedScope === "store"}
                onSelect={() => {
                  setValue("scope", "store");
                }}
                icon={<StoreIcon className="size-5" />}
                title="Specific Store Only"
                description="Restricted exclusively to items from a single chosen store."
              />
            </div>

            {/* Target Store Selector with Search */}
            {watchedScope === "store" && (
              <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition dark:border-slate-800 dark:bg-slate-900/60">
                <FieldLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Choose Target Store <span className="text-rose-500">*</span>
                </FieldLabel>
                <Controller
                  name="storeId"
                  control={control}
                  render={({ field }) => (
                    <StoreSelect
                      value={field.value ?? ""}
                      onValueChange={(val) => field.onChange(val)}
                      placeholder="Search and choose store from database (100K+ stores)..."
                      initialStoreName={initialStoreName}
                    />
                  )}
                />
                {errors.storeId && (
                  <p className="text-xs text-rose-500">{errors.storeId.message}</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AssignedStoreNotice({ storeName }: { storeName: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-blue-200/70 bg-linear-to-r from-blue-50/70 to-indigo-50/40 p-4.5 dark:border-blue-900/40 dark:bg-blue-950/20">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
        <StoreIcon className="size-5.5" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-blue-950 dark:text-blue-100">
            Store-Specific Promotion
          </p>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/80 dark:text-blue-200">
            Assigned Store
          </span>
        </div>
        <p className="mt-1 text-xs text-blue-800/80 dark:text-blue-300/80">
          This promotion applies strictly to items from{" "}
          <strong className="text-blue-950 dark:text-white">{storeName}</strong>. It will not apply
          to any other store.
        </p>
      </div>
    </div>
  );
}

type ScopeRadioCardProps = {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
};

function ScopeRadioCard({ selected, onSelect, icon, title, description }: ScopeRadioCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect();
        }
      }}
      className={`group relative flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4.5 text-left transition-all ${
        selected
          ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60"
      }`}
    >
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
          selected
            ? "bg-emerald-600 text-white shadow-xs"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 pr-6">
        <p className="text-xs font-bold text-slate-900 sm:text-sm dark:text-white">{title}</p>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div
        className={`absolute top-4 right-4 flex size-5 items-center justify-center rounded-full border transition-all ${
          selected
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {selected && <Check className="size-3 stroke-3" />}
      </div>
    </div>
  );
}
