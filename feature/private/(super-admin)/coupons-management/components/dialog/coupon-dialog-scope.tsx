"use client";

import { Check, Globe, Store as StoreIcon } from "lucide-react";
import type React from "react";
import { type Control, Controller, type FieldErrors, type UseFormSetValue } from "react-hook-form";

import { StoreSelect } from "@/components/common/store-select";
import { FieldLabel } from "@/components/ui/field";
import type { CouponFormValues } from "../../schema/coupon.schema";

type ScopeSectionProps = {
  control: Control<CouponFormValues>;
  errors: FieldErrors<CouponFormValues>;
  isStoreManager: boolean;
  assignedStoreName: string;
  selectedScope: CouponFormValues["scope"];
  setValue: UseFormSetValue<CouponFormValues>;
  initialStoreName?: string;
};

export function CouponDialogScopeSection({
  isStoreManager,
  assignedStoreName,
  selectedScope,
  setValue,
  control,
  errors,
  initialStoreName,
}: ScopeSectionProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <FieldLabel className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Applicability Scope <span className="text-rose-500">*</span>
        </FieldLabel>
        <span className="text-[11px] text-slate-400">
          {isStoreManager ? "Store restricted" : "Global or store-specific"}
        </span>
      </div>

      {isStoreManager ? (
        <AssignedStoreNotice storeName={assignedStoreName} />
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Global Card */}
            <ScopeOptionCard
              selected={selectedScope === "global"}
              onSelect={() => {
                setValue("scope", "global");
                setValue("storeId", undefined);
              }}
              icon={<Globe className="size-4.5" />}
              title={
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    All Stores (Global)
                  </p>
                </div>
              }
              description="Applies to all products across all stores in the network."
            />

            {/* Specific Store Card */}
            <ScopeOptionCard
              selected={selectedScope === "store"}
              onSelect={() => {
                setValue("scope", "store");
              }}
              icon={<StoreIcon className="size-4.5" />}
              title={
                <p className="text-xs font-bold text-slate-900 dark:text-white">Specific Store</p>
              }
              description="Restricted strictly to products from one chosen store."
            />
          </div>

          {/* Target Store Dropdown if Store is selected */}
          {selectedScope === "store" && (
            <div className="space-y-1.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition dark:border-slate-800 dark:bg-slate-900/60">
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
                    placeholder="Search and choose target store..."
                    initialStoreName={initialStoreName}
                  />
                )}
              />
              {errors.storeId && <p className="text-xs text-rose-500">{errors.storeId.message}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AssignedStoreNotice({ storeName }: { storeName: string }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border border-blue-200/70 bg-linear-to-r from-blue-50/70 to-indigo-50/40 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
        <StoreIcon className="size-5" />
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-blue-950 dark:text-blue-100">
            Store-Specific Promotion
          </p>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/80 dark:text-blue-200">
            Assigned Store
          </span>
        </div>
        <p className="mt-0.5 truncate text-[11px] text-blue-800/80 dark:text-blue-300/80">
          Valid strictly for items at{" "}
          <strong className="text-blue-950 dark:text-white">{storeName}</strong>.
        </p>
      </div>
    </div>
  );
}

type ScopeOptionCardProps = {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: React.ReactNode;
  description: string;
};

function ScopeOptionCard({ selected, onSelect, icon, title, description }: ScopeOptionCardProps) {
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
      className={`group relative flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
        selected
          ? "border-emerald-500 bg-emerald-50/40 shadow-xs ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/20"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/60"
      }`}
    >
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors ${
          selected
            ? "bg-emerald-600 text-white shadow-xs"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 pr-5">
        {title}
        <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <div
        className={`absolute top-3.5 right-3.5 flex size-4.5 items-center justify-center rounded-full border transition-all ${
          selected
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {selected && <Check className="size-3 stroke-[3]" />}
      </div>
    </div>
  );
}
