import { Warehouse } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { NumericInput } from "@/components/common/numeric-input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { ItemFormValues } from "../../../hooks/useItemForm";
import { labelClass, Optional, Required, Section } from "./editor-primitives";

export function InventorySection() {
  const form = useFormContext<ItemFormValues>();

  return (
    <Section
      icon={<Warehouse className="h-4 w-4" />}
      title="Inventory"
      description="Stock and offers for this item."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="quantityOnHand"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>
                  Quantity on hand
                  <Required />
                </FormLabel>
                <FormControl>
                  <NumericInput
                    placeholder="0"
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>
                  Discount
                  <Optional />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <NumericInput
                      decimals={2}
                      placeholder="0"
                      value={field.value}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      className="pr-8"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-slate-400">
                      %
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="-mt-2 text-xs leading-5 text-slate-500">
          Items with 0 on hand are saved as inactive until restocked.
        </p>

        <FormField
          control={form.control}
          name="isPerishable"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
              <div className="space-y-0.5">
                <FormLabel className={labelClass}>Perishable item</FormLabel>
                <FormDescription className="text-xs leading-5">
                  Uses the shorter pickup reminder schedule.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </Section>
  );
}
