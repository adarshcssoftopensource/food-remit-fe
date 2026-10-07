"use client";

import { ArrowLeftRight, FileText, User, Users, UsersRound } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  BASKET_DESCRIPTION_MAX,
  BASKET_NAME_MAX,
  BASKET_SHORT_DESCRIPTION_MAX,
  BASKET_TYPE_MAP,
  HOUSEHOLD_SIZE_OPTIONS,
} from "../../../constants/basket.constants";
import type { BasketFormValues } from "../../../schema/basket-form.schema";
import { BasketImage } from "../../shared/basket-image";
import { StepHeader } from "../step-header";

const labelClass = "text-sm font-semibold text-slate-700 dark:text-slate-200";
const HOUSEHOLD_ICONS = { "1-2": User, "3-5": Users, "6+": UsersRound } as Record<
  string,
  typeof User
>;

function CharCount({ value, max }: { value: string; max: number }) {
  const ratio = value.length / max;
  return (
    <span
      className={cn(
        "text-[11px] font-medium tabular-nums",
        ratio > 1 ? "text-destructive" : ratio > 0.85 ? "text-amber-600" : "text-slate-400",
      )}
    >
      {value.length}/{max}
    </span>
  );
}

export function InfoStep({ onChangeType }: { onChangeType: () => void }) {
  const { control } = useFormContext<BasketFormValues>();
  const [basketType, name, shortDescription, description] = useWatch({
    control,
    name: ["basketType", "name", "shortDescription", "description"],
  });
  const typeMeta = basketType ? BASKET_TYPE_MAP[basketType] : null;

  return (
    <div className="space-y-6">
      <StepHeader
        step={2}
        icon={FileText}
        title="Basket information"
        description="Give your basket a clear name and description. Customers see this on the Food Remit marketplace."
      />

      {typeMeta && basketType && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-2.5 pr-4 dark:border-slate-800 dark:bg-slate-900/50">
          <BasketImage
            basketType={basketType}
            alt={typeMeta.label}
            className="size-14 shrink-0 rounded-xl"
            sizes="56px"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
              Basket type
            </p>
            <p className="truncate font-bold">{typeMeta.label}</p>
            <p className="text-primary text-xs font-medium">{typeMeta.tagline}</p>
          </div>
          <button
            type="button"
            onClick={onChangeType}
            className="text-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            <ArrowLeftRight className="size-3.5" /> Change
          </button>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className={labelClass}>
                  Basket name <span className="text-destructive">*</span>
                </FormLabel>
                <CharCount value={name} max={BASKET_NAME_MAX} />
              </div>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Family Essentials"
                  className="h-12 rounded-xl text-base"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className={labelClass}>Tagline</FormLabel>
                <CharCount value={shortDescription} max={BASKET_SHORT_DESCRIPTION_MAX} />
              </div>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Everyday essentials for families"
                  className="h-12 rounded-xl text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className={labelClass}>Description</FormLabel>
              <CharCount value={description} max={BASKET_DESCRIPTION_MAX} />
            </div>
            <FormControl>
              <Textarea
                {...field}
                rows={5}
                placeholder="A balanced selection of staple foods and household essentials. Great value and quality items for everyday living."
                className="min-h-32 rounded-xl text-base leading-relaxed"
              />
            </FormControl>
            <p className="text-[11px] text-slate-400">
              Mention who it&apos;s for and what makes it good value.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="householdSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={labelClass}>Who is this basket for?</FormLabel>
            <div
              role="radiogroup"
              aria-label="Target household size"
              className="grid grid-cols-2 gap-3 lg:grid-cols-4"
            >
              {[...HOUSEHOLD_SIZE_OPTIONS, { value: "", label: "Any size" }].map((option) => {
                const active = field.value === option.value;
                const Icon = HOUSEHOLD_ICONS[option.value] ?? UsersRound;
                return (
                  <button
                    key={option.value || "none"}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-sm font-semibold transition-all",
                      active
                        ? "border-primary bg-primary/5 text-primary shadow-md shadow-emerald-600/10"
                        : "border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-700 dark:text-slate-300",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl transition-colors",
                        active
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800",
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    {option.label}
                  </button>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
