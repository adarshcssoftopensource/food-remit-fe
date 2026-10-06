import { Boxes } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  PackSizeOptionsField,
  type PackSizeOptionErrors,
} from "@/components/common/pack-size-options-field";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import type { ItemFormValues } from "../../../hooks/useItemForm";
import { Required, Section } from "./editor-primitives";

type PackOptionsSectionProps = {
  currencySymbol: string | null;
  disabled: boolean;
};

export function PackOptionsSection({ currencySymbol, disabled }: PackOptionsSectionProps) {
  const form = useFormContext<ItemFormValues>();

  const optionErrors = form.formState.errors.options;
  const rowErrors = Array.isArray(optionErrors)
    ? (optionErrors as Array<Record<string, { message?: string }> | undefined>).map((row) =>
        row
          ? (Object.fromEntries(
              Object.entries(row).map(([key, err]) => [key, err?.message]),
            ) as PackSizeOptionErrors)
          : undefined,
      )
    : undefined;
  const rootError =
    (optionErrors as { message?: string } | undefined)?.message ??
    (optionErrors as { root?: { message?: string } } | undefined)?.root?.message;

  return (
    <Section
      icon={<Boxes className="h-4 w-4" />}
      title={
        <>
          Pack / Size &amp; price options
          <Required />
        </>
      }
      description="Each pack or size a customer can buy, with its own price."
      aside={
        currencySymbol ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Prices in {currencySymbol}
          </span>
        ) : null
      }
    >
      <FormField
        control={form.control}
        name="options"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <PackSizeOptionsField
                value={field.value}
                onChange={field.onChange}
                currencySymbol={currencySymbol}
                rowErrors={rowErrors}
                disabled={disabled}
              />
            </FormControl>
            {rootError && <p className="text-destructive text-xs font-medium">{rootError}</p>}
          </FormItem>
        )}
      />
    </Section>
  );
}
