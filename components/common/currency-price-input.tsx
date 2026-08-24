"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { resolveCurrencyDisplay } from "@/lib/currency";
import { cn } from "@/lib/utils";

type CurrencyPriceInputProps = {
  value: string;
  onChange: (value: string) => void;
  currency?: string | null;
  currencySymbol?: string | null;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  id?: string;
};

export function CurrencyPriceInput({
  value,
  onChange,
  currency,
  currencySymbol,
  placeholder = "0.00",
  disabled,
  invalid,
  className,
  id,
}: CurrencyPriceInputProps) {
  const meta = resolveCurrencyDisplay(currency);
  const symbol = currencySymbol || meta.symbol || "$";
  const code = meta.code || "USD";
  const safeValue = value ?? "";

  return (
    <InputGroup
      className={cn("h-10 rounded-xl bg-white dark:bg-slate-950", className)}
      data-invalid={invalid || undefined}
    >
      <InputGroupAddon align="inline-start">
        <InputGroupText className="min-w-10 justify-center font-semibold text-slate-700 dark:text-slate-200">
          {symbol}
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        type="number"
        inputMode="decimal"
        min={0}
        step="0.01"
        value={safeValue}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-6"
      />
      {code && code !== symbol ? (
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            {code}
          </InputGroupText>
        </InputGroupAddon>
      ) : null}
    </InputGroup>
  );
}
