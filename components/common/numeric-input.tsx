"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

type NumericInputProps = Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> & {
  value: string | undefined;
  onValueChange: (value: string) => void;
  /** Allow a decimal part. Off = whole numbers only. */
  decimals?: number;
};

const BLOCKED_KEYS = new Set(["-", "+", "e", "E"]);

/** Strips everything except digits and (optionally) a single decimal point. */
export function sanitizeNumericInput(raw: string, decimals = 0): string {
  const normalized = raw.replace(/,/g, ".");
  if (decimals <= 0) return normalized.replace(/\D/g, "");

  const cleaned = normalized.replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  if (!rest.length) return whole;
  return `${whole}.${rest.join("").slice(0, decimals)}`;
}

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
