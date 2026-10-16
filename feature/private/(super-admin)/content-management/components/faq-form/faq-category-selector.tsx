"use client";

import { Check, CreditCard, HelpCircle, ShoppingBag, Store, User } from "lucide-react";
import { type Control, Controller } from "react-hook-form";

import { FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { type FaqFormValues } from "../../schema/content.schema";
import { FAQ_STATIC_CATEGORIES, type FaqCategoryKey } from "../../types";

const CATEGORY_ICONS: Record<FaqCategoryKey, React.ComponentType<{ className?: string }>> = {
  order: ShoppingBag,
  payments: CreditCard,
  account: User,
  pickup: Store,
  general: HelpCircle,
};

interface FaqCategorySelectorProps {
  control: Control<FaqFormValues>;
  error?: string;
}

export function FaqCategorySelector({ control, error }: FaqCategorySelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel className="text-sm font-semibold text-slate-800">
          Category <span className="text-red-500">*</span>
        </FieldLabel>
        <span className="text-xs text-slate-500">Choose category</span>
      </div>

      <Controller
        name="categoryKey"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
            {FAQ_STATIC_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.key];
              const isSelected = field.value === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => field.onChange(cat.key)}
                  className={cn(
                    "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition-all outline-none",
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20"
                      : "border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50/70 hover:text-slate-900",
                  )}
                >
                  {isSelected ? (
                    <div className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <Check className="size-2.5" />
                    </div>
                  ) : null}
                  <div
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg transition-colors",
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800",
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-xs font-semibold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}
      />
      {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
    </div>
  );
}
