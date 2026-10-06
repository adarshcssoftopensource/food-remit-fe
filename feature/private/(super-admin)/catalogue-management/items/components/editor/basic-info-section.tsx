import { Package2, Wand2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { NumericInput } from "@/components/common/numeric-input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ITEM_LIMITS, ITEM_NUMBER_MAX } from "@/lib/catalogue/item-rules";
import { cn } from "@/lib/utils";
import { generateUpcCode } from "@/lib/utils/generate-upc";
import type { ItemFormValues } from "../../../hooks/useItemForm";
import { labelClass, Optional, Required, Section, textareaClass } from "./editor-primitives";

export function BasicInfoSection({ autoFocus }: { autoFocus: boolean }) {
  const form = useFormContext<ItemFormValues>();

  return (
    <Section
      icon={<Package2 className="h-4 w-4" />}
      title="Basic information"
      description="What customers see first."
    >
      <div className="space-y-5">
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>
                Item name
                <Required />
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Organic Almond Milk"
                  maxLength={ITEM_LIMITS.productNameMax}
                  autoFocus={autoFocus}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClass}>
                Description
                <Optional />
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A short description of the item"
                  className={cn("min-h-24", textareaClass)}
                  maxLength={ITEM_LIMITS.textMax}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="itemNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>
                  Item number / SKU
                  <Optional />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. MILK-001"
                    maxLength={ITEM_NUMBER_MAX}
                    autoComplete="off"
                    spellCheck={false}
                    className="font-mono placeholder:font-sans"
                    {...field}
                  />
                </FormControl>
                <p className="text-muted-foreground text-[11px]">
                  Your own code for this item. CSV rows with the same item number update it.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="upcCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>
                  UPC / barcode
                  <Optional />
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <NumericInput
                      placeholder="8 to 14 digits"
                      maxLength={14}
                      value={field.value}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      form.setValue("upcCode", generateUpcCode(), {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="h-10 shrink-0 gap-1.5 rounded-xl"
                  >
                    <Wand2 className="h-4 w-4" />
                    Generate
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Section>
  );
}
