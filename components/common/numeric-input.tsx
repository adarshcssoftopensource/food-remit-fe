"use client";

import * as React from "react";

import { sanitizeNumericInput } from "@/components/common/numeric-input-utils";
import { Input } from "@/components/ui/input";

type NumericInputProps = Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> & {
  value: string | undefined;
  onValueChange: (value: string) => void;
  /** Allow a decimal part. Off = whole numbers only. */
  decimals?: number;
};

const BLOCKED_KEYS = new Set(["-", "+", "e", "E"]);

/**
 * Text input that can only hold a non-negative number: minus, plus and
 * exponent keys are blocked and pasted text is sanitised. Uses
 * `inputMode` instead of `type="number"` so the scroll wheel and locale
 * quirks can't produce negative or malformed values.
 */
export function NumericInput({
  value,
  onValueChange,
  decimals = 0,
  onKeyDown,
  ...props
}: NumericInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode={decimals > 0 ? "decimal" : "numeric"}
      autoComplete="off"
      value={value ?? ""}
      onKeyDown={(e) => {
        if (BLOCKED_KEYS.has(e.key) || (decimals <= 0 && (e.key === "." || e.key === ","))) {
          e.preventDefault();
        }
        onKeyDown?.(e);
      }}
      onChange={(e) => onValueChange(sanitizeNumericInput(e.target.value, decimals))}
    />
  );
}
