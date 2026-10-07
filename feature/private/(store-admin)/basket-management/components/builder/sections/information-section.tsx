"use client";

import { useFormContext, useWatch } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import {
  BASKET_DESCRIPTION_MAX,
  BASKET_NAME_MAX,
} from "../../../../../../../constants/basket.constants";
import type { BasketFormValues } from "../../../schema/basket-form.schema";

const labelClass = "text-sm font-semibold text-slate-700 dark:text-slate-200";

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

/** Basket name and description, prefilled from the selected template */
export function InformationFields() {
  const { control } = useFormContext<BasketFormValues>();
  const [basketType, name, description] = useWatch({
    control,
    name: ["basketType", "name", "description"],
  });
  const isTemplate = Boolean(basketType && basketType !== "CUSTOM");

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className={labelClass}>
                Basket Name <span className="text-destructive">*</span>
              </FormLabel>
              <CharCount value={name} max={BASKET_NAME_MAX} />
            </div>
            <FormControl>
              <Input
                {...field}
                placeholder="e.g. Family Essentials"
                className="h-12 rounded-xl text-base"
              />
            </FormControl>
            <p className="text-[11px] text-slate-400">
              {isTemplate
                ? "You can customise the template name to suit your store."
                : "Give your basket a clear name customers will recognise."}
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel className={labelClass}>
                Description <span className="text-destructive">*</span>
              </FormLabel>
              <CharCount value={description} max={BASKET_DESCRIPTION_MAX} />
            </div>
            <FormControl>
              <Textarea
                {...field}
                rows={4}
                placeholder="A selection of everyday essentials, perfect for individuals and small households."
                className="min-h-28 rounded-xl text-base leading-relaxed"
              />
            </FormControl>
            <p className="text-[11px] text-slate-400">
              Required to publish. Drafts can be saved without it.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
